import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreDataService } from '../reuseables/http-loader/store-data.service';
import { MomentAgoPipe } from '../reuseables/pipes/moment.pipe';

@Component({
  selector: 'app-noti-popup',
  imports: [CommonModule,MomentAgoPipe],
  templateUrl: './noti-popup.component.html',
  styleUrl: './noti-popup.component.css'
})
export class NotiPopupComponent {

  constructor(
    private storeData: StoreDataService
  ){}
  notifications: any//[] = [];   // all messages from backend
  unreadNotifications: any[] = [];
  currentNotification: any = null;


  ngOnInit() {

    this.notifications =this.storeData.get('notification')

    console.log({noti:this.notifications});

    this.unreadNotifications = this.notifications?.unseen//filter(n => !n.read);

    this.showNotifications();
  }


  showNotifications() {

    if (this.unreadNotifications.length === 0) return;

    let index = 0;

    this.currentNotification = this.unreadNotifications[index];
    index++;

    const interval = setInterval(() => {

      if (index >= this.unreadNotifications.length) {
        clearInterval(interval);
        this.currentNotification = null;
        return;
      }

      this.currentNotification = this.unreadNotifications[index];
      index++;

    }, 8000); // every 5 seconds
  }


  closeNotif() {
    this.currentNotification = null;
  }


  readMore(notification:any) {

    notification.read = true;

    // open message page
    // this.router.navigate(['/messages', notification.id]);

  }

}
