import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Travel } from 'src/app/models/Travel';
import { DestinationService } from 'src/app/services/destination.service';

@Component({
  selector: 'app-add-travel',
  templateUrl: './add-travel.component.html',
  styleUrls: ['./add-travel.component.scss']
})
export class AddTravelComponent implements OnInit {
  public addCusForm: FormGroup;
  public name: string='';
  public description: string='';
  public price: string='';
  public free_seats: string='';
  public trvl = new Travel();
  public date_time:string='';
  wasFormChanged = false;
  public breakpoint: number; // Breakpoint observer cod

  constructor(private fb: FormBuilder,
    public dialog: MatDialog, public service: DestinationService, private route: ActivatedRoute,  @Inject(MAT_DIALOG_DATA) public data: any) { }

 ngOnInit(): void {
    this.addCusForm = this.fb.group({
      
      name: [this.name, [Validators.required]],
      price: [this.price, [Validators.required]],
      description: [this.description, [Validators.required]],
     free_seats: [this.free_seats, [Validators.required]],
     date_time: [this.date_time, [Validators.required]],
    });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; 
    

  }
  public onAddCus(): void {
    
    
    this.trvl.name = this.addCusForm.get('name').value;
    this.trvl.price = Number(this.addCusForm.get('price').value);
    this.trvl.description= this.addCusForm.get('description').value;
    this.trvl.destination_id = Number(this.data.dataKey);
    this.trvl.date_time = this.addCusForm.get('date_time').value;
    this.trvl.free_seats = Number(this.addCusForm.get('free_seats').value);

    console.log('travel - ', this.trvl)
   // this.service.addTravel(this.trvl);
    this.dialog.closeAll();
     
     
   }
 
   openDialog(): void {
     this.dialog.closeAll();
   }
 
   public onResize(event: any): void {
     this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
   }
 
   saveChangesEnabled() {
     return this.addCusForm.value.name.length > 0 &&  this.addCusForm.value.price.length > 0 &&  this.addCusForm.value.description.length > 0 &&  this.addCusForm.value.free_seats.length > 0;
   }
  
 
   formChanged() {
     this.wasFormChanged = true;
   }
}
