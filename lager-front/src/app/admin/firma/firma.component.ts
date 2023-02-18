import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FirmaSettingsDto } from 'src/app/dto/firma.dto';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.scss']
})
export class FirmaComponent implements OnInit, OnDestroy{
  subs: Subscription[] = [];
  formFirma: FormGroup;
  constructor(private service: AdminService, private fb : FormBuilder, private toaster: ToastrService) {
    this.formFirma =  fb.group({
      id: [Number],
      rfirmname : ['', Validators.required],
      rname: [null],
      rstrasse: ['', Validators.required],
      rhausnr: [Number, Validators.required],
      rstadt: ['', Validators.required],
      rpostleitzahl: [Number, Validators.required],
      lfirmname: [null],
      lname: [null],
      lstrasse: [null],
      lhausnr: [Number],
      lstadt: [null],
      lpostleitzahl: [null],
      steuernummer: [null],
      steuerid: [null],
      ustid: [null]
    });
  }
  ngOnDestroy(): void {
    if(this.subs.length > 0) {
      for(let i = 0; i < this.subs.length; i++) {
        this.subs[i].unsubscribe();
      }
    }
  }
  ngOnInit(): void {
    this.getFirm();
  }
  async getFirm() {
   this.subs.push( await this.service.getFirm().subscribe((data) => { 
     if(data !== undefined && data.rfirmname !== undefined && data.rfirmname.length > 3) {
      this.formFirma.patchValue(data);
      return;
     } 
     this.toaster.error('Kein Data vorhanden', '', {timeOut: 600});
    }));
   
     
  }
  async saveData() {
    const tmpFirma: FirmaSettingsDto = this.formFirma.getRawValue();
    if(tmpFirma.id !== undefined && tmpFirma.id !== null && isFinite(tmpFirma.id)) {
      this.updateFirma();
      return;
    }
    this.subs.push( await this.service.setupFirm(tmpFirma).subscribe((res) => {
      if (!isFinite(res) && res === 1) {
        this.toaster.success('Gespeichert', '', {timeOut: 800});
      }
    }));
  }
  async updateFirma() { 
    const tmpFirma: FirmaSettingsDto = this.formFirma.getRawValue();
    this.subs.push(await this.service.updateFirmData(tmpFirma).subscribe((res) => {
      if(res === 1) {
        this.toaster.success('Gespeichert', '', {timeOut: 800});
        return;
      }
      this.toaster.error('Etwas ist schiefgegangen!, Änderungen wurden nicht gespeichert', '', {timeOut: 800});
    }));
  }
}
