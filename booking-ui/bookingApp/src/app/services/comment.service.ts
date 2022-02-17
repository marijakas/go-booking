import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Comment } from '../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}
  bear  = localStorage.getItem("token");
  
  headers: HttpHeaders = new HttpHeaders({"Authorization": "Bearer " + this.bear,'content-type': 'application/json'})

 

   getAllCommentsForDestination(idDestination: number):Observable<Comment[]>{

    return this.http.get<Comment[]>("http://localhost:9092/api/comments/" + idDestination);
  
   }

   addComment(res:Comment){
    const body = JSON.stringify(res);
    console.log(body)
    console.log("TOKEN", this.bear)
    return this.http
      .post<any>('http://localhost:9092/api/addComment', body,{headers :this.headers})
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
    return this.http.delete('http://localhost:9092/api/deleteComment/' + commentId, {headers: this.headers})
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
