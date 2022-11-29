
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RegisterUsersDto } from 'src/app/dto/regUsers.dto';
import { CreateUserComponent } from './create-user/create-user.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnChanges{

@Input() userss: RegisterUsersDto[] = [];
  constructor(private dialog: MatDialog){

  }

ngOnChanges(changes: SimpleChanges): void {
  console.log(changes['userss']);
}
createUser(){
  let dialConfig:MatDialogConfig = new MatDialogConfig();
  dialConfig.closeOnNavigation = true;
  dialConfig.width= '70%';
  this.dialog.open(CreateUserComponent, dialConfig);
}

}
