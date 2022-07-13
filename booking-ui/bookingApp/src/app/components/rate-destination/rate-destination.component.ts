import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rating } from 'src/app/models/Rating';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-rate-destination',
  templateUrl: './rate-destination.component.html',
  styleUrls: ['./rate-destination.component.scss'],
})
export class RateDestinationComponent implements OnInit {
  public rate = new Rating();
  public addCusForm: FormGroup;
  public ratingValue: string = '';
  wasFormChanged = false;
  public breakpoint: number; // Breakpoint observer cod

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public service: CommentService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.addCusForm = this.fb.group({
      ratingValue: [this.ratingValue, [Validators.required]],
    });
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2;
  }
  openDialog(): void {
    this.dialog.closeAll();
  }

  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  saveChangesEnabled() {
    return this.addCusForm.value.ratingValue.length > 0;
  }

  formChanged() {
    this.wasFormChanged = true;
  }
  public onAddCus(): void {
    this.rate.value = Number(this.addCusForm.get('ratingValue').value);
    this.rate.destination_id = Number(this.data.dataKey.ID);
    this.rate.user_id = Number(localStorage.getItem('idUser'));
    this.service.addRating(this.rate);
    this.dialog.closeAll();
  }
}
