import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../shared/services/authentication.service";
import {Router} from "@angular/router";
import {routes} from "../app.routes";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, MatButton],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {
  router = inject(Router);
  registrationForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.mustMatch('password', 'confirmPassword'),
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.authenticationService.register(this.registrationForm.value).subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigateByUrl('/login');
        }, error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log('Form is not valid');
    }
  }
}
