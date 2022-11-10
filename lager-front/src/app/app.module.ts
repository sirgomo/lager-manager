import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { KontrollerComponent } from './kontroller/kontroller.component';
import { ArtikelComponent } from './artikel/artikel.component';
import { KommisionierComponent } from './kommisionier/kommisionier.component';
import { VerkaufComponent } from './verkauf/verkauf.component';
import { LagerComponent } from './lager/lager.component';
import { WareneingangComponent } from './wareneingang/wareneingang.component';
import { WarenebuchungComponent } from './warenebuchung/warenebuchung.component';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {ToastrModule} from 'ngx-toastr'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { CreateKommisionierungComponent } from './create-kommisionierung/create-kommisionierung.component';
import { DatenpflegeComponent } from './datenpflege/datenpflege.component';
import { LoaderComponent } from './loader/loader.component';
import { LaderInterceptorInterceptor } from './loader/lader-interceptor.interceptor';







@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    KontrollerComponent,
    ArtikelComponent,
    KommisionierComponent,
    VerkaufComponent,
    LagerComponent,
    WareneingangComponent,
    WarenebuchungComponent,
    CreateKommisionierungComponent,
    DatenpflegeComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing'
    }),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: LaderInterceptorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
