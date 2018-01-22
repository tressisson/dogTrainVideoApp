import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdAccordionStatic } from './accordion-static';
import { GetVideosService } from './get-videos.service';
import { VideoUrlService } from './video-url.service';
import { HomeComponent } from './home.component';
import { HomeContentComponent } from './home-content.component';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';

const appRoutes: Routes = [
  { path: 'home', component: HomeContentComponent },
  { path: 'videos', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  declarations: [AppComponent, NgbdAccordionStatic, HomeComponent, HomeContentComponent, LoginComponent],
  imports: [NgbModule.forRoot(), BrowserModule, HttpClientModule, RouterModule.forRoot(
    appRoutes)
  ],
  // code for use hash add after array of path, { useHash: true }
  providers: [GetVideosService, VideoUrlService, NgbdAccordionStatic, LoginComponent, LoginService],
  bootstrap: [AppComponent, HomeComponent]
})
export class AppModule { }
