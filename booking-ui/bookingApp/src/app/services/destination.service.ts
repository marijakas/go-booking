import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Destination } from '../models/Destination';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}
  bear  = localStorage.getItem("token");
    
  headers: HttpHeaders = new HttpHeaders({"Authorization": "Bearer " + this.bear, 'content-type': 'application/json'})
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

  openSnackBar() {
    this._snackBar.open('Successfully registered new user.', 'OK', {
      duration: 2000,
    });
  }
}
