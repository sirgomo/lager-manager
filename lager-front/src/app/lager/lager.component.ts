import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArtikelMengeDto } from '../dto/artikelMenge.dto';
import { LagerPlatztDto, PALETTENTYP } from '../dto/lagerPlatz.dto';
import { HelperService } from '../helper.service';
import { LagerService } from './lager.service';

@Component({
  selector: 'app-lager',
  templateUrl: './lager.component.html',
  styleUrls: ['./lager.component.scss']
})
export class LagerComponent implements OnInit {
  show: number = 1;
  lagerPlatze: LagerPlatztDto[]  =  new Array();;
  pltzGrosse : string = '';
  searchModel: string = '';
  public readonly palettenTyp : typeof PALETTENTYP = PALETTENTYP;


  lagerPlatztForm: FormGroup;
  constructor(private lagerServ : LagerService, private fb : FormBuilder, private helper: HelperService) {
    this.lagerPlatztForm = this.fb.group({
      id: Number,
      lagerplatz: [''],
      artId: Number,
      artName: [''],
      artikelMenge: Number,
      einheit: Number,
      palettenTyp: PALETTENTYP,
      mhd: Date,
      lagerPlatzVolumen:Number,
      static: Boolean
    });

   }

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
  artikelTrackBy(index:number, lager: LagerPlatztDto)
  {
    try{
      return lager.artId;
    }catch(err){
      return err;
    }
  }
  getPlatz(){
    let artMen : ArtikelMengeDto = new ArtikelMengeDto();
    artMen.artikelId = 21;
    artMen.menge = 887;
    return this.lagerServ.getPlatztFurArtikel(artMen).subscribe(data=>{
      console.log(data);
    })
  }
  createUpdateLagerPlatz(index : number){
    if(index === -1) this.lagerPlatztForm.reset();
    this.show = 2;
  }
  savePlatz(platz: LagerPlatztDto){
    let großearra = new Array();
    let rawVal :string =  this.lagerPlatztForm.get('lagerPlatzVolumen')?.getRawValue();
    if(rawVal.length > 3){
      großearra = rawVal.split('x');
    }
    platz.lagerPlatzVolumen = Number(großearra[0]) * Number(großearra[1]) * Number(großearra[2]);
    console.log(platz.palettenTyp)
  return this.lagerServ.createPlatz(platz).subscribe(data =>{
    if(data){
      this.showFront();
    }else{
      console.log(data);
    }
  });

  }
  showFront(){
    this.lagerPlatztForm.reset();
    this.show = 1;
  }
  onSearch(was: string){

      this.lagerPlatze = this.helper.onSearchPlatz(was, this.lagerPlatze);

  }
}
