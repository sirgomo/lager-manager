import { Component } from '@angular/core';
import { KontrollerService } from '../kontroller.service';

@Component({
  selector: 'app-paletten',
  templateUrl: './paletten.component.html',
  styleUrls: ['./paletten.component.scss'],
})
export class PalettenComponent {
  constructor(private service: KontrollerService) {}
}
