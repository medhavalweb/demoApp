import { OrdersComponent } from './dashboard/orders/orders.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/_helpers/auth.guard';

const routes: Routes = [
  {path:'', redirectTo:'login',pathMatch:'full'},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component:DashboardComponent, canActivate:[AuthGuard]},
  { path: 'dashboard/createOrder', component:OrdersComponent},
  { path: 'dashboard/edit/:id', component:DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
