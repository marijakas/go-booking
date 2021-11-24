import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  constructor( private formBuilder: FormBuilder,
    private userService:UserService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      email :[''],
      password: ['', [Validators.required, Validators.minLength(6)]]
  });
  }
  get f() { return this.registerForm.controls; }
  
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
  }
   
 this.userService.addUser(this.registerForm.value);
 this.router.navigate(['/login']);
  }

}
