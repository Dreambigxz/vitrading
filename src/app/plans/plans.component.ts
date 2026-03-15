import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Header2Component } from '../components/header2/header2.component';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { MenuBottomComponent } from "../components/menu-bottom/menu-bottom.component";
import { TradingSummaryComponent } from "../trading-summary/trading-summary.component";

import { QuickNavService } from '../reuseables/services/quick-nav.service';
import { CountdownPipe } from '../reuseables/pipes/countdown.pipe';
import { CurrencyConverterPipe } from '../reuseables/pipes/currency-converter.pipe';

@Component({
  selector: 'app-plans',
  imports: [
    CommonModule,
    Header2Component,
    SpinnerComponent,
    MenuBottomComponent,
    TradingSummaryComponent,
    CountdownPipe,
    CurrencyConverterPipe
  ],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent {

  activePlans:any[] = [];
  completedPlans:any[] = [];
  history:any[] = [ ]

  page:string = 'active'

  constructor(public quickNav: QuickNavService) {}

  ngOnInit(){

    if (!this.quickNav.storeData.get('my_plan')) {
      this.quickNav.reqServerData.get('my-plan/').subscribe(()=>{
        this.preparePlans();
      });
    } else {
      this.preparePlans();
    }
  }

  // =========================
  // 🔥 PREPARE UI DATA ONCE
  // =========================
  preparePlans(){

    const store = this.quickNav.storeData.store;

    this.activePlans = (store['my_plans']?.active || []).map((p:any) => this.transformPlan(p));
    this.completedPlans = (store['my_plans']?.completed || []).map((p:any) => this.transformPlan(p));


    this.history = store['history']
  }

  transformPlan(plan:any){

    const planData = this.quickNav.storeData.store['PLANS'][plan.plan_id];

    const progress = this.getAccruedPercent(plan.created_at, planData.duration_days);

    const accrued = this.getAccruedProfit(planData, plan.amount, plan.created_at);

    const dailyInfo = this.calculateReturn(planData, plan.amount);

    return {
      ...plan,
      planData,
      progress,
      accrued,
      dailyInfo,
      remainingDays: this.getDaysDifference(this.endDate(plan.created_at, planData.duration_days))
    };
  }

  calculateReturn(plan:any, amount:any) {

    const percent = plan.profit_percent;
    const days = plan.duration_days;

    const dailyProfit = amount * (percent / 100);
    const totalProfit = dailyProfit * days;
    const totalReturn = amount + totalProfit;

    return [percent, dailyProfit, totalProfit, totalReturn, plan];
  }

  getAccruedPercent(created_at:any, duration_days:any): number {

    const start = new Date(created_at).getTime();
    const now = Date.now();

    const percent = ((now - start) / (1000 * 60 * 60 * 24 * duration_days)) * 100;

    return Math.min(100, Math.max(0, Math.floor(percent)));
  }

  getAccruedProfit(plan:any, amount:any, created_at:any) {

    const createdAt = new Date(created_at).getTime();
    const now = Date.now();

    let daysPassed = (now - createdAt) / (1000 * 60 * 60 * 24);

    daysPassed = Math.max(0, Math.min(daysPassed, plan.duration_days));

    const dailyProfit = parseFloat(amount) * (plan.profit_percent / 100);

    return {
      daysPassed: Math.floor(daysPassed),
      accrued: dailyProfit * daysPassed,
      dailyProfit
    };
  }

  endDate(created_at:any, duration_days:any) {

    const result = new Date(created_at);
    result.setDate(result.getDate() + duration_days);

    return result;
  }

  getDaysDifference(d1:any, d2=new Date()) {

    const diffTime = new Date(d1).getTime() - new Date(d2).getTime();

    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  getDailyProfit(plan_id:any,amount:any){
    const plan = this.quickNav.storeData.store['PLANS'][plan_id]

    let data = this.calculateReturn(plan,parseFloat(amount))
    return data
  }

  canCloseTrade(created_at_str:any, minutes:number=5){

    const expiry = new Date(created_at_str)
    expiry.setMinutes(expiry.getMinutes()+ minutes)

    return expiry
  }

  closeTrade(plan_id:any){

    this.quickNav.confirmation.confirmAction(
      ()=>{
        this.quickNav.reqServerData.post('my-plan/',{processor:'cancel_plan',plan_id}).subscribe()
      },
      "Close trade", `Are you sure ?`

    )
  }
}
