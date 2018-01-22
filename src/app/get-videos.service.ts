import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { IVideo } from './videos';

@Injectable()
export class GetVideosService {

  private _productUrl = 'addyourendpoint';
  
  videos: IVideo[];
  video: {};

      constructor(private _http: HttpClient) { }

      getVideos(folderId: string): void {
        this._http.get<IVideo[]>(this._productUrl + '/objects?FolderId=' + folderId).subscribe(data => {
            this.videos = data;
            console.log(this._productUrl + '/objects?FolderId=' + folderId);
            console.log(this.videos);
          }); 
      }
 
      clickMe(id): void {
        console.log("clicked video service " + id);
      }

  

}
