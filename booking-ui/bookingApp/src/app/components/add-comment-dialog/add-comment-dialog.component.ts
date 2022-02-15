import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Comment } from 'src/app/models/Comment';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-add-comment-dialog',
  templateUrl: './add-comment-dialog.component.html',
  styleUrls: ['./add-comment-dialog.component.scss']
})
export class AddCommentDialogComponent implements OnInit {

  public addCusForm: FormGroup;
  public text: string='';
  
  wasFormChanged = false;
  public breakpoint: number; // Breakpoint observer cod

 constructor(private fb: FormBuilder,
   public dialog: MatDialog, public service: CommentService,  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.addCusForm = this.fb.group({
      
      text: [this.text, [Validators.required]],
     
    });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; 

  }
  public onAddCus(): void {
    let comment = new Comment();
     comment.destination_id = Number(this.data.dataKey);
    comment.text = this.addCusForm.get('text').value;
   
     this.service.addComment(comment);
     this.dialog.closeAll();
     
     
   }
 
   openDialog(): void {
     this.dialog.closeAll();
   }
 
   public onResize(event: any): void {
     this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
   }
 
   saveChangesEnabled() {
     return this.addCusForm.value.text.length > 0;
   }
  
 
   formChanged() {
     this.wasFormChanged = true;
   }

}
