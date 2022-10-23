import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isLogged : boolean = false;
  title = 'Lager';
  constructor(private api: ApiService){

  }
  ngOnInit(): void {
      this.api.getJwtUserToken().subscribe((token :string) =>{
        if(token){
         this.isLogged = true;
        }
      });
  }
  logout(){
    this.isLogged = false;
    this.api.logut();
  }
}
