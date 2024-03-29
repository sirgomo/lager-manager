import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { tmpdir } from 'os';
import { PaleteForControlleDto } from '../dto/paleteForControlle.dto';
import { PaleteToDruckDto } from '../dto/paleteToDruck.dto';
import { blob } from 'stream/consumers';

@Component({
  selector: 'app-packliste',
  templateUrl: './packliste.component.html',
  styleUrls: ['./packliste.component.scss']
})
export class PacklisteComponent implements OnInit{
  palnr: string[] = [];
  tmpPalets: PaleteToDruckDto[][] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public palets: PaleteToDruckDto[][], private router: Router) {}

  columnDef: string[] = ['artiid', 'name', 'stuck']; 
  dataTab: MatTableDataSource<PaleteToDruckDto>[] = [];
  ngOnInit(): void {
    this.load();
  }
  load() {
  
    let palete: PaleteToDruckDto[] = [];
    for (let i = 0; i < this.palets.length; i++) {
    
      const mengeOnSite = 18;
      const siteMenge = Math.ceil(this.palets[i].length / mengeOnSite);
     
       if(siteMenge > 1) {
        palete = [];
        const mnege = this.palets[i].length % mengeOnSite;
        const startMenge = this.palets[i].length;
        let packlistnr  = 0
        for (let y = 0; y < startMenge; y++) {
          if(this.palets[i].length > mnege && this.palets[i].length > 0) {
            palete.push(this.palets[i].splice(this.palets[i].length-1,1)[0]);
            if(palete.length === mengeOnSite) {
              this.tmpPalets.push(palete);
              this.palnr.push('Palete Nr: ' + Number(i + 1) + ' of ' + this.palets.length +  
              ', Packliste: ' + Number(packlistnr + 1) + ' of '+ siteMenge);
              palete = [];
              packlistnr++;
            }
          } else {
           if(this.palets[i].length > 0)
            palete.push(this.palets[i].splice(this.palets[i].length-1,1)[0]);
          }
        }
        if(this.palets[i].length === 0) {
          this.palnr.push('Palete Nr: ' + Number(i + 1) + ' of ' + this.palets.length + 
              ', Packliste: ' + siteMenge + ' of '+ siteMenge);
          this.tmpPalets.push(palete);
        }
       } else {
        this.palnr.push('Palete Nr: ' + Number(i + 1) + ' of ' + this.palets.length);
        this.tmpPalets.push(this.palets[i]);
       }
     
    }
    for (let i = 0; i < this.tmpPalets.length; i++ ) {
    this.dataTab[i] =  new MatTableDataSource(this.tmpPalets[i]);
   
    }
   
   //this.dataTab[0].filteredData[0].gewunschtesLieferDatum
  }
  
  print() {
    const input = document.getElementById('todruck');
   
    if (input === null) return;
    html2canvas(input, {
      useCORS: true,
      allowTaint: true,
      scrollY: 0,
      scale: 2,
    }).then((canvas) => {
     // const image = { type: 'png', quality: 0.3 };
     const image = { type: 'png' };
      const margin = [16, 16];
      const filename = 'myfile.pdf';

      const imgWidth = 210;
      let pageHeight = 297;

      const innerPageWidth = imgWidth - margin[0] * 2;
      const innerPageHeight = pageHeight - margin[1] * 2;

      // Calculate the number of pages.
     
      let pxFullHeight = canvas.height;
     

      //const pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
      const pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
      
      const nPages = Math.ceil(pxFullHeight / pxPageHeight);
     // pxFullHeight += (nPages * 298);
      //console.log('pxfullheig '+ pxFullHeight + ' px page hi ' + pxPageHeight);
      // Define pageHeight separately so it can be trimmed on the final page.
      pageHeight = innerPageHeight;
      
      // Create a one-page canvas to split up the full image.
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;

      // Initialize the PDF.
      //orginal was  const pdf = new jsPDF('p', 'mm', 'a4'); but image was to big
      const pdf = new jsPDF('p', 'mm', 'a4', true);

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
         // pageCtx.fillStyle = 'white';
          pageCtx.fillRect(0, 0, w, h);
          pageCtx.drawImage(canvas, 0, page * pxPageHeight , w, h, 0, 0, w, h);
        }

        // Add the page to the PDF.
        if (page > 0) pdf.addPage();
        // debugger;
        const imgData = pageCanvas.toDataURL(
          'image/' + image.type//,
        //  image.quality,
        );
        pdf.addImage(
          imgData,
          image.type,
          margin[1],
          margin[0],
          innerPageWidth,
          pageHeight,
          '',
          'FAST' //orginal without but this is needed to small images!
        );
       
        }
        pdf.autoPrint();
        window.open(pdf.output('bloburl'), '_blank'); 
    });
  }
}


