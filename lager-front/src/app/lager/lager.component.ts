import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ArtikelMengeDto } from '../dto/artikelMenge.dto';
import { LagerPlatztDto } from '../dto/lagerPlatz.dto';
import { LagerService } from './lager.service';

@Component({
  selector: 'app-lager',
  templateUrl: './lager.component.html',
  styleUrls: ['./lager.component.scss']
})
export class LagerComponent implements OnInit {
  show: number = 1;
  lagerPlatze: LagerPlatztDto[] = new Array();
  constructor(private lagerServ : LagerService, private fb : FormBuilder) { }

  ngOnInit(): void {
    this.getStellpletze();
  }
  async getStellpletze(){
    this.lagerPlatze.splice(0, this.lagerPlatze.length);
    await this.lagerServ.getAllStellpletze().subscribe(data=> {
      data.forEach(platz => {
        this.lagerPlatze.push(platz);
      });
      this.show = 1;
    });
  }
  artikelTrackBy()
  {

  }
  getPlatz(){
    let artMen : ArtikelMengeDto = new ArtikelMengeDto();
    artMen.artikelId = 21;
    artMen.menge = 887;
    return this.lagerServ.getPlatztFurArtikel(artMen).subscribe(data=>{
      console.log(data);
    })
  }

}
