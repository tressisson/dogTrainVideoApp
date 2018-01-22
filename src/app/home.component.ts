import { Component, OnInit } from '@angular/core';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
  constructor(private loggedIn: LoginService){}
  
  ngOnInit() {
  }

}
