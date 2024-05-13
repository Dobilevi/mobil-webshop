import {Component, inject, OnInit} from '@angular/core';
import {Mobile} from "../shared/model/Mobile";
import {MobileService} from "../shared/services/mobile.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CartService} from "../shared/services/cart.service";
import {AuthenticationService} from "../shared/services/authentication.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Review_User} from "../shared/model/Review_User";
import {ReviewService} from "../shared/services/review.service";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatFabButton} from "@angular/material/button";
import {FlexModule} from "@angular/flex-layout";
import {MatDialogActions} from "@angular/material/dialog";

@Component({
  selector: 'app-mobile',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    MatIcon,
    MatFabButton,
    MatButton,
    FlexModule,
    MatDialogActions
  ],
  templateUrl: './mobile.component.html',
  styleUrl: './mobile.component.scss'
})
export class MobileComponent implements OnInit {
  router = inject(Router);
  modelName!: string;
  mobile?: Mobile;
  reviewForm!: FormGroup;
  reviews: Review_User[] = [];
  updateMobileForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private mobileService: MobileService, private cartService: CartService, private reviewService: ReviewService, protected authenticationService: AuthenticationService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    const modelName = this.route.snapshot.paramMap.get('modelName');

    if (modelName !== null) {
      this.modelName = modelName;
      this.updateMobileData();
    } else {
      this.router.navigateByUrl('/mobiles');
    }

    this.reviewForm = this.formBuilder.group({
      score: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      text: [''],
    });

    this.updateReviews();

    this.updateMobileForm = this.formBuilder.group({
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  updateMobileData() {
    this.mobileService.getMobile(this.modelName).subscribe({
      next: (mobile) => {
        if (mobile) {
          this.mobile = mobile;
          console.log(mobile);
        } else {
          console.log(mobile);
          this.router.navigateByUrl('/mobiles');
        }
      }, error: (err) => {
        console.log(err);
        this.router.navigateByUrl('/mobiles');
      }
    });
  }

  updateReviews() {
    this.reviewService.getReviewsByMobile(this.modelName).subscribe({
      next: (reviews) => {
        console.log(reviews);
        this.reviews = reviews;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  onClick() {
    if (this.authenticationService.isLoggedInVar) {
      this.cartService.addToCart(this.modelName, 1).subscribe({
        next: (data) => {
          console.log(data);
          this.updateMobileData();
        }, error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log('User is not logged in.');
      this.router.navigateByUrl('/login');
    }
  }

  deleteMobile() {
    this.mobileService.deleteMobile(this.modelName).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigateByUrl('/mobiles');
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      const score: number = this.reviewForm.get('score')?.value;
      const text: string = this.reviewForm.get('text')?.value;

      this.reviewService.addReview(this.modelName, score, text).subscribe({
        next: (data) => {
          console.log(data);
          this.updateReviews()
        }, error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log('Form is not valid.');
    }
  }

  updateMobile() {
    if (this.updateMobileForm.valid) {
      if (this.authenticationService.isLoggedIn() && this.authenticationService.isAdmin()) {
        if (this.mobile !== undefined) {
          const name = this.mobile.name;
          const company = this.mobile.company;
          const picture = this.mobile.picture;
          const modelName = this.modelName;
          const price: number = this.updateMobileForm.get('price')?.value;
          const stock: number = this.updateMobileForm.get('stock')?.value;

          this.mobileService.uploadMobile({name: name, modelName: modelName, company: company, picture: picture, price: price, stock: stock}).subscribe({
            next: (data) => {
              console.log(data);
            }, error: (err) => {
              console.log(err);
            }
          });
        } else {
          console.log('Failed to load mobile.');
        }
      } else {
        console.log('User is not logged in or is not an admin.');
      }
    } else {
      console.log('Form is not valid.');
    }
  }
}
