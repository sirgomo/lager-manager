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

const routes: Routes = [
  {
    path: '',
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
    component: KommisionierComponent
  },
  {
    path: 'lager',
    component: LagerComponent
  },
  {
    path: 'verkauf',
    component: VerkaufComponent
  },
  {
    path: 'warenbuch',
    component: WarenebuchungComponent
  },
  {
    path: 'warenein',
    component: WareneingangComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
