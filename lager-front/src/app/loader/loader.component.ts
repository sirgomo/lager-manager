import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  loading!: boolean;

  constructor(
    private loaderServ: LoaderService,
    private cdRef: ChangeDetectorRef,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.loaderServ.isLoading.subscribe((v) => {
      this.loading = v;
      this.cdRef.detectChanges();
    });
  }
}
