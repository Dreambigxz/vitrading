import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickNavService } from '../reuseables/services/quick-nav.service';

@Component({
  selector: 'app-account-summary',
  imports: [CommonModule],
  templateUrl: './account-summary.component.html',
  styleUrl: './account-summary.component.css'
})
export class AccountSummaryComponent {

  constructor(
    public quickNav: QuickNavService
  ){}

}
