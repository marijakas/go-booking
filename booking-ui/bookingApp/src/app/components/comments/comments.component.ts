import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import {Comment} from 'src/app/models/Comment'
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  comments: Array<Comment> = [];
  idDestination:number;
  constructor(private service: CommentService,   private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.idDestination = (params['id']);
        

      }

    );

    this.service.getAllCommentsForDestination(this.idDestination).subscribe(data=>
      {
        this.comments = data;

      })
  }

}
