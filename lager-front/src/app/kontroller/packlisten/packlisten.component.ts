import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { PaleteForControlleDto } from 'src/app/dto/paleteForControlle.dto';
import { KontrollerService } from '../kontroller.service'

@Component({
  selector: 'app-packlisten',
  templateUrl: './packlisten.component.html',
  styleUrls: ['./packlisten.component.scss']
})
export class PacklistenComponent implements OnInit{
  @Input() kommNr: number | undefined;
  palData: MatTableDataSource<PaleteForControlleDto> = new MatTableDataSource();
  columnDef : string[] = ['id', 'palettenTyp', 'kontrolliert', 'lkwNummer', 'print'];
  constructor(private service: KontrollerService, private toaster: ToastrService) {}
  ngOnInit(): void {
   this.getPaleten();
  }
  async getPaleten() {
    if (this.kommNr === undefined) {
      this.toaster.error('Etwas ist schiefgegangen, ich Kommiessionierung number');
      return;
     }
   await this.service.getPalattenByKommId(this.kommNr).subscribe((res) => {
    if(res === null) {
      this.toaster.error('ich konnte keine Paletten finden');
    }
    this.palData = new MatTableDataSource(res);
   });
  }
  async getPaletteToDruck(palid: number) {
  await this.service.getPalForControleByNr(palid).subscribe((res) => {
    if(res === null) {
      this.toaster.error('ich konnte keine Palette finden');
    }
  });
  }

}
