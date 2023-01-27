import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { LagerService } from '../lager.service';

@Component({
  selector: 'app-stellplazte',
  templateUrl: './stellplazte.component.html',
  styleUrls: ['./stellplazte.component.scss'],
})
export class StellplazteComponent implements OnInit {
  @Input() artIdandLifId: number[] = [];
  columnDef: string[] = ['lpl', 'name', 'men', 'mhd', 'paltyp'];
  tabData: MatTableDataSource<any> = new MatTableDataSource();
  constructor(private lagerService: LagerService, private snack: MatSnackBar) {}
  ngOnInit(): void {
    this.getPlattze();
  }
  async getPlattze() {
    if (this.artIdandLifId[0] === null || this.artIdandLifId[0] === undefined)
      return;
    await this.lagerService
      .getStellplaztenWithArt(this.artIdandLifId[0], this.artIdandLifId[1])
      .subscribe((data) => {
        if (data === undefined || data === null || data.length < 1) {
          this.snack.open(
            'Leider es wurden keine Plattze mit disem Artikel gefuden!',
            '',
            { duration: 800 },
          );
        }
        this.tabData = new MatTableDataSource(data);
      });
  }
}
