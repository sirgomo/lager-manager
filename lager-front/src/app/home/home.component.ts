import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  formLogin: FormGroup;

  constructor(private fb: FormBuilder, private api : ApiService, private router: Router) {
    this.formLogin = this.fb.group({
      username: [''],
      password: ['']
    });
   }

  ngOnInit(): void {
  }
  loginUser(){
    this.api.login(this.formLogin.value);
  }

}
