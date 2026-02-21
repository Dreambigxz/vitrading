import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';

import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries
} from 'lightweight-charts';

import { MarketService } from '../reuseables/services/market.service';

@Component({
  selector: 'app-market-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-details.component.html',
  styleUrls: ['./market-details.component.css']
})
export class MarketDetailsComponent implements AfterViewInit {

  chart: any;
  candleSeries: any;
  volumeSeries: any;

  timeframes = ['1m','5m','15m','30m','1h','1d'];

  price = 0;
  change = 0;

  open = 0;
  high = 0;
  low = 0;
  close = 0;

  coin:any

  constructor(private marketService: MarketService) {}

  ngOnInit() {

    const nav = history.state;

    console.log({nav});


    // if (nav && nav.coin) {
    //   this.coin = nav.coin;
    //
    //   this.price = this.coin.price;
    //   this.change = this.coin.change;
    // }

  }

  ngAfterViewInit() {

    const container = document.getElementById('chartContainer')!;

    this.chart = createChart(container, {
      height: 350,
      layout: {
        background: { color: '#111' },
        textColor: '#DDD'
      }
    });

    this.candleSeries = this.chart.addSeries(CandlestickSeries);

    this.volumeSeries = this.chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: ''
    });

    this.loadCandles();
  }


  loadCandles() {

    this.marketService.getCandles('ETHUSDT','1h')
    .subscribe((data:any[]) => {
        console.log({data});

      const candles = data.map(k => ({
        time: k[0] / 1000,
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4])
      }));

      this.candleSeries.setData(candles);

    });

  }


  loadChart(interval: string) {

    this.marketService.getSparkline('ETHUSDT').subscribe((data:any) => {

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

      // update OHLC info from last candle
      const last = candles[candles.length - 1];

      this.open = last.open;
      this.high = last.high;
      this.low = last.low;
      this.close = last.close;
      this.price = last.close;

      this.candleSeries.setData(candles);
      this.volumeSeries.setData(volumes);

    });

  }

  loadChartFromData() {

    if (!this.coin || !this.coin.sparkline) return;

    const prices = this.coin.sparkline.map((p:any, i:number) => ({
      time: Math.floor(p[0] / 1000),
      value: p
    }));

    this.candleSeries.setData(prices);

  }

}
