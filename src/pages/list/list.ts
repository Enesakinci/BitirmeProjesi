import { Component } from '@angular/core';
import { AlertController, App, LoadingController, NavController, NavParams, MenuController } from 'ionic-angular';
import { Http, Headers, RequestOptions }  from "@angular/http";


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  public  veri: any[];

  constructor(public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public app: App,
		public menuCtrl: MenuController, 
    public navParams: NavParams,
    private http: Http) {

      var headers = new Headers();
			headers.append("Accept", 'application/json');
			headers.append('Content-Type', 'application/json' );
      let options = new RequestOptions({ headers: headers });
      let loader = this.loadingCtrl.create({
				content: 'Lütfen Bekleyin',
			});

			loader.present().then(() => {
				this.http.post('http://enesakinci.cf/iii/Duyurugetir.php', options)
				.map(res => res.json())
				.subscribe(res => {
					loader.dismiss()
					if(res['status']=="true"){
             console.log(res.userdata);
             			this.veri=res.userdata;	
          }
					}); 
						
					
				
			});


  }



}
