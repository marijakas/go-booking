import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Reservation } from 'src/app/models/Reservation';
import { ReservationService } from 'src/app/services/reservation.service';
import { UserService } from 'src/app/services/user.service';
import { DeleteDestinationComponent } from '../delete-destination/delete-destination.component';

@Component({
  selector: 'app-reservations-all',
  templateUrl: './reservations-all.component.html',
  styleUrls: ['./reservations-all.component.scss']
})
export class ReservationsAllComponent implements OnInit {

  reservations: Array<Reservation> = [];
  constructor(private authservice: UserService, private service: ReservationService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllRes();
  }
  logOut(): void {
    this.authservice.logout();
    location.replace("http://localhost:4200/home");
  }

  getAllRes(){
    this.service.getReservationsAll().subscribe((data: any) => {
      let res: Reservation;
      console.log("putovanja su ", data)
      data.forEach(obj => {
        res = new Reservation();
        res.ID = obj.ID;
        res.number_of_seats = obj.number_of_seats;
        res.sold = obj.sold;
        res.travel_name=obj.travel_name;
        this.reservations.push(res);

      });
      console.log(this.reservations + "putovanja")
    }, error => {

    });


  }
  

    delete(r:Reservation):void{
   
    this.service.deleteReservation(r.ID);
  }
  cancelReservation(r:Reservation) {
    const dialogRef = this.dialog.open(DeleteDestinationComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result){
        this.delete(r);
      }
    });
  }

}
