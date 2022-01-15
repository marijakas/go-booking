import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Destination } from 'src/app/models/Destination';
import { DestinationService } from 'src/app/services/destination.service';
import { DeleteDestinationComponent } from '../delete-destination/delete-destination.component';

@Component({
  selector: 'app-destination-item-user',
  templateUrl: './destination-item-user.component.html',
  styleUrls: ['./destination-item-user.component.scss']
})
export class DestinationItemUserComponent implements OnInit {

  @Input() destination;
  constructor( ) { }

  ngOnInit(): void {
  }
 
 

}
