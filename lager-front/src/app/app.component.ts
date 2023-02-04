import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HelperService } from './helper.service';
import { ApiService } from './services/api.service';
import { VorschlagComponent } from './vorschlag/vorschlag.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLogged = false;
  title = 'Lager';
  toolbarInfo = 'Lager Manger';
  kommissionier = false;
  palNr = '';
  constructor(private api: ApiService, private helper: HelperService, private dialog: MatDialog) {}
  ngOnInit(): void {
    this.api.getJwtUserToken().subscribe((token: string) => {
      if (token) {
        this.isLogged = true;
      }
    });
    this.kommissionier = false;
    this.helper.toolbarInfo.subscribe((d) => {
      if (d.length < 1) return;
      this.toolbarInfo = d[0];
      this.palNr = d[1];
      this.kommissionier = true;
    });
  }
  toggle() {
    this.helper.toggleSideNav();
  }
  logout() {
    this.isLogged = false;
    this.kommissionier = false;
    this.toolbarInfo = 'Lager Manger';
    this.api.logut();
  }
  gibVorschlag() {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.height = '60vh';
    conf.width = '60vw';

    this.dialog.open(VorschlagComponent, conf);
  }
}
