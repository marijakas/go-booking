import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Travel } from 'src/app/models/Travel';
import { DestinationService } from 'src/app/services/destination.service';

@Component({
  selector: 'app-edit-travel',
  templateUrl: './edit-travel.component.html',
  styleUrls: ['./edit-travel.component.scss']
})
export class EditTravelComponent implements OnInit {
  wasFormChanged = false;
  public breakpoint: number; // Breakpoint observer cod
   trvl = {
    ID: 0,
    name: '',
    description:'asd',
    price: 0,
    date_time: '',
    destination_id:0, 
    free_seats:0
   }
   public addCusForm: FormGroup;
  constructor(private fb: FormBuilder,
    public dialog: MatDialog, public service: DestinationService,   @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.trvl= this.data.dataKey;
    console.log("NAZIV TRAVELA" , this.trvl.name)

  }
  openDialog(): void {
    this.dialog.closeAll();
  }

  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  saveChangesEnabled() {
    //return this.addCusForm.value.name.length > 0 &&  this.addCusForm.value.price.length > 0 &&  this.addCusForm.value.description.length > 0;
  }
 
  saveChanges(travel:Travel) {
console.log("TRAVEL ZA CUVANJE", travel)  }
 
  formChanged() {
    this.wasFormChanged = true;
  }

  
}
