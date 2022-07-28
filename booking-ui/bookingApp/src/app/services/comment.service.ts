import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Comment } from '../models/Comment';
import { Rating } from '../models/Rating';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}
  bear  = localStorage.getItem("token");
  
  headers: HttpHeaders = new HttpHeaders({"Authorization": "Bearer " + this.bear,'content-type': 'application/json'})

 

   getAllCommentsForDestination(idDestination: number):Observable<Comment[]>{

    return this.http.get<Comment[]>("http://localhost:8080/api/rating/comments/" + idDestination);
  
   }

   addComment(res:Comment){
    const body = JSON.stringify(res);
    return this.http
      .post<any>('http://localhost:8080/api/rating/addComment', body,{headers :this.headers})
      .subscribe(
        (val) => {
          console.log('PUT call successful value returned in body', val);
          this.openSnackBar();
          window.location.reload();
        },
        (response) => {
          console.log('PUT call in error', response);
        },
        () => {
          console.log('The PUT observable is now completed.');
        }
      );
  }

  addRating(res:Rating){
    const body = JSON.stringify(res);
    return this.http
      .put<any>('http://localhost:8080/api/rating/addRating', body,{headers :this.headers})
      .subscribe(
        (val) => {
          console.log('PUT call successful value returned in body', val);
          this.openSnackBar();
          window.location.reload();
        },
        (response) => {
          console.log('PUT call in error', response);
        },
        () => {
          console.log('The PUT observable is now completed.');
        }
      );
  }


  deleteComment(commentId: number) {
    return this.http.delete('http://localhost:8080/api/rating/deleteComment/' + commentId, {headers: this.headers})
      .subscribe(
        (val) => {
          console.log('PUT call successful value returned in body', val);
          this.openSnackBar();
     
        },
        (response) => {
          console.log('PUT call in error', response);
          this.openSnackBarErr();
        },
        () => {
          console.log('The PUT observable is now completed.');
        }
      );
  }

  openSnackBarErr() {
    this._snackBar.open('Error occured!', 'OK', {
      duration: 2000,
    });
  }
  openSnackBar() {
    this._snackBar.open('Operation is successfull', 'OK', {
      duration: 2000,
    });
  }
}
