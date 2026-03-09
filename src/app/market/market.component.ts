import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickNavService } from '../reuseables/services/quick-nav.service';

import { MarketService } from '../reuseables/services/market.service';
import { BaseChartDirective } from 'ng2-charts';

import { RouterModule,Router,NavigationStart } from '@angular/router';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';

import { AiIconComponent } from "../ai-icon/ai-icon.component";

// import { timer, switchMap } from 'rxjs';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

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

  private stop$ = new Subject<void>();


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

    this.startPolling();

    // Listen for route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // If leaving home page → stop polling
        if (event.url!=='/') {
          this.stopPolling();
        }

        // If going back to home → restart
        if (event.url === '/' || event.url === '/home') {
          this.startPolling();
        }
      }
    });
  }

  startPolling() {

    const quickSymbols = new Set(["BTC", "ETH", "XAUT"]);
    console.log("pooling started");

    timer(0, 50000)
      .pipe(
        switchMap(() => this.marketService.getMarketData()),
        takeUntil(this.stop$)
      )
      .subscribe((data: any[]) => {

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
      });
  }

  stopPolling() {
    this.stop$.next();
    console.log("Destroyed");

  }

}
