import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { VorschlagComponent } from '../vorschlag.component';
import { VorschlagService } from '../vorschlag.service';

@Component({
  selector: 'app-vor-zeigen',
  templateUrl: './vor-zeigen.component.html',
  styleUrls: ['./vor-zeigen.component.scss']
})
export class VorZeigenComponent implements OnInit{
    tabData: MatTableDataSource<any> = new MatTableDataSource();
    columnDef: string[] = ['id', 'name', 'erleidigt'];
    constructor(private service: VorschlagService, private toaster: ToastrService, private dialog: MatDialog) {}
      ngOnInit(): void {
        this.getVorschlags();
      }
      async getVorschlags() {
        await this.service.getAllVorslags().subscribe((res) => { 
          if(res === null) {
            this.toaster.error('Es gibt keine Vorschlage oder etwas ist schiefgegangen');
            return;
          }
          this.tabData = new MatTableDataSource(res);
        })
      }
      async deleteVorschlag(index: number) {
        await this.service.deleteVorschlag(this.tabData.filteredData[index].id).subscribe((res) => {
          if(res !== 1) {
            this.toaster.error('Etwas ist schiefgegangen, ich konnte den Vorschlag nicht löschen');
            return;
          }
          this.tabData.filteredData.splice(index,1);
          this.tabData = new MatTableDataSource(this.tabData.filteredData);
          this.toaster.success('Vorschlag wurde gelöscht!');
        })
      }
      async getVorschlagById(index: number) {
        await this.service.getVorschlagById(this.tabData.filteredData[index].id).subscribe((res) => {
          if(Object(res).id === null) {
            const err = new Error();
            Object.assign(err, res);

            this.toaster.error(err.message);
          }
          const conf: MatDialogConfig = new MatDialogConfig();
          conf.height = '60vh';
          conf.width = '60vw';
          conf.data = res;
          this.dialog.open(VorschlagComponent, conf);
        });
      }
}
