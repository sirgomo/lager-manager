import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder,  FormGroup,  Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegisterUsersDto, ROLE } from 'src/app/dto/regUsers.dto';
import GlobalValidators from 'src/app/globalValidators';
import { AdminService } from '../../admin.service';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit{
  userForm: FormGroup;
  user: RegisterUsersDto = new RegisterUsersDto();
  userRole = Object.values(ROLE).map(item => String(item));
  edit:number = 0;

  constructor(private dialRef : MatDialogRef<CreateUserComponent>, private formBuil: FormBuilder,
    private admSer : AdminService,
    @Optional() @Inject(MAT_DIALOG_DATA) private  userData: RegisterUsersDto){
    this.userForm = this.formBuil.group({
      id:[''],
      username: ['',[Validators.required, Validators.pattern(GlobalValidators.nameReg)]],
      userpassword: ['', [Validators.required, Validators.pattern(GlobalValidators.passReq)]],
      vorname: ['',[Validators.required, Validators.pattern(GlobalValidators.nameReg)]],
      nachname: ['',[Validators.required, Validators.pattern(GlobalValidators.nameReg)]],
      role: ROLE
    });

  }
  ngOnInit(): void {
    if(this.userData !== undefined && this.userData !== null){
     this.userForm.patchValue(this.userData);
     this.edit = 1;
    }else{
      this.userForm.get('role')?.setValue(ROLE.KOMMISIONIER);
      this.edit = 0;
    }

  }
  async createUser(){

    this.user = this.userForm.value;
    if(this.edit === 0){
      this.user.id = -1;
    }
  await  this.admSer.createUser(this.user).subscribe(data=>{

      if(data.nachname !== undefined && data.nachname !== null && data.nachname !== ''){
        this.dialRef.close(data);
      }


    });

  }
 // username(){ return this.userForm.get('username');}
  //password() { return this.userForm.get('password');}
}
