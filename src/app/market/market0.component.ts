import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickNavService } from '../reuseables/services/quick-nav.service';

import { MarketService } from '../reuseables/services/market.service';
import { BaseChartDirective } from 'ng2-charts';

import { RouterModule,Router } from '@angular/router';

@Component({
  selector: 'app-market',
  imports:[CommonModule, BaseChartDirective, RouterModule],
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  markets: any[] = [];

  constructor(
    private marketService: MarketService,
    public quickNav: QuickNavService,
    private router: Router
  ) {}

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { point: { radius: 0 } },
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  };

  // ngOnInit() {
  //
  //   const nav = this.router.getCurrentNavigation();
  //   const stateMarket = nav?.extras?.state?.['markets'];
  //
  //   console.log({stateMarket});
  //
  //
  //   // ✅ Load instantly if exists
  //   if (stateMarket && stateMarket.length) {
  //     this.markets = stateMarket;
  //   }
  //
  //   // ✅ Always refresh from API
  //   this.loadMarkets();
  //
  // }

  loadMarkets() {

    this.marketService.getMarketData().subscribe((data:any) => {

      console.log({data});


      const newMarkets = data.map((c:any) => ({
        pair: c.symbol.toUpperCase() + '/USDT',
        price: c.current_price,
        change: c.price_change_percentage_24h,
        image: c.image,
        sparkline: c.sparkline_in_7d?.prices || []
      }));

      this.markets = newMarkets;

      // ✅ Save latest markets into router state
      this.updateRouterState(newMarkets);

    });

  }

  updateRouterState(newMarkets:any[]) {

    this.router.navigate([], {
      state: { markets: newMarkets },
      replaceUrl: true   // IMPORTANT: don't create new history entry
    });

  }




  ngOnInit() {

    const nav = this.router.getCurrentNavigation();

    const stateMarket = nav?.extras?.state?.['markets'];


    console.log({stateMarket:stateMarket});
    if (stateMarket) {
      ///load market from stateMarket
    }

    this.marketService.getMarketData().subscribe((data:any) => {
      console.log({data});

      this.markets = data.map((c:any) => ({
          pair: c.symbol.toUpperCase() + '/USDT',
          price: c.current_price,
          change: c.price_change_percentage_24h,
          image:c.image,
          sparkline: c.sparkline_in_7d?.prices || []
        }));
        console.log({market:this.markets});

        // Always save to newMarkets to stateMarket


    });
  }
}
