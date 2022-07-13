import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Comment } from 'src/app/models/Comment';
import { CommentService } from 'src/app/services/comment.service';
import { DeleteDestinationComponent } from '../delete-destination/delete-destination.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  public username: string;
  @Input() comment: Comment = null;
   
  constructor(public dialog: MatDialog, public service:CommentService) { }

  ngOnInit(): void {
    this.username = localStorage.getItem("username");
  }
  openDeleteComment(comment: Comment) {
    const dialogRef = this.dialog.open(DeleteDestinationComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.service.deleteComment(comment.ID);
        
      }
    });
  }
}
