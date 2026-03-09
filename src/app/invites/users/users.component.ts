import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';


// import { RouterLink, Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
// import { QuickNavService } from '../../reuseables/services/quick-nav.service';
import { CurrencyConverterPipe } from '../../reuseables/pipes/currency-converter.pipe';

import { InviteServices } from "../invite.service";

@Component({
  selector: 'app-users',
  imports: [CommonModule,CurrencyConverterPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {


  inviteService = inject(InviteServices)





}
