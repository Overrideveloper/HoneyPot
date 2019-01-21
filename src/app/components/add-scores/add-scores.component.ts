declare var require: any;
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
const config = require('../../../config');

@Component({
  selector: 'app-add-scores',
  templateUrl: './add-scores.component.html',
  styleUrls: ['./add-scores.component.css']
})
export class AddScoresComponent implements OnInit {
  URL: any;
  id: any;
  name: any;
  user = { ca1: 0, ca2: 0, ca3: 0 };
  constructor(public http: HttpClient, public router: Router, public route: ActivatedRoute) { 
  	this.id = this.route.snapshot.paramMap.get('id');
    this.URL = config.url;
  }

  ngOnInit() {
  	this.getName();
  }

  submit() {
    const form = new FormData();
    form.append('id', this.id);
    form.append('ca1', `${this.user.ca1}`);
    form.append('ca2', `${this.user.ca2}`);
    form.append('ca3', `${this.user.ca3}`);

    this.http.post(`${this.URL}user/scores`, form).subscribe((data: any) => {
      if (data.code === 200 && data.message === true) {
        this.router.navigate(['admin/landing']);
        swal(`Continuous Assessment Scores Saved!`, {
            icon: 'success'
          });
      } else {
        swal(data.data, {
          icon: 'info'
        });
      }
    });
  }

  getName() {
  	console.log(this.id);
  	const form = new FormData();
  	form.append('id', this.id);

  	this.http.post(`${this.URL}username`, form).subscribe((data: any) => {
  		if (data.code === 200 && data.message === true) {
  			this.name = data.data['name'];
  			this.user.ca1 = data.data['ca1'];
  			this.user.ca2 = data.data['ca2'];
  			this.user.ca3 = data.data['ca3'];
  		} else {
	        swal(data.data, {
	          icon: 'info'
	        });
	        this.router.navigate(['admin/landing']);
  		}
  	});
  }

  logout() {
    localStorage.removeItem('auth');
    this.router.navigate(['login']);
  }

}
