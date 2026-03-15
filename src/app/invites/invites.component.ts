import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { CurrencyConverterPipe } from '../reuseables/pipes/currency-converter.pipe';
import { SpinnerComponent } from '../reuseables/http-loader/spinner.component';
import { Header2Component } from "../components/header2/header2.component";

import { TruncateCenterPipe } from '../reuseables/pipes/truncate-center.pipe';
import { QuickNavService } from '../reuseables/services/quick-nav.service';

import { MenuBottomComponent } from "../components/menu-bottom/menu-bottom.component";
import { InviteServices } from "./invite.service";
import { UsersComponent } from "./users/users.component";
import { InactiveComponent } from "./inactive/inactive.component";
// import { RouterLink, Router, RouterOutlet } from '@angular/router';
// import { ToastService } from '../../reuseables/toast/toast.service';

interface GenerationData {
  count: number;
  amount: number;
  last_updated?: string | null;
}



@Component({
  selector: 'app-invite',
  imports: [
    CommonModule,CurrencyConverterPipe,
    SpinnerComponent,Header2Component,
    TruncateCenterPipe,MenuBottomComponent,
    UsersComponent, InactiveComponent
  ],
  templateUrl: './invites.component.html',
  styleUrl: './invites.component.css'
})
export class InvitesComponent {


  quickNav = inject(QuickNavService)
  inviteService = inject(InviteServices)


  refLink:any

  walletData:any

  ngOnInit(){
      if (!this.quickNav.storeData.get('refDir')) {this.quickNav.reqServerData.get("promotions/").subscribe(
        (res)=>{

          console.log({res});

          this.makeRefLink()
          this.walletData=this.quickNav.storeData.get('wallet');
        }
      )}
    else{
      this.makeRefLink()
    }
  }

  makeRefLink() {
    const RefCode = this.quickNav.storeData.get('refDir')['RefCode'];
    this.refLink = `${window.location.origin}/register?invite=${RefCode}`;
  }

  share(platform: string) {

    const link = encodeURIComponent(this.refLink);
    const text = encodeURIComponent(
      "Join this crypto platform and earn rewards! 🚀"
    );

    let url = '';

    switch(platform){

      case 'whatsapp':
        url = `https://wa.me/?text=${text}%20${link}`;
        break;

      case 'telegram':
        url = `https://t.me/share/url?url=${link}&text=${text}`;
        break;

      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${link}`;
        break;

      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${text}&url=${link}`;
        break;

      case 'line':
        url = `https://social-plugins.line.me/lineit/share?url=${link}`;
        break;
    }

    window.open(url, '_blank');
  }

}
