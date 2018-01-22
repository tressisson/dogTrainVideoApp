import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgbdAccordionStatic } from './accordion-static';
import { VideoUrlService } from './video-url.service';


@Component({
  //selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private videoLink: VideoUrlService) { }

}
