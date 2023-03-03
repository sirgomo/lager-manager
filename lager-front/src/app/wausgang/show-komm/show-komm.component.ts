import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ArtikelKommissDto } from 'src/app/dto/artikelKommiss.dto';
import { KomAusgangDto } from 'src/app/dto/komAusgang.dto';
import { KomissDTO, KOMMISIONSTATUS } from 'src/app/dto/komiss.dto';
import { PALETTENTYP } from 'src/app/dto/lagerPlatz.dto';
import { WausgangService } from '../wausgang.service';

@Component({
  selector: 'app-show-komm',
  templateUrl: './show-komm.component.html',
  styleUrls: ['./show-komm.component.scss']
})
export class ShowKommComponent implements OnInit{
  @Input('id') public id: number = 0;
  komPosition: KomAusgangDto[] =[];
  kommStatus: KOMMISIONSTATUS[] = Object.values(KOMMISIONSTATUS);
  totalPaleten : string[][] = [];
  totalBruttoGewicht: number = 0;
  totalNettoGewicht: number = 0;
  lkwPaleten: KomAusgangDto[][] = [];
    constructor(private ausgangService: WausgangService, private toaster: ToastrService) {}
  ngOnInit(): void {
  this.getKommissionierung();
    Object.values(PALETTENTYP).forEach((typ) => {
      if(typ !== PALETTENTYP.KEINPALETTE)
      this.totalPaleten.push( [typ.toString(), '0']);
    });
  }
  async getKommissionierung() {
    const komm: Subscription = await this.ausgangService.getKommissionierungMitNr(this.id).subscribe((res) => {
     if(res === undefined || res === null || res.kommDetails.length < 1) {
        this.toaster.error('Etwas ist schiefgelaufen, keine daten', '', {timeOut: 800, positionClass: 'toast-top-center'});
        komm.unsubscribe();
        return;
     }
    console.log(res);
     this.komPosition[0] = res;
     komm.unsubscribe();
 
          for (let i = 0; i < this.komPosition[0].kommDetails.length; i++) {
              for (let y = 0; y < this.totalPaleten.length; y ++) {
                  if(this.totalPaleten[y][0] === this.komPosition[0].kommDetails[i].palettenTyp && this.komPosition[0].kommDetails[i].paletteRealGewicht !== 0 && 
                    this.totalPaleten[y][0] !== PALETTENTYP.KEINPALETTE) {
                      console.log(this.komPosition[0].kommDetails[i]);
                    this.totalPaleten[y][1] = (Number(this.totalPaleten[y][1])+1).toString();
                  }
              }
             
          }
        // console.log(this.lkwPaleten);
    });
  }
} 
