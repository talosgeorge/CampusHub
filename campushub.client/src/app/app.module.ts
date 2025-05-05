import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './components/Interceptor/auth.interceptor'
import { HTTP_INTERCEPTORS } from '@angular/common/http';


@NgModule({
  declarations: [], // Lasă gol - nu declarăm componente aici
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,  // Folosește AuthInterceptor
    multi: true  // Permite mai mulți interceptori
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
