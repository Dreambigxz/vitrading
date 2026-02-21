import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickNavService } from '../reuseables/services/quick-nav.service';

import { MarketService } from '../reuseables/services/market.service';
import { BaseChartDirective } from 'ng2-charts';

import { RouterModule,Router } from '@angular/router';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';

import { AiIconComponent } from "../ai-icon/ai-icon.component";

import { timer, switchMap } from 'rxjs';
@Component({
  selector: 'app-market',
  imports:[CommonModule,SpinnerComponent,
      BaseChartDirective, RouterModule,AiIconComponent
    ],
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  markets: any[] = [];
  quickMarkets: any[] = [];

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

  ngOnInit() {

    const quickSymbols = new Set(["BTC", "ETH", "XAUT"]);
    // !this.markets.length?"showSpinner":"hideSpinner"
    timer(0, 10000) // 🔥 immediate + every 5 seconds
      .pipe(
        switchMap(() => this.marketService.getMarketData())
      )
      .subscribe((data:any[]) => {

        const formatted = data.map(c => ({
          symbol: c.symbol?.toUpperCase(),
          pair: `${c.symbol?.toUpperCase()}/USDT`,
          price: c.current_price,
          change: c.price_change_percentage_24h,
          image: c.image,
          sparkline: c.sparkline_in_7d?.price ?? []
        }));

        this.markets = formatted;

        this.quickMarkets = formatted.filter(c =>
          quickSymbols.has(c.symbol)
        );

        console.log({formatted});


      });
  }

}
