import { Component, OnInit } from '@angular/core';
import { Destination } from 'src/app/models/Destination';
import { DestinationService } from 'src/app/services/destination.service';

@Component({
  selector: 'app-destinations-user',
  templateUrl: './destinations-user.component.html',
  styleUrls: ['./destinations-user.component.scss']
})
export class DestinationsUserComponent implements OnInit {

  destinations: Array<Destination> = [];
  constructor(public service: DestinationService) { }

  ngOnInit(): void {
    this.getAllDestinations();
  console.log(this.destinations.length)  }

  getAllDestinations(){

    this.service.getDestinations().subscribe((data: any)  => {
      ;
      this.destinations = data;
    }, error => {
       
    });
  }

}
