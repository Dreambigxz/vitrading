import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreDataService } from '../../reuseables/http-loader/store-data.service';
import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';
import { AuthService } from '../../reuseables/auth/auth.service';
import { QuickNavService } from '../../reuseables/services/quick-nav.service';
import { NotiPopupComponent } from "../../noti-popup/noti-popup.component";

@Component({
  selector: 'app-header',
  imports: [CurrencyConverterPipe, CommonModule, NotiPopupComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  storeData = inject(StoreDataService)
  authService = inject(AuthService)
  quickNav = inject(QuickNavService)

  username = 'Daniel';
  balance = 2450.75;


}
