import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Iurl } from './url';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VideoUrlService {
  url: {};
  historySet: any;
  title: string;

  constructor(private _http: HttpClient) { }

  getURL(ObjectId: string, email: string, title: string): void {
    this._http.get<any[]>('addyourendpoint' + ObjectId).subscribe(data => {
      this.url = data;
      //console.log(this.url);
      //console.log(email, ObjectId);
      this.setHistory(ObjectId, email);
      this.title = title;
      //console.log(this.title);
    });

  }

  setHistory(id: string, email: string): void {

    let historyInfo = {
      Email: email,
      ObjectId: id
    }
    this._http.put('addyourendpoint', historyInfo)
      .subscribe(
      res => {
        // console.log(res);
      },
      err => {
        // console.log("Error occured");
      }
      );
  };


}
