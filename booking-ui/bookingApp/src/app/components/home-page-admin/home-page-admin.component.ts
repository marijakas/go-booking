import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAdminComponent } from '../add-admin/add-admin.component';
import { AddGuideComponent } from '../add-guide/add-guide.component';

@Component({
  selector: 'app-home-page-admin',
  templateUrl: './home-page-admin.component.html',
  styleUrls: ['./home-page-admin.component.scss']
})
export class HomePageAdminComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

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
}
