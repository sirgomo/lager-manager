import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, Injectable, InjectionToken, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VorschladDto } from '../dto/vorschlag.dto';
import { VorschlagService } from './vorschlag.service';

@Component({
  selector: 'app-vorschlag',
  templateUrl: './vorschlag.component.html',
  styleUrls: ['./vorschlag.component.scss']
})
export class VorschlagComponent implements OnInit{
    name: string  = '';
    vorschlag: string = '';
    constructor(private service: VorschlagService, private toastr: ToastrService, private dialRef: DialogRef,
      @Optional() @Inject(MAT_DIALOG_DATA) private data: VorschlagComponent) {}
  ngOnInit(): void {
    if(this.data !== undefined && this.data !== null) {
      this.name = this.data.name;
      this.vorschlag = this.data.vorschlag;
    }
  }

   async create() {
      if( this.name.length < 3 || this.vorschlag.length < 10) {
        this.toastr.error('Name oder vorschlag ist zu kurz!')
        return;
      }
      const tmpVors: VorschladDto = new VorschladDto();
      tmpVors.name = this.name;
      tmpVors.vorschlag = this.vorschlag;
     await this.service.createVorschlag(tmpVors).subscribe((res) => {
        if(!isFinite(res)) {
          const err = new Error();
          Object.assign(err, res);
          this.toastr.error(err.message);
          return;
        }
        this.toastr.success('Danke, Vorschlag wurde gespeichert');
        this.dialRef.close();
      });
    }
}
