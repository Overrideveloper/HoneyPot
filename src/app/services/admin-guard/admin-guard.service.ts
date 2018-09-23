import { Injectable } from '@angular/core';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService {

  constructor() { }

  canActivate() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth.id === null || auth.id === undefined || auth.id === '' || auth.group !== 'Admin') {
      swal('Access denied', {
        icon: 'info'
      });
      return false;
    }
    return true;
  }
}
