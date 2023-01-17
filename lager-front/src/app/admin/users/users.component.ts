import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { RegisterUsersDto } from 'src/app/dto/regUsers.dto';
import { AdminService } from '../admin.service';
import { CreateUserComponent } from './create-user/create-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnChanges {
  @Output() show = new EventEmitter<number>();
  @Input() userss: RegisterUsersDto[] = [];
  tabDataSource: MatTableDataSource<RegisterUsersDto> =
    new MatTableDataSource();
  columnDef: string[] = ['uname', 'name', 'vorname', 'role', 'del'];
  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private adminServ: AdminService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.tabDataSource = new MatTableDataSource(this.userss);
  }
  exit() {
    this.userss.splice(0, this.userss.length);
    this.show.emit(0);
  }
  createUser() {
    const dialConfig: MatDialogConfig = new MatDialogConfig();
    dialConfig.closeOnNavigation = true;
    dialConfig.width = '70%';
    this.dialog
      .open(CreateUserComponent, dialConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data !== undefined && data !== null) {
          this.toastr.success('Benutzer hizugefugt', 'Benutzer Hinzufugen', {
            timeOut: 700,
          });
          this.userss.push(data);
          this.tabDataSource = new MatTableDataSource(this.userss);
        } else {
          this.toastr.error('Es wurde abgebrochen ', 'Benutzer Hinzufugen', {
            timeOut: 700,
          });
        }
      });
  }
  editUser(index: number) {
    const dialConfig: MatDialogConfig = new MatDialogConfig();
    dialConfig.data = this.userss[index];
    this.dialog
      .open(CreateUserComponent, dialConfig)
      .afterClosed()
      .subscribe((data) => {
        if (data !== undefined && data !== null && data.nachname !== '') {
          this.userss[index] = data;
          this.tabDataSource = new MatTableDataSource(this.userss);
        } else {
          this.toastr.error('Es wurde abgebrochen ', 'Benutzer Hinzufugen', {
            timeOut: 700,
          });
        }
      });
  }
  delete(index: number) {
    this.adminServ.deleteUser(this.userss[index].id).subscribe((data) => {
      if (data === 1) {
        this.userss.splice(index, 1);
        this.toastr.success('Benutzer gelöscht', 'Users', { timeOut: 700 });
        this.tabDataSource = new MatTableDataSource(this.userss);
      }
    });
  }
}
