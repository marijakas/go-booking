import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Reservation } from 'src/app/models/Reservation';
import { Travel } from 'src/app/models/Travel';
import { DestinationService } from 'src/app/services/destination.service';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss']
})
export class AddReservationComponent implements OnInit {

  public addCusForm: FormGroup;
  public number_of_seats: string='';
  
  public trvl = new Travel();
  public res = new Reservation();
  
  wasFormChanged = false;
  public breakpoint: number; // Breakpoint observer cod

  constructor(private fb: FormBuilder,
    public dialog: MatDialog, public service: ReservationService, private route: ActivatedRoute,  @Inject(MAT_DIALOG_DATA) public data: any) { }

 ngOnInit(): void {
   this.trvl = this.data.dataKey;
    this.addCusForm = this.fb.group({
      
      number_of_seats: [this.number_of_seats, [Validators.required]],
       
    });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; 
    

  }
  public onAddCus(): void {
    
    this.res.number_of_seats = Number(this.addCusForm.get('number_of_seats').value);
    this.res.reservation_date = 12122022;
    this.res.travel_id=this.trvl.ID;
    this.res.user_id= Number(localStorage.getItem('idUser'));

   

    console.log('travel - ', this.trvl)
   this.service.addResrvation(this.res);
    this.dialog.closeAll();
     
     
   }
 
   openDialog(): void {
     this.dialog.closeAll();
   }
 
   public onResize(event: any): void {
     this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
   }
 
   saveChangesEnabled() {
     return   this.addCusForm.value.number_of_seats.length > 0;
   }
  
 
   formChanged() {
     this.wasFormChanged = true;
   }

}
