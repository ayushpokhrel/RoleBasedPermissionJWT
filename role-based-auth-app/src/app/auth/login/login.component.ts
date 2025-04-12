import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const role = this.authService.getRole();

        // Redirect based on role
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'User') {
          this.router.navigate(['/user']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
