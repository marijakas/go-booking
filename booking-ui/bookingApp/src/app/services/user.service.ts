import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import { UserTokenState } from '../models/UserTokenState';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
   }

   public get currentUserValue(): User {
    return this.currentUserSubject.value;
}

  login(username: string, password: string) {
    return this.http.post<any>('http://127.0.0.1:5000/auth/sign-in', { 'username':username,'password': password })
        .pipe(map(userTokenState => {
            if (userTokenState.token) {
                localStorage.setItem('token', userTokenState.token);
                localStorage.setItem('username', username);
                localStorage.setItem('role',userTokenState.user.role )
                console.log(userTokenState.user.role + 'USERTOKST')
                console.log(userTokenState.token)
            }
            else{
              console.log("nema tokena")
            }

            return userTokenState.token;
        }));
}

logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('token');
  localStorage.removeItem('username');
}

isLoggedIn(): boolean {
  if (!localStorage.getItem('username')) {
      return false;
  }
  return true;
}


addUser(user:User)  {
  
  const body=JSON.stringify(user);
  return this.http.post<any>('http://127.0.0.1:5000/auth/sign-up',body, {headers: this.headers}).subscribe(
    (val) => {
        console.log("POST call successful value returned in body", 
                    val);
    },
    response => {
        console.log("POST call in error", response);
        this.openSnackBarUS();
    },
    () => {
        console.log("The POST observable is now completed.");
        this.openSnackBarS();
    });
    
}

openSnackBarS() {
this._snackBar.open("Check your email.", "OK", {
  duration: 4000,
});
}

openSnackBarUS() {
this._snackBar.open("Error occurs!", "OK", {
  duration: 2000,
});
}
}
