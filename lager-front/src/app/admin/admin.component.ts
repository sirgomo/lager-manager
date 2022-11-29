import { Component, OnInit } from '@angular/core';
import { RegisterUsersDto } from '../dto/regUsers.dto';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  users: RegisterUsersDto[] = new Array();
  loaded :boolean = false;
  show:number = 0;

  constructor(private serv : AdminService){

  }
  ngOnInit(): void {
   this.show = 0;
  }
  async getUsers(){
   return await this.serv.getUsers().subscribe(data=>{
      for (let i = 0; i < data.length; i++){
        this.users.push(data[i]);
      }
      this.show = 1;
    });
  }
}
