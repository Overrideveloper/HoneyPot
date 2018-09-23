declare var require: any;
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
const config = require('../../../config');

@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.css']
})
export class AdminLandingComponent implements OnInit {
  URL: any;
  users: any = [];
  constructor(public router: Router, public http: HttpClient) { }

  ngOnInit() {
    this.URL = config.url;
    this.getUsers();
  }

  getUsers() {
    this.http.get(`${this.URL}user/list`).subscribe((data: any) => {
      this.users = data.data;
    });
  }

  logout() {
    localStorage.removeItem('auth');
    this.router.navigate(['login']);
  }
}
