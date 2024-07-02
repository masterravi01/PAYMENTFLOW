import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY =
    'BBO4lYcmviS7iyxvjp7ryl4ZIf0BqdDfZghh6nlU3tR9e0EtN7iNd3QRBGI2HH-Rk9yjmmvDvJg91DGjg7n2NWI';

  constructor(
    private swPush: SwPush,
    private http: HttpClient,
    private swUpdate: SwUpdate
  ) {}

  ngOnInit() {
    this.checkForUpdates();
    this.requestNotificationPermission();
  }

  checkForUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version available. Load new version?')) {
          window.location.reload();
        }
      });
    }
  }

  requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.');
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        this.requestSubscription();
      } else {
        console.log('User denied permission to send notifications.');
      }
    });
  }

  requestSubscription() {
    if (!this.swPush.isEnabled) {
      console.log('Push notifications are not enabled.');
      return;
    }

    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((subscription) => {
        this.sendSubscriptionToServer(subscription);
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }

  sendSubscriptionToServer(subscription: PushSubscription) {
    this.http
      .post('http://localhost:8888/rsp/api/subscribe', subscription)
      .subscribe(
        () => console.log('Subscription sent to server successfully'),
        (err) => console.error('Could not send subscription to server', err)
      );
  }
}
