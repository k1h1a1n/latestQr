import { Injectable } from '@angular/core';
import { Router,CanActivate } from '@angular/router';
import { UploadService } from '../upload.service';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private count = 0;
  private spinner$ = new BehaviorSubject<string>('');
  constructor(private router : Router , private service : UploadService) { }
  // CanActivate(): boolean {
  //   if (!this.service.isAuthenticated()) {
  //     this.router.navigate(['']);
  //     return false;
  //   }
  //   return true;
  // }
  getSpinnerObserver(): Observable<string> {
    return this.spinner$.asObservable();
  }

  requestStarted() {
    if (++this.count === 1) {
      this.spinner$.next('start');
    }
  }

  requestEnded() {
    if (this.count === 0 || --this.count === 0) {
      this.spinner$.next('stop');
    }
  }

  resetSpinner() {
    this.count = 0;
    this.spinner$.next('stop');
  }
}
