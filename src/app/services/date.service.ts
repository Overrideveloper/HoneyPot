import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  setOrdinal(d) {
    // https://stackoverflow.com/questions/15397372/javascript-new-date-ordinal-st-nd-rd-th
    if (d > 3 && d < 21) {
      return 'th';
    }
    switch (d % 10) {
      case 1:  return 'st';
      case 2:  return 'nd';
      case 3:  return 'rd';
      default: return 'th';
    }
  }

  convertToDateOnly(timestamp) {
    // https://www.w3schools.com/jsref/jsref_getmonth.asp
    const month = new Array();
    month[0] = 'January';
    month[1] = 'February';
    month[2] = 'March';
    month[3] = 'April';
    month[4] = 'May';
    month[5] = 'June';
    month[6] = 'July';
    month[7] = 'August';
    month[8] = 'September';
    month[9] = 'October';
    month[10] = 'November';
    month[11] = 'December';

    const d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = d.getMonth(),	// Months are zero based.
      dd = d.getDate(),
      hh = d.getHours(),
      min = ('0' + d.getMinutes()).slice(-2); // Add leading 0.

    let h = hh, ampm = 'AM', date;

    if (hh > 12) {
      h = hh - 12;
      ampm = 'PM';
    } else if (hh === 12) {
      h = 12;
      ampm = 'PM';
    } else if (hh === 0) {
      h = 12;
    }


    // ie: 2013-02-18, 8:35 AM
    date = `${month[mm]} ${dd}${this.setOrdinal(dd)} ${yyyy}`;
    return date;
  }

  convertToDate(timestamp) {
    // https://www.w3schools.com/jsref/jsref_getmonth.asp
    const month = new Array();
    month[0] = 'January';
    month[1] = 'February';
    month[2] = 'March';
    month[3] = 'April';
    month[4] = 'May';
    month[5] = 'June';
    month[6] = 'July';
    month[7] = 'August';
    month[8] = 'September';
    month[9] = 'October';
    month[10] = 'November';
    month[11] = 'December';

    const d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = d.getMonth(),	// Months are zero based.
      dd = d.getDate(),
      hh = d.getHours(),
      min = ('0' + d.getMinutes()).slice(-2); // Add leading 0.

    let h = hh, ampm = 'AM', date;

    if (hh > 12) {
      h = hh - 12;
      ampm = 'PM';
    } else if (hh === 12) {
      h = 12;
      ampm = 'PM';
    } else if (hh === 0) {
      h = 12;
    }


    // ie: 2013-02-18, 8:35 AM
    date = `${month[mm]} ${dd}${this.setOrdinal(dd)} ${yyyy} ${h}:${min} ${ampm}`;
    return date;
  }

  getTimeOfDay(timestamp) {
    const d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
    hh = d.getHours(); // Add leading 0.

    let h = hh, ampm = 'AM', timeOfDay;

    if (hh > 12) {
      h = hh - 12;
      ampm = 'PM';
    } else if (hh === 12) {
      h = 12;
      ampm = 'PM';
    } else if (hh === 0) {
      h = 12;
    }

    if (ampm === 'AM') {
      timeOfDay = 'Morning';
    } else {
      if (ampm === 'PM' && h < 5) {
        timeOfDay = 'Afternoon';
      } else if (ampm === 'PM' && h >= 5) {
        timeOfDay = 'Evening';
      }

      if (ampm === 'PM' && h === 12) {
        timeOfDay = 'Afternoon';
      }
    }

    return timeOfDay;
  }
}
