import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AddUserService {

  bear  = localStorage.getItem("token");
    
  headers: HttpHeaders = new HttpHeaders({"Authorization": "Bearer " + this.bear, 'content-type': 'application/json'})

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) { }


  addAdmin(user:User)  {
    const body=JSON.stringify(user);
     
    return this.http.post<any>('http://localhost:5000/auth/add-admin', body, {headers: this.headers}).subscribe(
      (val) => {
          console.log("PUT call successful value returned in body", 
                      val);
                      this.openSnackBar();
      },
      response => {
          console.log("PUT call in error", response);
       },
      () => {
          console.log("The PUT observable is now completed.");
       });
  
 }

 addGuide(user:User)  {
   
  const body=JSON.stringify(user);
   
  return this.http.post<any>('http://localhost:5000/auth/add-guide', body, {headers: this.headers}).subscribe(
    (val) => {
        console.log("PUT call successful value returned in body", 
                    val);
                    this.openSnackBar();
    },
    response => {
        console.log("PUT call in error", response);
     },
    () => {
        console.log("The PUT observable is now completed.");
     });

}


openSnackBar() {
  this._snackBar.open("Successfully registered new user.", "OK", {
    duration: 2000,
  });
} 
}
