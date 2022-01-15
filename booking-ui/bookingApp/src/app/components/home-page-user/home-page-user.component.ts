import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-page-user',
  templateUrl: './home-page-user.component.html',
  styleUrls: ['./home-page-user.component.scss']
})
export class HomePageUserComponent implements OnInit {

  constructor(public service:UserService) { }

  ngOnInit(): void {
  }
  logOut():void{
    this.service.logout();
    location.replace("http://localhost:4200/home");
  }
  
}
