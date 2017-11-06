import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';

import {GetVideosService} from './get-videos.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [BrowserModule,HttpClientModule],
  providers: [GetVideosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
