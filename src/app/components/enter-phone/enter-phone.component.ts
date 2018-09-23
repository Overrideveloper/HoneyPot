declare var require: any;
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
const config = require('../../../config');

@Component({
  selector: 'app-enter-phone',
  templateUrl: './enter-phone.component.html',
  styleUrls: ['./enter-phone.component.css']
})
export class EnterPhoneComponent implements OnInit {
  URL: any;
  phone = '';
  username: any;

  constructor(public http: HttpClient, public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');
    console.log(this.username);
    this.URL = config.url;
  }

  submit() {
    const form = new FormData();
    form.append('phone', this.phone);
    form.append('username', this.username);

    this.http.post(`${this.URL}auth/alert`, form).subscribe((data: any) => {
      if (data.code === 200) {
        this.router.navigate(['login']);
        swal(data.data, {
          icon: 'info'
        });
      }
    });
  }

}
