
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RegisterUsersDto } from 'src/app/dto/regUsers.dto';
import { AdminService } from '../admin.service';
import { CreateUserComponent } from './create-user/create-user.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnChanges{
@Output() show = new EventEmitter<number>();
@Input() userss: RegisterUsersDto[] = [];
  constructor(private dialog: MatDialog, private toastr: ToastrService, private adminServ : AdminService){

  }

ngOnChanges(changes: SimpleChanges): void {
  console.log(changes['userss']);
}
exit(){
  this.userss.splice(0,this.userss.length);
 this.show.emit(1);
}
createUser(){
  let dialConfig:MatDialogConfig = new MatDialogConfig();
  dialConfig.closeOnNavigation = true;
  dialConfig.width= '70%';
  this.dialog.open(CreateUserComponent, dialConfig).afterClosed().subscribe(data=>{
    if(data.id !== undefined && data.id !== null){
      this.toastr.success('Benutzer hizugefugt', 'Benutzer Hinzufugen', {'timeOut': 700});
      this.userss.push(data);
    }else{
      this.toastr.error('Es wurde abgebrochen ', 'Benutzer Hinzufugen', {'timeOut': 700})
    }
  });
}
editUser(index:number){
  let dialConfig:MatDialogConfig = new MatDialogConfig();
  dialConfig.data = this.userss[index];
  this.dialog.open(CreateUserComponent, dialConfig).afterClosed().subscribe(
    data=>{
      if(data.nachname !== undefined && data.nachname !== null && data.nachname !== ''){
     this.userss[index] = data;
      }else{
        this.toastr.error('Es wurde abgebrochen ', 'Benutzer Hinzufugen', {'timeOut': 700})
      }
    }
  )

}
delete(index:number){
  this.adminServ.deleteUser(this.userss[index].id).subscribe(data=>{
    if(data === 1){
      this.userss.splice(index,1);
      this.toastr.success('Benutzer gelöscht', 'Users', {'timeOut': 700});
    }
  })
}

}
