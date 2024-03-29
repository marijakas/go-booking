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
      'http://localhost:8080/api/destination/destinations'
    );
  }

  addDestination(dest: Destination) {
    const body = JSON.stringify(dest);

    return this.http
      .post<any>('http://localhost:8080/api/destination/addDestination', body)
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
    return this.http.delete('http://localhost:8080/api/destination/delete/' + destId, {
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

    return this.http.get<Travel[]>("http://localhost:8080/api/travel/travelsByDestination/" + id);
  
   }
   deleteTravel(trvlId: number) {
    return this.http.delete('http://localhost:8080/api/travel/delete/' + trvlId, {headers: this.headers})
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
    return this.http.get<Destination>("http://localhost:8080/api/rating/rating/"+ id)
  }
  
  getDestById(id):Observable<Destination>{
    return this.http.get<Destination>("http://localhost:8080/api/destination/destination/"+ id)
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
      .post<any>('http://localhost:8080/api/travel/addTravel', body)
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

  updateTravel(travel: Travel) {
    const body=JSON.stringify(travel);
    return this.http.put<any>('http://localhost:8080/api/travel/updateTravel/'+travel.ID, body, {headers: this.headers}).subscribe(
      (val) => {
          console.log("PUT call successful value returned in body", 
                      val);
      },
      response => {
          console.log("PUT call in error", response);
          this.openSnackBarErr();
      },
      () => {
          console.log("The PUT observable is now completed.");
          this.openSnackBar();
      });
  
   }



   updateDestination(destination: Destination) {
    const body=JSON.stringify(destination);
    return this.http.put<any>('http://localhost:8080/api/destination/updateDestination/'+destination.ID, body, {headers: this.headers}).subscribe(
      (val) => {
          console.log("PUT call successful value returned in body", 
                      val);
      },
      response => {
          console.log("PUT call in error", response);
          this.openSnackBarErr();
      },
      () => {
          console.log("The PUT observable is now completed.");
          this.openSnackBar();
      });
  
   }
}
