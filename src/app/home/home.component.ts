import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  show = false;
  SignIn = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    device_name: new FormControl('iphone 12'),
    token_name: new FormControl('iphone12')
  });
  url = 'http://43.231.254.242:89/api/v1/auth/login';
  x: string | undefined;
  msg: any;
  res: any;
  accesToken: any;

  constructor(private elementRef: ElementRef, private http: HttpClient, private router: Router) { }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundImage = "url('../assets/img/10.jpg')";
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundSize = 'cover';
      
  }
  ngOnInit(): void {
    localStorage.setItem('Token', '');
  }
  password() {
    this.show = !this.show;
  }
  onSubmit() {
    console.log(this.SignIn.value)
    this.http.post(this.url, this.SignIn.value).subscribe(res => {
      console.log(res);
      this.res = res;

      if (this.res.status == "success") {
        this.accesToken = this.res.user.access_token
        localStorage.setItem('Token', this.accesToken);
        console.log(localStorage.getItem('Token'));
        this.router.navigate(['/Qrgenerator'])
      }
    },
      err => {
        console.log(err.error.message)
        console.log(err.status);
        if (err.status == 422) {
          this.msg = err.error.message
        }
      })
  }
}
