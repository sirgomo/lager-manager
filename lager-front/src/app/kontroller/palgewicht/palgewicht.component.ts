import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-palgewicht',
  templateUrl: './palgewicht.component.html',
  styleUrls: ['./palgewicht.component.scss']
})
export class PalgewichtComponent implements OnInit{
  gewicht: number = 0;
  //data  = array [menge, 'header']
  constructor(@Inject(MAT_DIALOG_DATA) public data: Array<any>, private dialogRef: MatDialogRef<PalgewichtComponent>) {}
  ngOnInit(): void {
    if(this.data[0] !== undefined)
   this.gewicht = this.data[0];
  }
  neueGewicht() {
    this.dialogRef.close(this.gewicht);
  }
}
