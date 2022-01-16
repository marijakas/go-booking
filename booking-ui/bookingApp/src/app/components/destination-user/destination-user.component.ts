import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Destination } from 'src/app/models/Destination';
import { Travel } from 'src/app/models/Travel';
import { DestinationService } from 'src/app/services/destination.service';
import { UserService } from 'src/app/services/user.service';
import { AddReservationComponent } from '../add-reservation/add-reservation.component';

@Component({
  selector: 'app-destination-user',
  templateUrl: './destination-user.component.html',
  styleUrls: ['./destination-user.component.scss']
})
export class DestinationUserComponent implements OnInit {

  destination: Destination;
  travels: Array<Travel> = [];
  idDest:number;
  constructor(private route: ActivatedRoute, private service: DestinationService, private authservice: UserService, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.route.params
      .subscribe(
        (params: Params) => {
          this.getAllTravels(params['id']);
          this.idDest = params['id'];
          this.service.getDestById(params['id']).subscribe(
            res => {
              this.destination = res;
            }

          );

        }

      );


  }

  getAllTravels(id: number) {


    this.service.getTravels(id).subscribe((data: any) => {
      let trav: Travel;
      console.log("putovanja su ", data)
      data.forEach(obj => {
        trav = new Travel();
        trav.ID = obj.ID;
        trav.name = obj.name;
        trav.price = obj.price;
        trav.description = obj.description;
        trav.date_time = obj.date_time;
        trav.free_seats=obj.free_seats;
        this.travels.push(trav);

      });
      console.log(this.travels + "putovanja")
    }, error => {

    });


  }

  
   
  addReservation(u:Travel):void{
    const dialogRef = this.dialog.open(AddReservationComponent, {
      width: '640px', disableClose: true, data: {
        dataKey: u
      }
    });
    
  }
  logOut(): void {
    this.authservice.logout();
    location.replace("http://localhost:4200/home");
  }
}
