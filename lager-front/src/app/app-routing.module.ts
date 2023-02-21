import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtikelComponent } from './artikel/artikel.component';
import { LoginComponent } from './login/login.component';
import { KommisionierComponent } from './kommisionier/kommisionier.component';
import { LagerComponent } from './lager/lager.component';
import { KontrollerComponent } from './kontroller/kontroller.component';
import { VerkaufComponent } from './verkauf/verkauf.component';
import { WarenebuchungComponent } from './warenebuchung/warenebuchung.component';
import { WareneingangComponent } from './wareneingang/wareneingang.component';
import { AuthGuard } from './guard/auth.guard';
import { CreateKommisionierungComponent } from './create-kommisionierung/create-kommisionierung.component';
import { DatenpflegeComponent } from './datenpflege/datenpflege.component';
import { AdminComponent } from './admin/admin.component';
import { WausgangComponent } from './wausgang/wausgang.component';



const routes: Routes = [
  {
    path: 'kontroller',
    component: KontrollerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'artikel',
    component: ArtikelComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'kommisionier',
    component: KommisionierComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'lager',
    component: LagerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'verkauf',
    component: VerkaufComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'verkauf/new',
    component: CreateKommisionierungComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'warenbuch',
    component: WarenebuchungComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'datenpflege',
    component: DatenpflegeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'warenein',
    component: WareneingangComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: 'wausgang',
    component: WausgangComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
