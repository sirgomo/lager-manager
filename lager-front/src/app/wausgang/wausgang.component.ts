import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { KomissDTO } from '../dto/komiss.dto';
import { WausgangService } from './wausgang.service';

@Component({
  selector: 'app-wausgang',
  templateUrl: './wausgang.component.html',
  styleUrls: ['./wausgang.component.scss']
})
export class WausgangComponent implements OnInit {
  constructor( private service: WausgangService, private toaster: ToastrService) {}
  dataTab: MatTableDataSource<any> = new MatTableDataSource();
  columnDef: string[] = ['id', 'verkaufid', 'liferdate', 'dispo', 'status', 'spedi', 'versoid'];
  ngOnInit(): void {
   this.getFertigKommissionierungen();
  }
  async getFertigKommissionierungen() { 
    const tmpsub: Subscription = this.service.getFertigKommissionierungen().subscribe((res) => {
      if(res.length === undefined || res.length < 1 ) {
        const er = new Error();
        Object.assign(er, res);
        this.toaster.error(er.message, 'Error', {timeOut: 1000, positionClass: 'toast-top-center'});
        tmpsub.unsubscribe();
        return;
      }
      this.dataTab = new MatTableDataSource(res);
      console.log(res);
      tmpsub.unsubscribe();
    });
  }

}
