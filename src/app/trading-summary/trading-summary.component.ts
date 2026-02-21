import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AiIconComponent } from "../ai-icon/ai-icon.component";

import { QuickNavService } from '../reuseables/services/quick-nav.service';

@Component({
  selector: 'app-trading-summary',
  imports: [AiIconComponent,CommonModule],
  templateUrl: './trading-summary.component.html',
  styleUrl: './trading-summary.component.css'
})
export class TradingSummaryComponent {

  constructor(
    public quickNav: QuickNavService
  ){}
  
}
