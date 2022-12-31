import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PalettenMengeVorausToDruckDto } from '../dto/paletenMengeVorausKom.dto';
import jsPDF from 'jspdf';
//import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas';
import { DataDilerService } from '../data-diler.service';
import { SpeditionDto } from '../dto/spedition.dto';
@Component({
  selector: 'app-pdfkommiss',
  templateUrl: './pdfkommiss.component.html',
  styleUrls: ['./pdfkommiss.component.scss'],
})
export class PdfkommissComponent implements OnInit {
  @Input() kommToDruck: PalettenMengeVorausToDruckDto[] = [];

  @ViewChild('htmlData') htmlData!: ElementRef;
  math: Math;
  displayedColumns: string[];
  speditions: SpeditionDto[] = [];
  constructor(private dataDiel: DataDilerService) {
    this.math = Math;
    this.displayedColumns = [
      'Stellplatz',
      'Menge',
      'Artikel Nr',
      'Aname',
      'Kartons',
    ];
  }

  ngOnInit(): void {
    this.getSpedytions();
  }
  async getSpedytions() {
    this.speditions = await this.dataDiel.getSpeditors();
  }
  genpdf2() {
    const input = document.getElementById('htmlData');
    if (input === null) return;
    html2canvas(input, {
      useCORS: true,
      allowTaint: true,
      scrollY: 0,
      scale: 2,
    }).then((canvas) => {
      const image = { type: 'jpg', quality: 0.95 };
      const margin = [20, 20];
      const filename = 'myfile.pdf';

      const imgWidth = 297;
      let pageHeight = 210;

      const innerPageWidth = imgWidth - margin[0] * 2;
      const innerPageHeight = pageHeight - margin[1] * 2;

      // Calculate the number of pages.
      const pxFullHeight = canvas.height;

      const pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));

      const nPages = Math.ceil(pxFullHeight / pxPageHeight);

      //console.log('pxfullheig '+ pxFullHeight + ' px page hi ' + pxPageHeight);
      // Define pageHeight separately so it can be trimmed on the final page.
      pageHeight = innerPageHeight;

      // Create a one-page canvas to split up the full image.
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;

      // Initialize the PDF.
      const pdf = new jsPDF('l', 'mm', 'a4');

      for (let page = 0; page < nPages; page++) {
        // Trim the final page to reduce file size.
        if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
          pageCanvas.height = pxFullHeight % pxPageHeight;
          pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
        }

        // Display the page.
        const w = pageCanvas.width;
        const h = pageCanvas.height;
        if (pageCtx !== null) {
          pageCtx.fillStyle = 'white';
          pageCtx.fillRect(0, 0, w, h);
          pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);
        }

        // Add the page to the PDF.
        if (page > 0) pdf.addPage();
        // debugger;
        const imgData = pageCanvas.toDataURL(
          'image/' + image.type,
          image.quality,
        );
        pdf.addImage(
          imgData,
          image.type,
          margin[1],
          margin[0],
          innerPageWidth,
          pageHeight,
        );
        pdf.setFontSize(9);
        pdf.text(
          'Verkaufer id:  ' + this.dataDiel.getKomm().verkauferId,
          150 - margin[0],
          34 - margin[1],
        );
        pdf.text(
          'Kommid:  ' + this.dataDiel.getKomm().id,
          50 - margin[0],
          34 - margin[1],
        );
        pdf.text(
          'Versorgung id:  ' + this.dataDiel.getKomm().versorungId,
          240 - margin[0],
          30 - margin[1],
        );
        pdf.text(
          'Liefer Datum: ' + this.dataDiel.getKomm().gewunschtesLieferDatum,
          50 - margin[0],
          30 - margin[1],
        );
        for (let sp = 0; sp < this.speditions.length; sp++) {
          if (
            this.speditions[sp] !== undefined &&
            this.speditions[sp].id === this.dataDiel.getKomm().spedition
          )
            pdf.text(
              'Spedition:  ' + this.speditions[sp]?.name,
              150 - margin[0],
              30 - margin[1],
            );
        }

        pdf.text(
          'Versorgung id:  ' + this.dataDiel.getKomm().versorungId,
          240 - margin[0],
          30 - margin[1],
        );
        pdf.text(
          'Page:  ' + Number(page + 1) + ' of ' + Number(nPages),
          290 - margin[0],
          220 - margin[1],
        );
      }

      pdf.save(filename);
    });
  }
  public getCartonMenge(itemMenge: number, itemMinLoseMenge: number): string {
    const karton: number = Math.floor(itemMenge / itemMinLoseMenge);
    const rest: number = itemMenge % itemMinLoseMenge;
    if (rest !== 0) {
      return 'Kartons: ' + karton + ' Fl.(' + rest + ')';
    }
    return 'Kartons: ' + karton;
  }
}
