import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Destination } from 'src/app/models/Destination';
import { DestinationService } from 'src/app/services/destination.service';
import { UserService } from 'src/app/services/user.service';
import { AddAdminComponent } from '../add-admin/add-admin.component';
import { AddDestinationComponent } from '../add-destination/add-destination.component';
import { AddGuideComponent } from '../add-guide/add-guide.component';

@Component({
  selector: 'app-home-page-admin',
  templateUrl: './home-page-admin.component.html',
  styleUrls: ['./home-page-admin.component.scss']
})
export class HomePageAdminComponent implements OnInit {
  destinations: Array<Destination> = [];
  constructor(public dialog: MatDialog, public service:UserService) { }

  ngOnInit(): void {
     
  }
  openDialogAdmin(): void {
    const dialogRef = this.dialog.open(AddAdminComponent,{
      width: '640px',disableClose: true 
    });
}

openDialogGuide(): void {
  const dialogRef = this.dialog.open(AddGuideComponent,{
    width: '640px',disableClose: true 
  });
}
openDialogDestination(): void {
  const dialogRef = this.dialog.open(AddDestinationComponent,{
    width: '640px',disableClose: true 
  });
}

logOut():void{
  this.service.logout();
  location.replace("http://localhost:4200/home");
}

 
}

