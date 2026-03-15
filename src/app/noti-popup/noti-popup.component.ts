import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MomentAgoPipe } from '../reuseables/pipes/moment.pipe';
import { Router } from '@angular/router';

import { StoreDataService } from '../reuseables/http-loader/store-data.service';
import { QuickNavService } from '../reuseables/services/quick-nav.service';

@Component({
  selector: 'app-noti-popup',
  imports: [CommonModule,MomentAgoPipe],
  templateUrl: './noti-popup.component.html',
  styleUrl: './noti-popup.component.css'
})
export class NotiPopupComponent {

  constructor(
    private storeData: StoreDataService,
    private router : Router,
    private quickNav: QuickNavService
  ){}
  notifications: any//[] = [];   // all messages from backend
  unreadNotifications: any[] = [];
  currentNotification: any = null;


  ngOnInit() {

    this.notifications =this.storeData.get('notification')

    this.unreadNotifications = this.notifications?.unseen//filter(n => !n.read);

    setTimeout(() => {
      this.showNotifications();
    }, 5000);

  }


  showNotifications() {

    if (!this.unreadNotifications?.length) return;

    let index = 0;

    if (!this.storeData.has('total_read')) {
      this.storeData.set('total_read', 0);
    }

    const showNext = () => {

      if (index >= this.unreadNotifications.length) {
        this.currentNotification = null;
        clearInterval(interval);
        return;
      }

      this.currentNotification = this.unreadNotifications.pop()//[index];
      // index++;

      this.storeData.store['total_read'] += 1;
    };

    // show first immediately
    showNext();

    const interval = setInterval(() => {
      showNext();
    }, 9000);

  }

  saveUnreadNoti() {
    if(!this.storeData.get('total_read'))return
    this.quickNav.reqServerData.post('notifications/?hideSpinner', {total_read:this.storeData.get('total_read'),processor:'save_read'}).subscribe((res)=>{
      this.quickNav.storeData.set('total_read',0)
    })
}


  closeNotif() {
    this.currentNotification = null;
    this.saveUnreadNoti()
  }


  readMore(notification:any) {

    notification.read = true;

    // open message page
    this.router.navigate(['/notifications']);

  }

}
