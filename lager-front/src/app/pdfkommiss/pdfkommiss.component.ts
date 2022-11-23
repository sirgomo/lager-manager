import { Component, Input, OnInit } from '@angular/core';
import { PalettenMengeVorausToDruckDto } from '../dto/paletenMengeVorausKom.dto';

@Component({
  selector: 'app-pdfkommiss',
  templateUrl: './pdfkommiss.component.html',
  styleUrls: ['./pdfkommiss.component.scss']
})
export class PdfkommissComponent implements OnInit {
  @Input() kommToDruck: PalettenMengeVorausToDruckDto[] = new Array();
  constructor() { }

  ngOnInit(): void {
  }

}
