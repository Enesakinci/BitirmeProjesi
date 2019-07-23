import { Component, ViewChild,  } from '@angular/core';
import { ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { BLE } from '@ionic-native/ble'
import { App, LoadingController,NavController, Platform, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions }  from "@angular/http";
import { IBeacon } from '@ionic-native/ibeacon';
//import { BeaconModel } from "../../models/beacon-module";
import { BeaconProvider } from "../../providers/beacon/beacon";
import { NgZone } from "@angular/core";
//import { from } from 'rxjs/observable/from';
import { DetailPage } from '../detail/detail';
//import { distinct } from 'rxjs/operator/distinct';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	@ViewChild("sinif_adi") sinif_adi;
	devices: any[] = [];
	statusMessage: string;
	public  veri: any[];
	public items : any[];
	userdata: any = [];
	userdata1: any = [];
	public distance: any=[];
	public deger : boolean =false;
	public rssi : any[];
	//beacons: BeaconModel[] = [];
  zone: any;
  constructor(public navCtrl: NavController, 
	public alertCtrl: AlertController,
	public toastCtrl: ToastController,private ibeacon: IBeacon,
	public beaconProvider: BeaconProvider,public events: Events,
	public platform: Platform,
	public loadingCtrl: LoadingController,
	private ble: BLE,
	public app: App,
    private ngZone: NgZone,
	private http: Http
	) {
		this.zone = new NgZone({ enableLongStackTrace: false });
    	this.userdata = JSON.parse(localStorage.getItem('userlogin')) || [];
		console.log(this.userdata);
		var headers = new Headers();
		headers.append("Accept", 'application/json');
		headers.append('Content-Type', 'application/json' );
		let options = new RequestOptions({ headers: headers });
		let loader = this.loadingCtrl.create({
			content: 'Lütfen Bekleyin',
		});

		loader.present().then(() => {
			this.http.post('http://enesakinci.cf/iii/SelectSinif.php', options)
			.map(res => res.json())
			.subscribe(res => {
				loader.dismiss()
				if(res['status']=="true"){
					 console.log(res.userdata);
					 this.veri=res.userdata;	
				}
				}); 
					
				
			
		});
		loader.present().then(() => {
			this.http.post('http://enesakinci.cf/iii/SelectBeacon.php', options)
				.map(res => res.json())
				.subscribe(res => {
					loader.dismiss()
						if(res['status']=="true"){
							//console.log(JSON.stringify(res.userdata1) );
							 this.items=res.userdata1;
							 //console.log(JSON.stringify(this.userdata1));	
						}
					}); 
							
						
					
				});
		

  }

  logOut() {
		let alert = this.alertCtrl.create({
			title: 'Çıkış',
			message: 'Çıkış yapmak istediğinize emin misiniz ?',
			buttons: [
			{
				text: 'Hayır',
				role: 'cancel',
				handler: () => {
					console.log('Hayır seçildi');
				}
			},
			{
				text: 'Evet',
				handler: () => {
 					this.myToast("Başarıyla çıkış işlemi gerçekleşti!");
 					this.navCtrl.push(LoginPage);
 					localStorage.removeItem('userlogin');
 				}
 			}
 			]
 		});
		alert.present();
  }
  
  myToast(text){
		let toast = this.toastCtrl.create({
			message: text,
			duration: 3000,
			position: 'bottom',
			showCloseButton: true,
			closeButtonText: 'Çıkış'
		});
		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});

		toast.present();
	}
	scan(){
		this.setStatus('Scanning for Bluetooth LE Devices');
		this.devices = [];  // clear list
		this.rssi = []; 
		this.ble.scan([], 5).subscribe(
		  device => this.onDeviceDiscovered(device), 
		  error => this.scanError(error)
		);
			
		setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
	}
	onDeviceDiscovered(device) {
		console.log('Discovered ' + JSON.stringify(device, null, 2));
		console.log(device.id);

			for(var i=0;i<3;i++){
				console.log(JSON.stringify(this.items[i].ibeacon_MAC));
				if(device.id ==this.items[i].ibeacon_MAC.toUpperCase() ){
					console.log("Eşit");
					this.rssi.push(device.rssi);
					var txPower = -67 //hard coded power value. Usually ranges between -59 to -65
		
					if (device.rssi == 0) {
						console.log("-1");
						return -1.0; 
					}
		
					var ratio = device.rssi*1.0/txPower;
					if (ratio < 1.0) {
						return Math.pow(ratio,10);
					}
					else {
						//var distance1= (0.89976)*Math.pow(ratio,7.7095) + 0.111;
						this.distance[i] =  (0.89976)*Math.pow(ratio,7.7095) + 0.111;    
						console.log("Metre :",this.distance[i]);
					}
				}

			}
			
		this.deger=false;	
		if(this.distance[0]<3 && this.distance[1]<3 && this.distance[2]<3  ){
			this.deger=true;
			console.log("içerde");
			console.log( this.zone.kind);
			new Date().toISOString();
			var headers = new Headers();
			headers.append("Accept", 'application/json');
			headers.append('Content-Type', 'application/json');
			let options = new RequestOptions({ headers: headers });
			let data = {
			sinif_adi: this.zone.kind,
			ogr_no: this.userdata[0].username,
			isim: this.userdata[0].full_name,
			tarih: new Date().toISOString(),
			};
			let loader = this.loadingCtrl.create({
			content: 'Lütfen Bekleyin',
			});
			loader.present().then(() => {
			this.http.post('http://enesakinci.cf/iii/YoklamaEkle.php', data, options)
				.map(res => res.json())
				.subscribe(res => {
				loader.dismiss()
				if (res['status'] == "true") {
					let alert = this.alertCtrl.create({
					title: "Eklendi",
					subTitle: (res.message),
					buttons: ['OK']
					});
					alert.present();
					
				} else {
					let alert = this.alertCtrl.create({
					title: "Hata",
					subTitle: (res.message),
					buttons: ['OK']
					});
					alert.present();
				}
				});
			});
			
		}
		else if(this.deger==false){
			console.log("Dışarda");
			
		}
		this.ngZone.run(() => {
		  this.devices.push(device);
		  
		});
	  }
	  
	  // If location permission is denied, you'll end up here
	  scanError(error) {
		this.setStatus('Error ' + error);
		let toast = this.toastCtrl.create({
		  message: 'Error scanning for Bluetooth low energy devices',
		  position: 'middle',
		  duration: 5000
		});
		toast.present();
	  }
	
	  setStatus(message) {
		console.log(message);
		this.ngZone.run(() => {
		  this.statusMessage = message;
		});
	  }
	
	  deviceSelected(device) {
		// let characteristics;
		// this.ble.connect(device.id).subscribe(data => {
		//   characteristics = data.characteristics;
		// });
		console.log(JSON.stringify(device) + ' selected');
		this.navCtrl.push(DetailPage, {
		  device: device
		  // characteristics: characteristics
		});
	  }

	  
	
			
}
