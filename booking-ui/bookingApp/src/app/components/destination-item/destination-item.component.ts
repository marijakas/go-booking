import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Destination } from 'src/app/models/Destination';
import { DestinationService } from 'src/app/services/destination.service';
import { DeleteDestinationComponent } from '../delete-destination/delete-destination.component';
import { EditDestinationComponent } from '../edit-destination/edit-destination.component';

@Component({
  selector: 'app-destination-item',
  templateUrl: './destination-item.component.html',
  styleUrls: ['./destination-item.component.scss']
})
export class DestinationItemComponent implements OnInit {
  @Input() destination;
  constructor(public service: DestinationService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  saveChangesEnabled() {
    return this.destination.name.length > 0 && this.destination.description.length > 0;
  }

  saveChanges(desti: Destination) {
    const dialogRef = this.dialog.open(EditDestinationComponent, {
      width: '640px', disableClose: true, data: {
        dataKey: desti
      }
    });
  }

  deletePost(desti: Destination){
    console.log(desti)
    this.service.deleteDestination(desti.ID);
  }

  openDeleteDest(desti: Destination) {
    const dialogRef = this.dialog.open(DeleteDestinationComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result){
        this.deletePost(desti);
      }
    });
  }

  openDestination(idDest:number){
    console.log(idDest)
  }
}
