import {Component, inject, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../shared/services/authentication.service";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  router = inject(Router);
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authenticationService.login(email, password).subscribe({
        next: (user) => {
          if (user) {
            console.log(user);
            this.authenticationService.update();
            this.router.navigateByUrl('/user');
          }
        }, error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log('Form is not valid');
    }
  }
}
