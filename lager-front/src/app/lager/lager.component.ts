import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ArtikelMengeDto } from '../dto/artikelMenge.dto';
import { LagerPlatztDto, PALETTENTYP } from '../dto/lagerPlatz.dto';
import { HelperService } from '../helper.service';
import { LagerService } from './lager.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lager',
  templateUrl: './lager.component.html',
  styleUrls: ['./lager.component.scss'],
  providers: [DatePipe]

})
export class LagerComponent implements OnInit {
  show: number = 1;
  lagerPlatze: LagerPlatztDto[]  =  new Array();;
  pltzGrosse : string = '';
  searchModel: string = '';
  index :number = -1;
  downloadKomplet : boolean = false;
  public readonly palettenTyp : typeof PALETTENTYP = PALETTENTYP;


  lagerPlatztForm: FormGroup;
  constructor(private lagerServ : LagerService, private fb : FormBuilder, private helper: HelperService, private toastr : ToastrService, private datePipe :DatePipe) {
    this.lagerPlatztForm = this.fb.group({
      id: Number,
      lagerplatz: [''],
      artId: Number,
      name: [''],
      artikelMenge: Number,
      einheit: Number,
      palettenTyp: PALETTENTYP,
      mhd: Date,
      lagerPlatzVolumen:Number,
      static: Boolean,
      liferant:Number
    });

   }

  ngOnInit(): void {
    this.getStellpletze();
  }
  async getStellpletze(){
    let LagerPlatztDto: LagerPlatztDto[] = new Array();
    this.downloadKomplet = false;
    this.lagerPlatze.splice(0, this.lagerPlatze.length);
    await this.lagerServ.getAllStellpletze().subscribe(data=>{
      for(let i = 0; i !== data.length; i++){
        this.lagerPlatze.push(data[i]);
      }
      this.show = 1;
      this.downloadKomplet = true;
    });


  }
  artikelTrackBy(index:number, lager: LagerPlatztDto)
  {
    try{
      return this.lagerPlatze[index];
    }catch(err){
      return err;
    }
  }

  createUpdateLagerPlatz(index : number){
    if(index === -1) this.lagerPlatztForm.reset();
    if(index !== -1){
      this.lagerPlatztForm.setValue(this.lagerPlatze[index]);

      //this.lagerPlatztForm.get('mhd')?.setValue(this.lagerPlatze[index].mhd.toISOString().split('T')[0]);
    // this.lagerPlatztForm.get('mhd')?.setValue(formatDate(this.lagerPlatze[index].mhd, 'dd-MM-yyyy', 'en'));
    this.lagerPlatztForm.get('mhd')?.setValue(new Date(this.lagerPlatze[index].mhd).toISOString().split('T')[0]);

    //  console.log(this.lagerPlatztForm.get('mhd')?.getRawValue());
    }

    this.show = 2;
    this.index = index;
  }
  savePlatz(platz: LagerPlatztDto){
    if(platz.id === undefined || platz.id === null){
      let großearra = new Array();
      let rawVal :string =  this.lagerPlatztForm.get('lagerPlatzVolumen')?.getRawValue();
      if(rawVal.length > 3){
        großearra = rawVal.split('x');
      }
      platz.lagerPlatzVolumen = Number(großearra[0]) * Number(großearra[1]) * Number(großearra[2]);
      console.log(platz.palettenTyp)
    }

  return this.lagerServ.createPlatz(platz).subscribe(data =>{
    if(data){
      this.lagerPlatze[this.index] = data;
      this.showFront();
    }else{
      console.log(data);
    }
  });

  }
  showFront(){
    this.lagerPlatztForm.reset();
    this.show = 1;
    this.index = -1;
  }
  async onSearch(was: string){
  if(this.downloadKomplet){
    this.lagerPlatze = await this.helper.onSearchPlatz(was, this.lagerPlatze);
  }

  }
  deletePlatz(platz : LagerPlatztDto){
    if(this.lagerPlatze[this.index].artId !== null){
      this.toastr.error('Der Platz kann nicht entfernt werden denn er nicht lehr ist', 'Error');
      return;
    }
    this.lagerServ.deletePlatz(platz.id).subscribe(data=>{
      if(data){
        this.lagerPlatze.splice(this.index, 1);
        this.showFront();
      }
    });
  }
}
