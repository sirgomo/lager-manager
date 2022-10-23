import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtikelComponent } from './artikel/artikel.component';
import { HomeComponent } from './home/home.component';
import { KommisionierComponent } from './kommisionier/kommisionier.component';
import { LagerComponent } from './lager/lager.component';
import { KontrollerComponent } from './kontroller/kontroller.component';
import { VerkaufComponent } from './verkauf/verkauf.component';
import { WarenebuchungComponent } from './warenebuchung/warenebuchung.component';
import { WareneingangComponent } from './wareneingang/wareneingang.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    component: HomeComponent
  },
  {
    path: 'kontroller',
    component: KontrollerComponent

  },
  {
    path: 'artikel',
    component: ArtikelComponent
  },
  {
    path: 'kommisionier',
    component: KommisionierComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lager',
    component: LagerComponent
  },
  {
    path: 'verkauf',
    component: VerkaufComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'warenbuch',
    component: WarenebuchungComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'warenein',
    component: WareneingangComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
