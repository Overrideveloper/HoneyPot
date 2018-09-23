declare var require: any;
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  public user: any;
  constructor(public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('auth')).user;
    console.log(this.user);
  }

  logout() {
    localStorage.removeItem('auth');
    this.router.navigate(['login']);
  }

}
