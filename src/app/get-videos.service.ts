import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { IVideo } from './videos';

@Injectable()
export class GetVideosService {

  private _productUrl = 'https://ltesy9g9aa.execute-api.us-east-1.amazonaws.com/dev';
  
      constructor(private _http: HttpClient) { }
  /*
      getVideos(folderId: string): Observable<IVideo[]> {
          return this._http.get<IVideo[]>(this._productUrl + '/objects?FolderId=' + folderId);
              
      }
  
      getVideo(id: number): Observable<IVideo> {
          return this.getProducts()
              .map((products: IVideo[]) => products.find(p => p.productId === id));
      }
*/
      tryMe(): void {
        alert("I'm clicked");
      }

  

}
