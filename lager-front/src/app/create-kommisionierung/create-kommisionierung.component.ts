import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataDilerService } from '../data-diler.service';
import { DatenpflegeService } from '../datenpflege/datenpflege.service';
import { ArtikelKommissDto } from '../dto/artikelKommiss.dto';
import { DispositorDTO } from '../dto/dispositor.dto';
import { KomissDTO, KOMMISIONSTATUS } from '../dto/komiss.dto';
import { KommissDetailsDto } from '../dto/kommissDetails.dto';
import { SpeditionDTO } from '../dto/spedition.dto';
import { HelperService } from '../helper.service';
import { VerkaufService } from '../verkauf/verkauf.service';

@Component({
  selector: 'app-create-kommisionierung',
  templateUrl: './create-kommisionierung.component.html',
  styleUrls: ['./create-kommisionierung.component.scss']
})
export class CreateKommisionierungComponent implements OnInit {
  kommissForm: FormGroup;
  verkaufer: number = Number(localStorage.getItem('myId'));
  readonly kommStatus : typeof KOMMISIONSTATUS = KOMMISIONSTATUS ;
  dispo: DispositorDTO[] = new Array();
  spedi: SpeditionDTO[] = new Array();
  spediSelected: number = -1;
  searchModel: string = '';
  artikels : ArtikelKommissDto[] = new Array();
  artikelMenge: number = 0;

  constructor(private kommServ: VerkaufService, private fb : FormBuilder, private datenServ: DatenpflegeService
    ,private helper: HelperService, private dataDiel : DataDilerService) {
    this.kommissForm = this.fb.group({
      id: Number,
      verkauferId: Number,
      maxPalettenHoher: Number,
      gewunschtesLieferDatum: Date,
      dispositorId: Number,
      kommissStatus: KOMMISIONSTATUS,
      spedition: Number,
      versorungId: [''],
      kommDetails: KommissDetailsDto
    });
    this.kommStatus = KOMMISIONSTATUS;
   }

  ngOnInit(): void {

    this.getSpedi();
    this.getDispo();
    this.getArtikle();
    this.getKommFromKommponent();
  }
  async getSpedi(){
     await this.datenServ.getAllSpeditions().subscribe(data=>{
     for(let i = 0; i !== data.length; i++){
      this.spedi.push(data[i]);
     }
    });
  }
  async getDispo(){
     await this.datenServ.getAllDispositors().subscribe(data=>{
      for(let i = 0; i !== data.length; i++){
        this.dispo.push(data[i]);
      }
    });
  }
  async getArtikle(){
    //how many artikels are aviable ?
    // total menge on lager - menge in reservation entity - das was fehlt
    this.artikels.splice(0, this.artikels.length);
    await this.kommServ.getArtikles().subscribe(data=>{
      for(let i = 0; i !== data.length; i++){
        if(data[i].resMenge !== null){
          data[i].total -= data[i].resMenge;
        }
        if(data[i].fehlArtikelMenge !== null){
          data[i].total -= data[i].fehlArtikelMenge;
        }
        this.artikels.push(data[i]);
      }
    });
  }
  onSearch(text:string){
    this.helper.onSearchK(text, this.artikels);
  }
  artikelTrackBy(index:number){
    if(this.artikels !== undefined && this.artikels.length > 0){
      return this.artikels[index].artId;
    }
    return;
  }
  async checkVerfurbarkeit(index:number){
    console.log('kilked ' + index + 'artikel menge '+ this.artikelMenge);
    this.artikelMenge = 0;
   await this.kommServ.getCurrentVerfugbareMenge(this.artikels[index].artId).subscribe(
    data =>{
     let tmp : ArtikelKommissDto = new ArtikelKommissDto();
     Object.assign(tmp, data);

      if(tmp.resMenge !== null){
        tmp.total -= data.resMenge;
      }
      if(data.fehlArtikelMenge !== null){
        tmp.total -= data.fehlArtikelMenge;
      }
      this.artikels[index].total  = tmp.total;
    });

  }
  async saveKommissionierung(komm : KomissDTO){
   return this.kommServ.createKommissionierung(komm).subscribe(data=>{
      this.kommissForm.setValue(data);
    });
  }
  getKommFromKommponent(){
    let tmpKomm : KomissDTO = new KomissDTO();
    tmpKomm = this.dataDiel.getKomm();
    if(tmpKomm.id !== undefined && tmpKomm.id !== 0){
      this.kommissForm.setValue(tmpKomm);
      this.kommissForm.get('gewunschtesLieferDatum')?.setValue(new Date(tmpKomm.gewunschtesLieferDatum).toISOString().split('T')[0]);

    }else{
      this.kommissForm.reset();
      this.kommissForm.get('verkauferId')?.setValue(this.verkaufer);
      this.kommissForm.get('kommissStatus')?.setValue(KOMMISIONSTATUS.INBEARBEITUNG);
      this.kommissForm.get('spedition')?.valueChanges.subscribe(data=>{ this.spediSelected = data});
    }
  }
  newKomm(){
    this.kommissForm.reset();
      this.kommissForm.get('verkauferId')?.setValue(this.verkaufer);
      this.kommissForm.get('kommissStatus')?.setValue(KOMMISIONSTATUS.INBEARBEITUNG);
      this.kommissForm.get('spedition')?.valueChanges.subscribe(data=>{ this.spediSelected = data});
  }

}
