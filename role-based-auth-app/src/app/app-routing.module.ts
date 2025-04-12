import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AuthGuard } from './guard/auth.guard';
import { RoleGuard } from './guard/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Login route
  { path: 'login', component: LoginComponent },
  
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Admin' }
  },
  {
    path: 'user',
    component: HomeComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'User' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
