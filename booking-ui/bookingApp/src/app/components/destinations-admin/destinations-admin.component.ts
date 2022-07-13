import { Component, OnInit } from '@angular/core';
import { Destination } from 'src/app/models/Destination';
import { DestinationService } from 'src/app/services/destination.service';

@Component({
  selector: 'app-destinations-admin',
  templateUrl: './destinations-admin.component.html',
  styleUrls: ['./destinations-admin.component.scss']
})
export class DestinationsAdminComponent implements OnInit {
  destinations: Array<Destination> = [];
  constructor(public service: DestinationService) { }

  ngOnInit(): void {
    this.getAllDestinations();
    }

  getAllDestinations(){

    this.service.getDestinations().subscribe((data: any)  => {
      ;
      this.destinations = data;
    }, error => {
       
    });
  }
}
