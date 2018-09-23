declare var require: any;
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert';

const config = require('../../../config');

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  URL: any;
  admin = { username: '', password: '' };
  constructor(public http: HttpClient, public router: Router) { }

  ngOnInit() {
    this.URL = config.url;
  }

  submit() {
    const form = new FormData();
    form.append('username', this.admin.username);
    form.append('password', this.admin.password);

    this.http.post(`${this.URL}admin/new`, form).subscribe((data: any) => {
      if (data.code === 200 && data.message === true) {
        this.router.navigate(['admin/login']);
        swal('Admin created! Proceed to login.', {
          icon: 'success'
        });
      } else {
        swal(data.data, {
          icon: 'info'
        });
      }
    });
  }

}
