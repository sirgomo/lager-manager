import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RegisterUsersDto, ROLE } from 'src/app/dto/regUsers.dto';
import GlobalValidators from 'src/app/globalValidators';
import { AdminService } from '../../admin.service';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  userForm: FormGroup;
  user: RegisterUsersDto = new RegisterUsersDto();
  userRole = Object.values(ROLE).map(item => String(item));

  constructor(private dialRef : MatDialogRef<CreateUserComponent>, private formBuil: FormBuilder,
    private admSer : AdminService,
    private toastr: ToastrService){
    this.userForm = this.formBuil.group({
      username: ['',[Validators.required, Validators.pattern(GlobalValidators.nameReg)]],
      password: ['', [Validators.required, Validators.pattern(GlobalValidators.passReq)]],
      vorname: ['',[Validators.required, Validators.pattern(GlobalValidators.nameReg)]],
      nachname: ['',[Validators.required, Validators.pattern(GlobalValidators.nameReg)]],
      role: ROLE
    });

  }
  createUser(){
    this.user = this.userForm.value;
    console.log(this.user);
    this.admSer.createUser(this.user).subscribe(data=>{
      if(data.nachname === this.user.nachname){
        this.dialRef.close();
        this.toastr.success('Benutzer wurde hinzugefugt', 'Neue Benutzer', {timeOut : 800} );
      }
    })

  }
}
