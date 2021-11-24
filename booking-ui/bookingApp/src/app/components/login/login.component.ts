import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,  
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
  });

  // get return url from route parameters or default to '/'
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() { return this.loginForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.userService.login(this.f.username.value, this.f.password.value)
        .subscribe(
            data => {
                // this.router.navigate([this.returnUrl]);
                
                location.replace("http://localhost:4200/home");
            },
            error => {
              this.openSnackBarSE();
                this.alertService.error(error);
                this.loading = false;
            });
}



openSnackBarSE() {
  this._snackBar.open("Invalid username or password.", "OK", {
    duration: 2000,
  });
}
}
