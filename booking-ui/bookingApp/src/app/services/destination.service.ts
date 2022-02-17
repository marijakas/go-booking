import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Destination } from '../models/Destination';
import { Travel } from '../models/Travel';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}
  bear  = localStorage.getItem("token");
    
  headers: HttpHeaders = new HttpHeaders({"Authorization": "Bearer " + this.bear, 'content-type': 'application/json'})
  headers2: HttpHeaders = new HttpHeaders({'content-type': 'application/json'})
  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(
      'http://localhost:9090/api/destinations'
    );
  }

  addDestination(dest: Destination) {
    const body = JSON.stringify(dest);

    return this.http
      .post<any>('http://localhost:9090/api/addDestination', body)
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

  deleteDestination(destId: number) {
    return this.http.delete('http://localhost:9090/api/delete/' + destId, {
        headers: this.headers,
      })
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
  getTravels(id:number):Observable<Travel[]>{

    return this.http.get<Travel[]>("http://localhost:9091/api/travelsByDestination/" + id);
  
   }
   deleteTravel(trvlId: number) {
    return this.http.delete('http://localhost:9091/api/delete/' + trvlId, {headers: this.headers})
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

  getAvgRating(id):Observable<Destination>{
    return this.http.get<Destination>("http://localhost:9092/api/rating/"+ id)
  }
  
  getDestById(id):Observable<Destination>{
    return this.http.get<Destination>("http://localhost:9090/api/destination/"+ id)
  }



  openSnackBar() {
    this._snackBar.open('Operation is successfull', 'OK', {
      duration: 2000,
    });
  }
  openSnackBarErr() {
    this._snackBar.open('Error occured!', 'OK', {
      duration: 2000,
    });
  }

  addTravel(travel:Travel){
    const body = JSON.stringify(travel);
    console.log(body)
    return this.http
      .post<any>('http://localhost:9091/api/addTravel', body)
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
}
