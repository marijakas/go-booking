import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}
  bear  = localStorage.getItem("token");
  
  headers: HttpHeaders = new HttpHeaders({"Authorization": "Bearer " + this.bear})

 

   getAllCommentsForDestination(idDestination: number):Observable<Comment[]>{

    return this.http.get<Comment[]>("http://localhost:9092/api/comments/" + idDestination);
  
   }



}
