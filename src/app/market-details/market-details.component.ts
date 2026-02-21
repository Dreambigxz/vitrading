import { CommonModule } from '@angular/common';
import { Header2Component } from '../components/header2/header2.component';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';

import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Component, AfterViewInit } from '@angular/core';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries
} from 'lightweight-charts';
import { MarketService } from '../reuseables/services/market.service';


@Component({
  selector: 'app-market-details',
  imports: [
      CommonModule,Header2Component,SpinnerComponent,
    ],
  templateUrl: './market-details.component.html',
  styleUrl: './market-details.component.css'
})
export class MarketDetailsComponent implements AfterViewInit {

   chartDestroyed= false
  chart: any;
  candleSeries: any;
  volumeSeries: any;

  timeframes = ['1m','5m','15m','30m','1h','1d'];
  activeTimeFrame = '15m'
  price: number = 0;
  change: number = 0;

  open: number = 0;
  high: number = 0;
  low: number = 0;
  close: number = 0;

  coin:any

  constructor(
    private marketService: MarketService,
    private router: Router
  ) {}

  ngOnInit() {

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      if (event.urlAfterRedirects.toLowerCase().includes('market-details')) {
        this.initChart();   // re-init chartZ
      }

    });
    // if (this.activeTimeFrame) this.loadChart(this.activeTimeFrame);
  }

  initChart() {
    const nav = history.state;

    if (nav && nav.coin) {
      this.coin = nav.coin;
    }

    this.destroyChart(); // safe

    this.chartDestroyed = false;

    this.chart = createChart(
      document.getElementById('chartContainer')!,
      {
        height: 350,
        layout: {
          background: { color: '#111' },
          textColor: '#DDD'
        },
        grid: {
          vertLines: { color: '#222' },
          horzLines: { color: '#222' }
        }
      }
    );

    this.candleSeries = this.chart.addSeries(CandlestickSeries);

    this.volumeSeries = this.chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: ''
    });

    this.loadChart(this.activeTimeFrame);

  }

  ngAfterViewInit() {
    this.initChart()
  }


  loadChart(interval: string) {

    // console.log({interval, coin:this.coin});


    this.activeTimeFrame = interval
    const symbol = this.coin.pair.replaceAll('/','')

    this.marketService.getCandles(symbol, interval)
    .subscribe((data:any) => {

      if (!Object.keys(data))return

      const candles = data.map((k:any) => ({
        time: k[0] / 1000,
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4])
      }));

      const volumes = data.map((k:any) => ({
        time: k[0] / 1000,
        value: parseFloat(k[5]),
        color: parseFloat(k[4]) >= parseFloat(k[1])
          ? '#16c784'
          : '#ea3943'
      }));

      // ⭐ GET CURRENT OHLC VALUES
      const last = candles[candles.length - 1];
      const prev = candles[candles.length - 2];


      this.open = last.open;
      this.high = last.high;
      this.low = last.low;
      this.close = last.close;
      this.price = last.close;

      this.change = ((last.close - prev.close) / prev.close) * 100;

      this.candleSeries.setData(candles);
      this.volumeSeries.setData(volumes);

    });
  }

  destroyChart() {

  if (this.chart && !this.chartDestroyed) {
    try {
      this.chart.remove();
    } catch(e) {
      console.warn('Chart already disposed');
    }

    this.chartDestroyed = true;
    this.chart = null;
  }

}



}
