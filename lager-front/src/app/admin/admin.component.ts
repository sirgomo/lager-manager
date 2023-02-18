import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RegisterUsersDto } from '../dto/regUsers.dto';
import { HelperService } from '../helper.service';
import { AdminService } from './admin.service';
import { UsersComponent } from './users/users.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) public sidenav!: MatSidenav;
  @ViewChild('usersos') public usersos!: UsersComponent;
  users: RegisterUsersDto[] = [];
  loaded = false;
  show = 0;

  constructor(private serv: AdminService, private helper: HelperService) {}
  ngOnInit(): void {
    this.show = 0;
    this.helper.setSideNav(this.sidenav);
  }
  async getUsers() {
    return await this.serv.getUsers().subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        this.users.push(data[i]);
      }
      this.show = 1;
    });
  }
  changeShow(emit: number) {
    this.show = emit;
  }
  showVorschlag() {
    this.show = 2;
  }
  showFirm() {
    this.show = 3;
  }
}
