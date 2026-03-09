import { Component, inject, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { Header2Component } from "../components/header2/header2.component";

import { QuickNavService } from '../reuseables/services/quick-nav.service';
import { ResultComponent } from "./result/result.component";

@Component({
  selector: 'app-lucky-wheel',
  imports: [
    CommonModule,
    SpinnerComponent,
    Header2Component,
    ResultComponent
  ],
  templateUrl: './lucky-wheel.component.html',
  styleUrl: './lucky-wheel.component.css'
})
export class LuckyWheelComponent {

  quickNav = inject(QuickNavService)
  @ViewChild('resultModal') resultModal:any;

  rewards = [ ] //any = [ ]
  x = [
    {label:'1 USDT', value:1},
    {label:'5 USDT', value:5},
    {label:'10 USDT', value:10},
    {label:'20 USDT', value:20},
    {label:'30 USDT', value:30},
    {label:'50 USDT', value:50},
    // {label:'100 USDT', value:100},
    // {label:'200 USDT', value:0}
  ]

  SPINS : any
  wheelTypes = ['basic', 'intermediate', 'advanced'];
  rules:any = [ ]

  wheel_type : string = 'basic'
  spinCount = 0
  wheelCount = 0

  spinID: any
  rotation = 0
  isSpinning = false

  ngOnInit(){
    if (!this.quickNav.storeData.get("lucky_wheel")) {
      this.quickNav.reqServerData.get('lucky-wheel')
      .subscribe((res)=>{
        // console.log([res]);

          this.setReward("basic", true)

      })
    }
  }

  setReward(wheel_type:string,just_loaded:boolean=false){

    this.spinCount = 0;
    this.wheelCount = 0

    const lucky_wheel = this.quickNav.storeData.get("lucky_wheel")
    this.SPINS = lucky_wheel.SPINS
    this.rules = lucky_wheel.RULES

    console.log({lucky_wheel});

    // check if wheel_type has active spin
    let [activeSpin] = lucky_wheel?.SPINS[wheel_type] || []

    if (activeSpin) {
      this.spinCount = activeSpin.spins - activeSpin.used_spins
      this.spinID = activeSpin.id
      this.wheelCount = lucky_wheel?.SPINS[wheel_type].length
    }


    this.wheel_type=wheel_type
    const wheels =  lucky_wheel?.WHEELS || {}
    this.rewards = wheels[wheel_type]?.rewards

  }

  get segmentAngle() {

    return 360 / this.rewards.length;
  }

  get wheelGradient() {


    if (!this.rewards.length) return
    const angle = 360 / this.rewards.length;
    const gap = 2;

    return `conic-gradient(${this.rewards.map((_, i) => {

      const start = i * angle;
      const end = start + angle - gap;

      let color = i % 2 ? '#a034fa' : '#b493d8';
      if (i==0) {
        color='#adb5bd'
      }

      return `
        ${color} ${start}deg ${end}deg,
        transparent ${end}deg ${start + angle}deg
      `;

    }).join(',')})`;

  }


  spinWheel(wheel_type:string) {

    if (this.isSpinning || this.spinCount <= 0) {
      return;
    }

    this.isSpinning = true;

    const segment = 360 / this.rewards.length;

    this.rotation += 360 * 20;

    this.quickNav.reqServerData.post('lucky-wheel/', {wheel_type, id:this.spinID})
    .subscribe((res:any)=>{


        const lucky_wheel_res = res.lucky_wheel_result

        const rewardIndex = lucky_wheel_res.index;

        const stopAngle = (360 * 5) + (rewardIndex * segment);

        this.rotation += stopAngle;

        setTimeout(()=>{


          this.isSpinning = false
          this.setReward(this.wheel_type)

          const reward = lucky_wheel_res.reward

          this.resultModal.open(reward, wheel_type)

        },5000)

    })

  }

}
