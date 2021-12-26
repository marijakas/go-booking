import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageAdminComponent } from './components/home-page-admin/home-page-admin.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DestinationComponent } from './components/destination/destination.component';
import { HomePageUserComponent } from './components/home-page-user/home-page-user.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'homePageAdmin', component: HomePageAdminComponent },
  { path: 'homePageUser', component: HomePageUserComponent },
  { path: 'destination/:id', component: DestinationComponent }, // ovde treba da ide id jer ce se na osnovu njega dobaviti destinacija

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
