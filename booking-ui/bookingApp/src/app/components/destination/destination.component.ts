import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { Destination } from 'src/app/models/Destination';
import { Travel } from 'src/app/models/Travel';
import { DestinationService } from 'src/app/services/destination.service';
import { UserService } from 'src/app/services/user.service';
import { AddTravelComponent } from '../add-travel/add-travel.component';

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.scss']
})
export class DestinationComponent implements OnInit {
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
        this.travels.push(trav);

      });
      console.log(this.travels + "putovanja")
    }, error => {

    });


  }
  logOut(): void {
    this.authservice.logout();
    location.replace("http://localhost:4200/home");
  }
  deleteTravel(u:Travel):void{
    console.log(u)
    this.service.deleteTravel(u.ID);
  }

  openDialogTravel(): void {
    const dialogRef = this.dialog.open(AddTravelComponent, {
      width: '640px', disableClose: true, data: {
        dataKey: this.idDest
      }
    });
  }

}
