import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { Header2Component } from "../components/header2/header2.component";

import { QuickNavService } from '../reuseables/services/quick-nav.service';

@Component({
  selector: 'app-lucky-wheel',
  imports: [
    CommonModule,
    SpinnerComponent,
    Header2Component
  ],
  templateUrl: './lucky-wheel.component.html',
  styleUrl: './lucky-wheel.component.css'
})
export class LuckyWheelComponent {

  quickNav = inject(QuickNavService)

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

  wheel_type : string = 'basic'
  spinCount = 1

  rotation = 0
  isSpinning = false

  ngOnInit(){
    if (!this.quickNav.storeData.get("lucky_wheel")) {
      this.quickNav.reqServerData.get('lucky-wheel')
      .subscribe((res)=>{
        console.log([res]);

          this.setReward("basic")

      })
    }
  }

  setReward(wheel_type:string){

    this.wheel_type=wheel_type
    const wheels =  this.quickNav.storeData.get("lucky_wheel").WHEELS || {}
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

  spinWheel(){

    if(this.isSpinning || this.spinCount <= 0){
      return
    }

    this.isSpinning = true
    this.spinCount--

    const rewardIndex = Math.floor(Math.random() * this.rewards.length)

    const segment = 360 / this.rewards.length

    const stopAngle = (360 * 5) + (rewardIndex * segment)

    this.rotation += stopAngle

    setTimeout(()=>{

      this.isSpinning = false

      const reward = this.rewards[rewardIndex]

      alert(`You won ${reward}`)

    },5000)

  }

}
