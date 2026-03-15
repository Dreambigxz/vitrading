import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Header2Component } from '../components/header2/header2.component';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { MenuBottomComponent } from "../components/menu-bottom/menu-bottom.component";
import {TradingSummaryComponent } from "../trading-summary/trading-summary.component";

import {  FormsModule } from '@angular/forms';
// import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { QuickNavService } from '../reuseables/services/quick-nav.service';
import { CurrencyConverterPipe } from '../reuseables/pipes/currency-converter.pipe';

@Component({
  selector: 'app-create-ai',
  imports: [
    CommonModule,Header2Component,SpinnerComponent,TradingSummaryComponent,
    FormsModule, MenuBottomComponent,CurrencyConverterPipe
  ],
  templateUrl: './create-ai.component.html',
  styleUrl: './create-ai.component.css'
})
export class CreateAiComponent {

  constructor(
    public quickNav: QuickNavService,
    private currencyPipe: CurrencyConverterPipe
  ){}

  plan:any;
  plan_id:any=0
  trade_amount = 0
  totalReturn = 0
  min_investment:any

  ngOnInit(){
    if (!this.quickNav.storeData.get('PLANS')) {
      this.quickNav.reqServerData.get('create-plan/').subscribe((res)=>{
        console.log({res});
        this.setPlan()

      })
    }else{
      this.setPlan()
    }
  }

  onPlanChange(event:any) {

    const plan_id = event.target.value;
    this.setPlan(plan_id)
  }

  setPlan(plan_id:number=0){
    this.plan_id = plan_id
    const PLANS = this.quickNav.storeData.get('PLANS')
    this.plan = PLANS[plan_id]
    this.calculateReturn()
  }

  onAmountKeyup(event:any) {
    const amount = event.target.value;
    this.calculateReturn()

  }

  calculateReturn() {

    if(!this.plan ) {
    // if(!this.plan || !this.trade_amount || this.trade_amount < this.plan.min_investment) {
      this.totalReturn = 0;
      return;
    }

    const percent = this.plan.profit_percent;
    const days = this.plan.duration_days;

    const dailyProfit = this.trade_amount * (percent / 100);
    const totalProfit = dailyProfit * days;

    this.totalReturn = this.trade_amount + totalProfit;

    this.min_investment = this.currencyPipe.transform(this.plan.min_investment)


  }

  handleSubmit(){

    const data =  {plan_id:parseInt(this.plan_id),amount:this.trade_amount,processor:'create_plan'}

    this.quickNav.confirmation.confirmAction(
      ()=>{
        this.quickNav.reqServerData.post('create-plan/',data).subscribe((res)=>{
          if (res.status==='success') {
            this.quickNav.go('my-plan')
            // this.quickNav.confirmation.confirmAction(
            //   ()=>this.quickNav.go('my-plan'),
            //   "Change page", "View my plans"
            // )
          }

        })
      },
      "Plan", `About to create <br>Plan:VI-${this.plan_id}<br>Amount:${this.currencyPipe.init_currency.symbol}${this.trade_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>`

    )


  }


}
