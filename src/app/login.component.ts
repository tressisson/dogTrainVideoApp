import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginState: boolean = false;
  loginInvalid: boolean = false;
  loginWrongPassword: boolean = false;

  constructor(private _http: HttpClient, public router: Router, public loginService: LoginService) { }

  loginObj = {};
  

  login(username: string, password: string) {
    this.loginObj = {};
    this._http.get<any[]>('addyourendpoint' + username + '&key=' + password).subscribe(data => {
      this.loginObj = data;
     // console.log(this.loginObj);

      if(this.loginObj['contact'].status == 'Not found') {
        this.loginInvalid = true;
      } 
      
      if(this.loginObj['contact'].status == 'Password mismatch') {
        this.loginWrongPassword = true;
      }

      if(this.loginObj['contact'].status === 'Authenticated') {
        this.loginWrongPassword = false;
        this.loginInvalid = false;
        this.loginState = true;
        

        if(this.loginObj['contact'].tags[1] === "Champion Puppy Training System Purchase") {
          this.loginService.login(true, true, username);
        } else {
          this.loginService.login(true, false, username);
        }

        this.router.navigate([ '/videos' ]);
      }

    });
    
    

  }



}
