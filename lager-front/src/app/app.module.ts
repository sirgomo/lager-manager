import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { KontrollerComponent } from './kontroller/kontroller.component';
import { ArtikelComponent } from './artikel/artikel.component';
import { KommisionierComponent } from './kommisionier/kommisionier.component';
import { VerkaufComponent } from './verkauf/verkauf.component';
import { LagerComponent } from './lager/lager.component';
import { WareneingangComponent } from './wareneingang/wareneingang.component';
import { WarenebuchungComponent } from './warenebuchung/warenebuchung.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { CreateKommisionierungComponent } from './create-kommisionierung/create-kommisionierung.component';
import { DatenpflegeComponent } from './datenpflege/datenpflege.component';
import { LoaderComponent } from './loader/loader.component';
import { LaderInterceptorInterceptor } from './loader/lader-interceptor.interceptor';
import { PdfkommissComponent } from './pdfkommiss/pdfkommiss.component';
import { AdminComponent } from './admin/admin.component';
import { UsersComponent } from './admin/users/users.component';
import { CreateUserComponent } from './admin/users/create-user/create-user.component';
import { DebitorsComponent } from './datenpflege/debitors/debitors.component';
import { AddDebitorComponent } from './datenpflege/debitors/add-debitor.component';
import { FilterNullItemPipePipe } from './pipes/filter-null-item-pipe.pipe';
import { SpeditorsComponent } from './datenpflege/speditors/speditors.component';
import { AddSpedition } from './datenpflege/speditors/addSpedition';
import { NeupalComponent } from './kommisionier/neupal/neupal.component';
import { AddartikelComponent } from './kommisionier/addartikel/addartikel.component';
import { FindWareComponent } from './kommisionier/find-ware/find-ware.component';
import { KommissComponent } from './kontroller/kommiss/kommiss.component';
import { PalettenComponent } from './kontroller/paletten/paletten.component';
import { FindArtikelComponent } from './find-artikel/find-artikel.component';
import { StellplazteComponent } from './lager/stellplazte/stellplazte.component';
import { ArtinbestComponent } from './lager/artinbest/artinbest.component';
import { StellplatzeComponent } from './wareneingang/stellplatze/stellplatze.component';
import { PalControlComponent } from './kontroller/pal-control/pal-control.component';
import { VorschlagComponent } from './vorschlag/vorschlag.component';
import { VorZeigenComponent } from './vorschlag/vor-zeigen/vor-zeigen.component';
import { PacklistenComponent } from './kontroller/packlisten/packlisten.component';
import { PacklisteComponent } from './print-layout/packliste.component';
import { PalgewichtComponent } from './kontroller/palgewicht/palgewicht.component';
import { FirmaComponent } from './admin/firma/firma.component';
import { WausgangComponent } from './wausgang/wausgang.component';
import { ShowKommComponent } from './wausgang/show-komm/show-komm.component';
import { LkwPaletenComponent } from './wausgang/lkw-paleten/lkw-paleten.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    KontrollerComponent,
    ArtikelComponent,
    KommisionierComponent,
    VerkaufComponent,
    LagerComponent,
    WareneingangComponent,
    WarenebuchungComponent,
    CreateKommisionierungComponent,
    DatenpflegeComponent,
    LoaderComponent,
    PdfkommissComponent,
    AdminComponent,
    UsersComponent,
    CreateUserComponent,
    DebitorsComponent,
    AddDebitorComponent,
    FilterNullItemPipePipe,
    SpeditorsComponent,
    AddSpedition,
    NeupalComponent,
    AddartikelComponent,
    FindWareComponent,
    KommissComponent,
    PalettenComponent,
    FindArtikelComponent,
    StellplazteComponent,
    ArtinbestComponent,
    StellplatzeComponent,
    PalControlComponent,
    VorschlagComponent,
    VorZeigenComponent,
    PacklistenComponent,
    PacklisteComponent,
    PalgewichtComponent,
    FirmaComponent,
    WausgangComponent,
    ShowKommComponent,
    LkwPaletenComponent,
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
    MatDatepickerModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatSortModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
    }),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LaderInterceptorInterceptor,
      multi: true,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
