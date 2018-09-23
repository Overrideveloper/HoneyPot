declare var require: any;
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
const config = require('../../../config');

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  URL: any;
  adminCount: any;
  admin = { 'username': '', 'password': '' };
  constructor(public http: HttpClient, public router: Router) { }

  ngOnInit() {
    this.URL = config.url;
    this.getAdminCount();
  }

  getAdminCount() {
    this.http.get(`${this.URL}admin/count`).subscribe((data: any) => {
      this.adminCount = data.data;
    });
  }

  submit() {
    const form = new FormData();
    form.append('username', this.admin.username);
    form.append('password', this.admin.password);

    this.http.post(`${this.URL}admin/login`, form).subscribe((data: any) => {
      if (data.code === 200 && data.message === true) {
        const itr = { 'id': data.data.id, 'username': data.data.username, 'group': 'Admin' };
        localStorage.setItem('auth', JSON.stringify(itr));
        this.router.navigate(['admin/landing']);
        swal('Login successful!', {
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
