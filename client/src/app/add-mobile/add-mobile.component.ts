import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MobileService} from "../shared/services/mobile.service";
import {MatButton} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";

@Component({
  selector: 'app-add-mobile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton,
    FlexModule
  ],
  templateUrl: './add-mobile.component.html',
  styleUrl: './add-mobile.component.scss'
})
export class AddMobileComponent implements OnInit {
  mobileForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private mobileService: MobileService) {

  }

  ngOnInit() {
    this.mobileForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      modelName: ['', [Validators.required]],
      company: ['', [Validators.required]],
      picture: ['', [Validators.required]],
      price: ['', [Validators.required]],
      stock: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.mobileForm.valid) {
      this.mobileService.uploadMobile(this.mobileForm.value).subscribe({
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
}
