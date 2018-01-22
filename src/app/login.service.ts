import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class LoginService {

  loginSubject = new BehaviorSubject<boolean>(false);
  premMember = new BehaviorSubject<boolean>(false);
  userEmail = '';

  constructor() { }

  login(loggedIn: boolean, premium: boolean, username: string): void {
    this.loginSubject.next(loggedIn);
    this.premMember.next(premium);
    this.userEmail = username;
  }

  logout(): void {
    this.loginSubject.next(false);
    this.premMember.next(false);
  }

}
