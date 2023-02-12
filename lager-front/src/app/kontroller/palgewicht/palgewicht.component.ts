import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-palgewicht',
  templateUrl: './palgewicht.component.html',
  styleUrls: ['./palgewicht.component.scss']
})
export class PalgewichtComponent implements OnInit{
  gewicht: number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) private data: number, private dialogRef: MatDialogRef<PalgewichtComponent>) {}
  ngOnInit(): void {
   this.gewicht = this.data;
  }
  neueGewicht() {
    this.dialogRef.close(this.gewicht);
  }
}
