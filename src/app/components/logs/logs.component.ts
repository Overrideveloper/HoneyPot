declare var require: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DateService } from 'src/app/services/date.service';
const config = require('../../../config');

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  URL: any;
  logs: any = [];
  p = 1;

  constructor(public router: Router, public http: HttpClient, public date: DateService) { }

  ngOnInit() {
    this.URL = config.url;
    this.getLogs();
  }

  getLogs() {
    this.http.get(`${this.URL}logs/list`).subscribe((data: any) => {
      this.logs = data.data;
      console.log(this.logs);
    });
  }

  logout() {
    localStorage.removeItem('auth');
    this.router.navigate(['login']);
  }
}
