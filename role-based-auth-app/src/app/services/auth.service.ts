import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7085/api/Auth';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  login(credentials: any): Observable<any> {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map((response) => {
          const token = response.token;
          if (token) {
            localStorage.setItem('token', token);

            // Decode token and extract role
            const decodedToken: any = jwtDecode(token);
            const roleClaim ='http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
              
            const role= decodedToken[roleClaim] || null;

            // Navigate based on role
            // if (role === 'Admin') {
            //   this.router.navigate(['/admin']);
            // } else if (role === 'User') {
            //   this.router.navigate(['/user']);
            // } else {
            //   this.router.navigate(['/dashboard']);
            // }

            return true;
          }
          return false;
        }),
        catchError((err) => {
          console.error('Login error', err);
          return of(false);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getRole(): string {
    
    const token = localStorage.getItem('token');
    if (!token) return '';
    const decodedToken: any = jwtDecode(token);
    const roleClaim ='http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      
    const role= decodedToken[roleClaim] || null;
    return role
  }
}
function of(arg0: boolean): any {
  throw new Error('Function not implemented.');
}
