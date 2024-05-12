import {Component, OnInit} from '@angular/core';
import {ReviewService} from "../shared/services/review.service";
import {AuthenticationService} from "../shared/services/authentication.service";
import {MobileService} from "../shared/services/mobile.service";

@Component({
  selector: 'app-initialization',
  standalone: true,
  imports: [],
  templateUrl: './initialization.component.html',
  styleUrl: './initialization.component.scss'
})
export class InitializationComponent implements OnInit {
  constructor(private reviewService: ReviewService, private mobileService: MobileService, private authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    this.authenticationService.initUsers().subscribe({
      next: (data) => {
        console.log(data);
      }, error: (err) => {
        console.log(err);
      }
    });

    this.mobileService.initMobiles().subscribe({
      next: (data) => {
        console.log(data);
      }, error: (err) => {
        console.log(err);
      }
    });

    this.reviewService.initReviews().subscribe({
      next: (data) => {
        console.log(data);
      }, error: (err) => {
        console.log(err);
      }
    });
  }
}
