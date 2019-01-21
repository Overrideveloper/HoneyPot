declare var require: any;
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
const config = require('../../../config');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  URL: any;
  user = { username: '', password: '', trial: '3' };

  constructor(public http: HttpClient, public router: Router) { }

  ngOnInit() {
    this.URL = config.url;
  }

  submit() {
    const form = new FormData();
    form.append('username', this.user.username);
    form.append('password', this.user.password);
    form.append('trial', this.user.trial);

    this.http.post(`${this.URL}auth/login/one`, form).subscribe((data: any) => {
      if (data.code === 200 && data.message === false) {
        this.user.trial = `${data.data.trial}`;
        if (data.data.trial !== 0) {
          swal(`${data.data.msg}`, {
            icon: 'info'
          });
        } else if (data.data.trial === 0) {
          swal(`Having trouble logging in? Enter your phone number for verification.`, {
            icon: 'info'
          });
          this.router.navigate([`verify/${this.user.username}/${this.user.trial}`]);
        }
      } else if (data.code === 200 && data.message === true) {
        swal(data.data, {
          icon: 'success'
        });
        this.router.navigate([`verification/${this.user.trial}`]);
      }
    });
  }

}
