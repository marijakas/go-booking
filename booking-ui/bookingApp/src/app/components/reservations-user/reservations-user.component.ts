import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Reservation } from 'src/app/models/Reservation';
import { ReservationService } from 'src/app/services/reservation.service';
import { UserService } from 'src/app/services/user.service';
import { DeleteDestinationComponent } from '../delete-destination/delete-destination.component';

@Component({
  selector: 'app-reservations-user',
  templateUrl: './reservations-user.component.html',
  styleUrls: ['./reservations-user.component.scss'],
})
export class ReservationsUserComponent implements OnInit {
  reservations: Array<Reservation> = [];
  constructor(
    private authservice: UserService,
    private service: ReservationService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllRes();
  }
  logOut(): void {
    this.authservice.logout();
    location.replace('http://localhost:4200/home');
  }

  getAllRes() {
    this.service
      .getReservationsForUser(Number(localStorage.getItem('UserId')))
      .subscribe(
        (data: any) => {
          let res: Reservation;
           
          data.forEach((obj) => {
            res = new Reservation();
            res.ID = obj.ID;
            res.number_of_seats = obj.number_of_seats;
            res.sold = obj.sold;
            res.travel_name = obj.travel_name;
            this.reservations.push(res);
          });
          
        },
        (error) => {}
      );
  }

  delete(r: Reservation): void {
    this.service.deleteReservation(r.ID);
  }
  cancelReservation(r: Reservation) {
    const dialogRef = this.dialog.open(DeleteDestinationComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete(r);
      }
    });
  }
}
