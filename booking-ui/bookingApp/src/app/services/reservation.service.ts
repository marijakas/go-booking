import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Reservation } from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}
  headers2: HttpHeaders = new HttpHeaders({'content-type': 'application/json'})
  bear  = localStorage.getItem("token");
  openSnackBar() {
    this._snackBar.open('Operation is successfull', 'OK', {
      duration: 2000,
    });
  }

  addResrvation(res:Reservation){
    const body = JSON.stringify(res);
    console.log(body)
    return this.http
      .post<any>('http://localhost:9094/api/addReservation', body)
      .subscribe(
        (val) => {
          console.log('PUT call successful value returned in body', val);
          this.openSnackBar();
          //window.location.reload();
        },
        (response) => {
          console.log('PUT call in error', response);
        },
        () => {
          console.log('The PUT observable is now completed.');
        }
      );
  }
  getReservationsForUser(id:number):Observable<Reservation[]>{

    return this.http.get<Reservation[]>("http://localhost:9094/api/getReservationsByUser/" + id);
  

   }

   getReservationsAll():Observable<Reservation[]>{

    return this.http.get<Reservation[]>("http://localhost:9094/api/getReservations");
  
   }
   openSnackBarErr() {
    this._snackBar.open('Error occured!', 'OK', {
      duration: 2000,
    });
  }

   deleteReservation(resId: number) {
    return this.http.delete('http://localhost:9094/api/deleteReservation/' + resId, {headers: this.headers2})
      .subscribe(
        (val) => {
          console.log('PUT call successful value returned in body', val);
          this.openSnackBar();
          window.location.reload();
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
}
