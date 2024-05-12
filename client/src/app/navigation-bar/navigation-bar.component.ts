import {Component, inject, OnInit} from '@angular/core';
import {AuthenticationService} from "../shared/services/authentication.service";
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatFabButton} from "@angular/material/button";

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MatToolbar,
    MatIcon,
    MatButton,
    MatFabButton
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent implements OnInit {
  router = inject(Router);
  searchForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, protected authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: [''],
    });
  }

  onSubmit() {
    this.router.navigate(['/mobiles/', this.searchForm.get('search')?.value]);
  }

  logout() {
    this.authenticationService.logout().subscribe({
      next: (data) => {
        console.log(data);
        this.authenticationService.update();
        this.router.navigateByUrl('/login');
      }, error: (err) => {
        console.log(err);
      }
    });
  }
}
