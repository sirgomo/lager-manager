import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DatenpflegeService } from '../datenpflege/datenpflege.service';
import { KomissDTO, KOMMISIONSTATUS } from '../dto/komiss.dto';
import { SpeditionDto } from '../dto/spedition.dto';
import { HelperService } from '../helper.service';
import { WausgangService } from './wausgang.service';

@Component({
  selector: 'app-wausgang',
  templateUrl: './wausgang.component.html',
  styleUrls: ['./wausgang.component.scss']
})
export class WausgangComponent implements OnInit {
  @ViewChild('matSide', {static: true}) public matSide: MatSidenav | undefined;
  constructor( private service: WausgangService, private toaster: ToastrService, private speditorService: DatenpflegeService, private matsiedeService: HelperService) {
  
  }
  tabs = Object.values(KOMMISIONSTATUS);
  dataTab: MatTableDataSource<any> = new MatTableDataSource();
  speditors: SpeditionDto[] = [];
  columnDef: string[] = ['id','raus', 'verkaufid', 'liferdate', 'dispo', 'status', 'spedi', 'versoid'];
  selectedIndex: number = 3;
  show = 1;
  kommid = -1;
  ngOnInit(): void {
    if(this.matSide !== undefined) {
      this.matsiedeService.setSideNav(this.matSide);
    }
  this.getSpeditors();
  }
  async getKommissionierungen(status: string) { 
    const tmpsub: Subscription = this.service.getFertigKommissionierungen(status).subscribe((res) => {
      if(res.length === undefined || res.length < 1 ) {
        const er = new Error();
        Object.assign(er, res);
        this.toaster.error(er.message, 'Error', {timeOut: 1200, positionClass: 'toast-top-center'});
        tmpsub.unsubscribe();
        return;
      }
      for (let i = 0; i < this.speditors.length; i++) {
        for (let y = 0; y < res.length; y++) { 
          if(this.speditors[i].id === res[y].spedition ) {
            res[y].spedition = this.speditors[i].name;
          }
        }
      }
      for(let i = 0; i< res.length; i++) {
        
      }
      this.dataTab = new MatTableDataSource(res);
      tmpsub.unsubscribe();
    });
  }
  async getSpeditors() {
   const tmpSped: Subscription = await this.speditorService.getAllSpeditions().subscribe((res) => {
      if(res === undefined || res === null || res.length < 1) {
        tmpSped.unsubscribe();
        this.toaster.error('Keine Speditors gefunden', 'Speditors', {timeOut: 800, positionClass: 'toast-top-center'});
        return;
      }
      this.speditors = res;
      this.getKommissionierungen(this.tabs[this.selectedIndex]);
      tmpSped.unsubscribe();
     });
  }
  async tabChange(index: number) {
    this.selectedIndex = index;
    this.getKommissionierungen(this.tabs[this.selectedIndex]);
  }
  openKomm(i: number) {
    this.kommid = this.dataTab.filteredData[i].id;
    this.show = 2;
  }
  showFront() {
    this.show = 1;
  }
}
