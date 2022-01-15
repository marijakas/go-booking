import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomePageAdminComponent } from './components/home-page-admin/home-page-admin.component';
import { AddAdminComponent } from './components/add-admin/add-admin.component';
import { AddGuideComponent } from './components/add-guide/add-guide.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { DestinationsAdminComponent } from './components/destinations-admin/destinations-admin.component';
import { DestinationItemComponent } from './components/destination-item/destination-item.component';
import { DeleteDestinationComponent } from './components/delete-destination/delete-destination.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddDestinationComponent } from './components/add-destination/add-destination.component';
import { MaterialElevationDirective } from './components/material-elevtion.directive';
import { DestinationComponent } from './components/destination/destination.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AddTravelComponent } from './components/add-travel/add-travel.component';
import { HomePageUserComponent } from './components/home-page-user/home-page-user.component';
import { EditTravelComponent } from './components/edit-travel/edit-travel.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DestinationsUserComponent } from './components/destinations-user/destinations-user.component';
import { DestinationItemUserComponent } from './components/destination-item-user/destination-item-user.component';
import { DestinationUserComponent } from './components/destination-user/destination-user.component';

 @NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegistrationComponent,
    HomePageAdminComponent,
    AddAdminComponent,
    AddGuideComponent,
    DestinationsAdminComponent,
    DestinationItemComponent,
    DeleteDestinationComponent,
    AddDestinationComponent,
    MaterialElevationDirective,
    DestinationComponent,
    AddTravelComponent,
    HomePageUserComponent,
    EditTravelComponent,
    DestinationsUserComponent,
    DestinationItemUserComponent,
    DestinationUserComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatGridListModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatCardModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
