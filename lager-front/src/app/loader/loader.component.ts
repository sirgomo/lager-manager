import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  loading!: boolean;

  constructor(private loaderServ: LoaderService ) {
    this.loaderServ.isLoading.subscribe( v=> {
      this.loading = v;
    })
   }

  ngOnInit(): void {

  }

}
