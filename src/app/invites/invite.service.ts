import { Injectable } from '@angular/core';
import { StoreDataService } from '../reuseables/http-loader/store-data.service'; // ✅ adjust path as needed
import { QuickNavService } from '../reuseables/services/quick-nav.service';

@Injectable({
  providedIn: 'root'
})
export class InviteServices {

  constructor(
    public storeData: StoreDataService,
    public quickNav: QuickNavService
  ) {}

  page: string = 'commissions';
  level: string = 'all';
  users : any = [ ]

  pending_users = false

  get calculateTabData() {

    const ref = this.storeData.store['refDir'];
    const page = this.page;
    const level = this.level;

    console.log({level});


    const data = {
      amount: 0,
      count: 0,
      deposit: { amount: 0, count: 0 },
      withdraw: { amount: 0, count: 0 },
      // users: [ ]
    };

    const getGen = (key: string, gen: number) => {
      return ref?.[key]?.[`generation_${gen}`] || { count: 0, amount: 0 };
    };

    const sumGen = (key: string, target: any) => {
      for (let g = 1; g <= 3; g++) {
        const d = getGen(key, g);
        target.amount += d.amount || 0;
        target.count += d.count || 0;
      }
    };

    const gen = parseInt(level.replace('level', '')) || 1;

    /* COMMISSIONS */
    if (page === 'commissions') {

      if (level === 'all') {
        sumGen('referral', data);
        sumGen('rebate', data);
      } else {
        const r = getGen('referral', gen);
        const b = getGen('rebate', gen);

        data.amount = (r.amount || 0) + (b.amount || 0);
        data.count = (r.count || 0) + (b.count || 0);
      }
    }

    /* TRANSACTIONS */
    if (page === 'transactions') {

      if (level === 'all') {
        sumGen('deposit', data.deposit);
        sumGen('withdraw', data.withdraw);
      } else {
        Object.assign(data.deposit, getGen('deposit', gen));
        Object.assign(data.withdraw, getGen('withdraw', gen));
      }
    }

    /* USERS */
    if (page === 'users') {


      if (this.level.includes('pending')){
        this.users = this.loadUser(this.level)
      }else{
        this.users = this.loadUser(gen)
      }

    }

    return data;
  }

  loadUser(generation:any){


    if (!this.quickNav.storeData.get('promotionLevel_'+generation)) {
        this.quickNav.reqServerData.get('promotions/?level='+generation).subscribe({next: res => {
          return this.quickNav.storeData.get('promotionLevel_'+generation)
        }})
      }

      return this.quickNav.storeData.get('promotionLevel_'+generation)

  }

}
