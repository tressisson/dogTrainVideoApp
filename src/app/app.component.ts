import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  videos = [
    {
      category: "Welcome and Prep",
      video: [
        {
          title: "Welcome",
          description: "description for video"
        },
        {
          title: "Good Problems",
          description: "description for video"
        },
        {
          title: "Food Prep",
          description: "description for video"
        },
        {
          title: "Skipping Motivation",
          description: "description for video"
        }
      ]
    },
    {
      category: "Shopping List",
      video: [
        {
          title: "Everything Your Puppy Needs",
          description: "description for video"
        },
        {
          title: "26ft. Retractable Leash",
          description: "description for video"
        },
        {
          title: "Buckle Collar",
          description: "description for video"
        },
        {
          title: "Harness",
          description: "description for video"
        }
      ]
    }

  ];
}
