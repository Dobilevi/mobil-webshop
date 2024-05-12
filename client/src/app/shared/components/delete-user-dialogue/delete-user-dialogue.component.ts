import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {FlexLayoutModule} from '@angular/flex-layout'

@Component({
  selector: 'app-delete-user-dialogue',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    FlexLayoutModule
  ],
  templateUrl: './delete-user-dialogue.component.html',
  styleUrl: './delete-user-dialogue.component.scss'
})
export class DeleteUserDialogueComponent {

  constructor(private dialogRef: MatDialogRef<DeleteUserDialogueComponent>) {

  }

  onCancel() {
    this.dialogRef.close();
  }
}
