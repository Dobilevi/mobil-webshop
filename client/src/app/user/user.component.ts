import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {User} from "../shared/model/User";
import {AuthenticationService} from "../shared/services/authentication.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatDialog, MatDialogActions} from "@angular/material/dialog";
import {DeleteUserDialogueComponent} from "../shared/components/delete-user-dialogue/delete-user-dialogue.component";
import {MatButton} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButton, FlexModule, MatDialogActions],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  router = inject(Router);
  user: User = {username: '', email: '', name: '', address: '', password: '', admin: false};
  updateUserForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private matDialog: MatDialog) {

  }

  ngOnInit() {
    this.updateUserForm = this.formBuilder.group({
      username: [''],
      name: [''],
      address: [''],
      password: ['', Validators.minLength(8)],
      confirmPassword: ['']
    });

    this.authenticationService.getUser().subscribe({
      next: (data) => {
        if (data) {
          this.user = data;
          this.updateUserForm.setValue({
            username: data.username,
            name: data.name,
            address: data.address,
            password: "",
            confirmPassword: ""
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  onSubmit(): void {
    if (this.updateUserForm.valid) {
      const name = this.updateUserForm.get('name')?.value;
      const address = this.updateUserForm.get('address')?.value;

      const updatedUser: User = {
        username: this.updateUserForm.get('username')?.value,
        email: '',
        name: (name) ? (name) : (''),
        address: (address) ? (address) : (''),
        password: '',
        admin: false
      };

      this.authenticationService.updateUser(updatedUser).subscribe({
        next: (data) => {
          console.log(data);
        }, error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log('Form is not valid');
    }
  }

  logout() {
    this.authenticationService.logout().subscribe({
      next: (data) => {
        this.authenticationService.update();
        this.router.navigateByUrl('/login');
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  deleteUser(){
    const dialogRef = this.matDialog.open(DeleteUserDialogueComponent);

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          this.authenticationService.deleteUser().subscribe({
            next: (data) => {
              this.authenticationService.logout().subscribe({
                next: (data) => {
                  this.authenticationService.update();
                  this.router.navigateByUrl('/login');
                }, error: (err) => {
                  console.log(err);
                }
              });
            }, error: (err) => {
              console.log(err);
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }
}
