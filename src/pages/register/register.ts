import { Component, ViewChild } from '@angular/core';
import { AlertController, App, LoadingController, IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { Http, Headers, RequestOptions } from "@angular/http";
import 'rxjs/add/operator/map';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-register',
	templateUrl: 'register.html',
})
export class RegisterPage {
	@ViewChild("username") username;
	@ViewChild("email") email;
	@ViewChild("password") password;
	@ViewChild("fullname") fullname;
	public loginForm: any;
	public backgroundImage = './assets/imgs/background.jpg';
	seeTabs: boolean = false;
	constructor(
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public app: App,
		public menuCtrl: MenuController,
		public navParams: NavParams,
		private http: Http
	) { }

	toLogin() {
		this.navCtrl.push(LoginPage);
	}

	ionViewDidEnter() {
		this.menuCtrl.swipeEnable(false);
	}

	ionViewWillLeave() {
		this.menuCtrl.swipeEnable(true);
	}

	Register() {
		if (this.username.value == "") {
			let alert = this.alertCtrl.create({
				title: "Hata",
				subTitle: "Kullanıcı Adı Boş!",
				buttons: ['OK']
			});
			alert.present();

		} else if (this.email.value == "") {

			let alert = this.alertCtrl.create({
				title: "Hata",
				subTitle: "Email Boş!",
				buttons: ['OK']
			});
			alert.present();

		} else if (this.fullname.value == "") {

			let alert = this.alertCtrl.create({
				title: "Hata",
				subTitle: "İsim Soyisim Boş!",
				buttons: ['OK']
			});
			alert.present();

		} else if (this.password.value == "") {

			let alert = this.alertCtrl.create({
				title: "Hata",
				subTitle: "Şifre Boş!",
				buttons: ['OK']
			});
			alert.present();

		} else {
			var headers = new Headers();
			headers.append("Accept", 'application/json');
			headers.append('Content-Type', 'application/json');
			let options = new RequestOptions({ headers: headers });
			let data = {
				username: this.username.value,
				email: this.email.value,
				password: this.password.value,
				fullname: this.fullname.value,
			};

			let loader = this.loadingCtrl.create({
				content: 'Lütfen Bekleyin',
			});

			loader.present().then(() => {
				this.http.post('http://enesakinci.cf/iii/register.php', data, options)
					.map(res => res.json())
					.subscribe(res => {
						loader.dismiss()
						if (res['status'] == "true") {
							let alert = this.alertCtrl.create({
								title: "Teşekkürler",
								subTitle: (res.message),
								buttons: ['OK']
							});
							alert.present();
							this.navCtrl.setRoot(LoginPage);
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
	}

}
