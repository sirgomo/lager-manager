import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { PaleteForControlleDto } from 'src/app/dto/paleteForControlle.dto';
import { KontrollerService } from '../kontroller.service';

@Component({
  selector: 'app-paletten',
  templateUrl: './paletten.component.html',
  styleUrls: ['./paletten.component.scss'],
})
export class PalettenComponent implements OnInit {
  @Input() kommNr = 0;
  paletten: PaleteForControlleDto[] = [];
  dataRes: MatTableDataSource<PaleteForControlleDto> = new MatTableDataSource();
  columnDef = ['palid', 'palTyp', 'kontro', 'relGewi'];
  constructor(
    private service: KontrollerService,
    private toaster: ToastrService,
  ) {}

  public ngOnInit(): void {
    this.service.getPalattenByKommId(this.kommNr).subscribe((res) => {
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          this.paletten.push(res[i]);
        }
        this.dataRes = new MatTableDataSource(this.paletten);
        return;
      }
      const err = new Error();
      Object.assign(err, res);
      return this.toaster.error(err.message);
    });
  }
}
