import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Header2Component } from '../components/header2/header2.component';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { MenuBottomComponent } from "../components/menu-bottom/menu-bottom.component";
import {TradingSummaryComponent } from "../trading-summary/trading-summary.component";

import { QuickNavService } from '../reuseables/services/quick-nav.service';

import { CountdownPipe } from '../reuseables/pipes/countdown.pipe';

@Component({
  selector: 'app-plans',
  imports: [
    CommonModule,
    Header2Component,SpinnerComponent,MenuBottomComponent,
    TradingSummaryComponent, CountdownPipe
  ],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent {

  constructor(
    public quickNav: QuickNavService
  ){}

  ngOnInit(){
    if (!this.quickNav.storeData.get('my_plan')) {
      this.quickNav.reqServerData.get('my-plan/').subscribe((res)=>{
        console.log({res});
        // this.setPlan()
      })
    }
  }



  calculateReturn(plan:any,amount:any) {

    const percent = plan.profit_percent;
    const days = plan.duration_days;

    const dailyProfit = amount * (percent / 100);
    const totalProfit = dailyProfit * days;

    let totalReturn = amount + totalProfit;

    return [percent, dailyProfit, totalProfit, totalReturn, plan]

  }

  getDailyProfit(plan_id:any,amount:any){
    const plan = this.quickNav.storeData.store['PLANS'][plan_id]

    let data = this.calculateReturn(plan,parseFloat(amount))
    return data
  }

  getAccruedPercent(created_at:any, duration_days:any) {

    const start = new Date(created_at);
    const now = new Date();

    const diffMs = now.getTime() - start.getTime();

    const daysPassed = diffMs / (1000 * 60 * 60 * 24);

    let percent = (daysPassed / duration_days) * 100;

    // clamp between 0 and 100
    percent = Math.max(0, Math.min(percent, 100));

    return Math.floor(percent) ;
  }


  getAccruedProfit(plan:any, amount:any,created_at:any) {


    const createdAt = new Date(created_at);
    const now = new Date();

    const duration = plan.duration_days;
    const percent = plan.profit_percent;

    // calculate days passed
    const diffMs = now.getTime() - createdAt.getTime();
    let daysPassed = diffMs / (1000 * 60 * 60 * 24);

    // prevent negative
    daysPassed = Math.max(0, daysPassed);

    // limit to plan duration
    daysPassed = Math.min(daysPassed, duration);

    // daysPassed = 1

    // daily profit
    const dailyProfit = parseFloat(amount) * (percent / 100);
    let accrued = 0 ;
    // if (daysPassed>=1) {
    //   accrued = dailyProfit * daysPassed;
    // }
    accrued = dailyProfit * daysPassed;

    return {
      daysPassed: Math.floor(daysPassed),
      accrued: accrued,
      dailyProfit: dailyProfit
    };
  }

  endDate(created_at:any, duration_days:any) {

    const result = new Date(created_at);
    result.setDate(result.getDate() + duration_days);

    return result;
  }

  getDaysDifference(d1:any, d2=new Date()) {
    const date1 = new Date(d1);
    const date2 = new Date(d2);

    const diffTime = date1.getTime() - date2.getTime();

    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

}
