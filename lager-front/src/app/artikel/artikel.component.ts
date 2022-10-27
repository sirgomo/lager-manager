import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ArtikelDTO } from '../dto/artikel.dto';
import { UidDTO } from '../dto/artikel.dto';
import { ArtikelService } from './artikel.service';

@Component({
  selector: 'app-artikel',
  templateUrl: './artikel.component.html',
  styleUrls: ['./artikel.component.scss']
})
export class ArtikelComponent implements OnInit {
  artikels: ArtikelDTO[] = new Array();
  uids : UidDTO[] = new Array();


  show : number = 1;
  constructor(private servi : ArtikelService, private fb : FormBuilder) { }

  ngOnInit(): void {
   this.getArtikles();
  }
  getArtikles(){
    return  this.servi.getAllArtikel().subscribe(d => {
   d.map(da =>{
    this.artikels.push(da);
   });
  });
}
}
