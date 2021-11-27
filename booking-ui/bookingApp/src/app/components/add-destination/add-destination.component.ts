import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Destination } from 'src/app/models/Destination';
import { DestinationService } from 'src/app/services/destination.service';

@Component({
  selector: 'app-add-destination',
  templateUrl: './add-destination.component.html',
  styleUrls: ['./add-destination.component.scss']
})
export class AddDestinationComponent implements OnInit {
  public addCusForm: FormGroup;
  public name: string='';
  public description: string='';
  public country: string='';
  wasFormChanged = false;
  public breakpoint: number; // Breakpoint observer cod

 constructor(private fb: FormBuilder,
   public dialog: MatDialog, public service: DestinationService) { }

  ngOnInit(): void {
    this.addCusForm = this.fb.group({
      
      name: [this.name, [Validators.required]],
      country: [this.country, [Validators.required]],
      description: [this.description, [Validators.required]],
    });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; 

  }
  public onAddCus(): void {
    let dest = new Destination();
     
    dest.Name = this.addCusForm.get('name').value;
    dest.Country = this.addCusForm.get('country').value;
    dest.Description= this.addCusForm.get('description').value;
     this.service.addDestination(dest);
     this.dialog.closeAll();
     
     
   }
 
   openDialog(): void {
     this.dialog.closeAll();
   }
 
   public onResize(event: any): void {
     this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
   }
 
   saveChangesEnabled() {
     return this.addCusForm.value.name.length > 0 &&  this.addCusForm.value.country.length > 0 &&  this.addCusForm.value.description.length > 0;
   }
  
 
   formChanged() {
     this.wasFormChanged = true;
   }
}
