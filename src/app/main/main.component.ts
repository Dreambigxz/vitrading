import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from "../components/header/header.component";
import { MarketComponent } from "../market/market.component";

import { RequestDataService } from '../reuseables/http-loader/request-data.service';
import { StoreDataService } from '../reuseables/http-loader/store-data.service';

import { MenuBottomComponent } from "../components/menu-bottom/menu-bottom.component";
import { QuickNotificationsComponent } from "../components/quick-notifications/quick-notifications.component";
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { QuickNavService } from '../reuseables/services/quick-nav.service';
import { TruncateCenterPipe } from '../reuseables/pipes/truncate-center.pipe';
import { CurrencyConverterPipe } from '../reuseables/pipes/currency-converter.pipe';

import { AppDownloadManager } from '../reuseables/services/app-download-manager.service';
import { AccountSummaryComponent } from "../account-summary/account-summary.component";
import { NotificationModalComponent } from '../shared/notification-modal/notification-modal.component';


@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent,
    MenuBottomComponent,
    CommonModule,
    QuickNotificationsComponent,
    SpinnerComponent,MarketComponent,
    TruncateCenterPipe, CurrencyConverterPipe, AccountSummaryComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent {

  storeData = inject(StoreDataService)
  reqServerData = inject(RequestDataService)

  quickNav = inject(QuickNavService)
  appManager = inject(AppDownloadManager)

  ngOnInit(){
    if (!this.storeData.get('wallet')) {
      this.reqServerData.get('dashboard/').subscribe((res)=>{
        console.log({res});

      })
    }
  }

}
