declare var require: any;
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
const config = require('../../../config');

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  URL: any;
  user = { name: '', phone: '', serial: '', department: '', imei: '' };
  constructor(public http: HttpClient, public router: Router) { }

  ngOnInit() {
    this.URL = config.url;
  }

  submit() {
    const form = new FormData();
    form.append('name', this.user.name);
    form.append('phone', this.user.phone);
    form.append('serial_no', this.user.serial);
    form.append('department', this.user.department);
    form.append('imei', this.user.imei);

    this.http.post(`${this.URL}user/new`, form).subscribe((data: any) => {
      if (data.code === 200 && data.message === true) {
        this.router.navigate(['admin/landing']);
        swal(`The username for ${this.user.name} is ${data.data.username} and the password is ${data.data.password}.
          Ensure to store them a safe place.`, {
            icon: 'success'
          });
      } else {
        swal(data.data, {
          icon: 'info'
        });
      }
    });
  }

  logout() {
    localStorage.removeItem('auth');
    this.router.navigate(['login']);
  }

}
