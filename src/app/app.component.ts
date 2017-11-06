import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GetVideosService } from './get-videos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  categories: {};

  // Inject HttpClient into your component or service.
  constructor(private http: HttpClient, private getVideos: GetVideosService) { }

  ngOnInit(): void {

    // Make the folders HTTP request:
    this.http.get<any[]>('https://ltesy9g9aa.execute-api.us-east-1.amazonaws.com/dev/folders').subscribe(data => {
      this.categories = data;
      console.log(this.categories);
    });
  }

}
