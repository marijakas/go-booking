import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Destination } from 'src/app/models/Destination';
import { DestinationService } from 'src/app/services/destination.service';

@Component({
  selector: 'app-edit-destination',
  templateUrl: './edit-destination.component.html',
  styleUrls: ['./edit-destination.component.scss']
})
export class EditDestinationComponent implements OnInit {
  wasFormChanged = false;
  public breakpoint: number; // Breakpoint observer cod
  dest = {
    ID: 0,
    name: '',
    description:'asd',
    country: '',
    average_rate: '',
   
   }
  constructor(private route: ActivatedRoute, private fb: FormBuilder,
    public dialog: MatDialog, public service: DestinationService,   @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.dest= this.data.dataKey;
  }


  openDialog(): void {
    this.dialog.closeAll();
  }

  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  saveChangesEnabled() {
    return this.dest.name.length > 0 &&  this.dest.country.length > 0 &&  this.dest.description.length > 0;
  }
 
  saveChanges(destination:Destination) {
   console.log("TRAVEL ZA CUVANJE", destination)
   this.service.updateDestination(destination);
   this.dialog.closeAll();
  }

  formChanged() {
    this.wasFormChanged = true;
  }


}
