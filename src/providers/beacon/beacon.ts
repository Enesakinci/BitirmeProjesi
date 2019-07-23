import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBeacon } from '@ionic-native/ibeacon';

import { Platform, Events } from 'ionic-angular';

/*
  Generated class for the BeaconProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BeaconProvider {

  delegate: any;
  region: any;
  constructor(public http: HttpClient, public ibeacon: IBeacon,public platform: Platform, public events: Events) {
    console.log('Hello BeaconProvider Provider');
  }

  initialise(){
    let promise =new Promise((resolve,reject)=>{
      this.ibeacon.requestAlwaysAuthorization();
      this.delegate=this.ibeacon.Delegate();
      this.delegate.didRangeBeaconsInRegion()
      .subscribe(
      data => {
      this.events.publish("didRangeBeaconsInRegion", data);
      console.log("didRangeBeaconsInRegion", data);
      },
      error => console.error()
      );
  
      this.region = this.ibeacon.BeaconRegion("deskBeacon", "176ffa9d-2eb1-44ea-b434-5730c241d61a");
  
      this.ibeacon.startRangingBeaconsInRegion(this.region).then(()=>{resolve(true)},
      error=>{
        console.error("failed",error);
        resolve(false);
      }
    );
    });
    return promise;
  }

}
