declare var require: any;
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
const config = require('../../../config');

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['./enter-otp.component.css']
})
export class EnterOtpComponent implements OnInit {
  URL: any;
  verification = '';

  constructor(public http: HttpClient, public router: Router) { }

  ngOnInit() {
    this.URL = config.url;
  }

  submit() {
    const form = new FormData();
    form.append('otp', this.verification);

    this.http.post(`${this.URL}auth/login/two`, form).subscribe((data: any) => {
      console.log(data);
      if (data.code === 200 && data.message === false) {
        swal(data.data, {
          icon: 'info'
        });
      } else if (data.code === 200 && data.message === true) {
        const itr = JSON.stringify({ 'id': data.data.user.id, 'username': data.data.user.username, group: 'User', 'user': data.data.user });
        localStorage.setItem('auth', itr);
        const userString = JSON.stringify(data.data.user);
        this.router.navigate([`landing`]);
        swal('Login successful!', {
          icon: 'success'
        });
      }
    });
  }

}
