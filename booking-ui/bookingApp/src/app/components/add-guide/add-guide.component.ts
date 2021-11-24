import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/User';
import { AddUserService } from 'src/app/services/add-user.service';

@Component({
  selector: 'app-add-guide',
  templateUrl: './add-guide.component.html',
  styleUrls: ['./add-guide.component.scss']
})
export class AddGuideComponent implements OnInit {

  public addCusForm: FormGroup;
  public first_name: string='';
  public last_name: string='';
  public email: string='';
  public username: string='';
  public password: string='';
  wasFormChanged = false;
  public 
  public breakpoint: number; // Breakpoint observer cod

  constructor(private fb: FormBuilder,
    public dialog: MatDialog, private service: AddUserService) { }

  ngOnInit(): void {
    this.addCusForm = this.fb.group({
      
      first_name: [this.first_name, [Validators.required]],
      last_name: [this.last_name, [Validators.required]],
      email: [this.email, [Validators.required, Validators.email]],
      username: [this.username, [Validators.required]],
      password: [this.password, [Validators.required]],
    });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; 

  }

  public onAddCus(): void {
   let user = new User();
   user.first_name = this.addCusForm.get('first_name').value;
   user.last_name = this.addCusForm.get('last_name').value;
   user.username = this.addCusForm.get('username').value;
   user.email = this.addCusForm.get('email').value;
   user.password = this.addCusForm.get('password').value;
    this.service.addGuide(user);
    this.dialog.closeAll();
    
    
  }

  openDialog(): void {
    this.dialog.closeAll();
  }

  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  saveChangesEnabled() {
    return this.addCusForm.value.first_name.length > 0 &&  this.addCusForm.value.last_name.length > 0 &&  this.addCusForm.value.username.length > 0 &&  this.addCusForm.value.email.length > 0 &&  this.addCusForm.value.password.length > 0;
  }
 

  formChanged() {
    this.wasFormChanged = true;
  }
}