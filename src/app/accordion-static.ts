import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GetVideosService } from './get-videos.service';
import { VideoUrlService } from './video-url.service';
import { LoginService } from './login.service';

@Component({
  selector: 'ngbd-accordion-static',
  templateUrl: './accordion-static.html',
  styleUrls: ['./accordion-static.css']
})
export class NgbdAccordionStatic implements OnInit {
  categories: {};
  videoList: {};
  history: {};

  constructor(private http: HttpClient, private getVideos: GetVideosService, private getURL: VideoUrlService, private login: LoginService) { }

  ngOnInit(): void {

    this.http.get<any[]>('addyourendpoint').subscribe(data => {
      this.history = data;
      //console.log(this.history);
      this.history = {};
    });

    this.http.get<any[]>('addyourendpoint').subscribe(data => {
      this.categories = data;
     // console.log(this.categories);
    });

    this.http.get<any[]>('addyourendpoint').subscribe(data => {
      this.videoList = data;
     // console.log(this.videoList);
    });
  }
}