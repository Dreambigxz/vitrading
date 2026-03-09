import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {

  @Input() reward: number = 0
  @Input() wheel: string = ""
  visible = false

  open(reward:number, wheel:string){
    this.reward = reward
    this.wheel = wheel
    this.visible = true
  }

  close(){
    this.visible = false
  }

  get isWin(){
    return this.reward > 0
  }



}
