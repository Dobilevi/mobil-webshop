import {CommonModule, NgOptimizedImage} from "@angular/common";
import {Component, inject, OnInit} from '@angular/core';
import {MobileService} from "../shared/services/mobile.service";
import {Mobile} from "../shared/model/Mobile";
import {ActivatedRoute, ParamMap, Router, RouterLink} from "@angular/router";
import {CartService} from "../shared/services/cart.service";
import {AuthenticationService} from "../shared/services/authentication.service";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-mobiles',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, MatButton, MatFabButton, MatIcon],
  templateUrl: './mobiles.component.html',
  styleUrl: './mobiles.component.scss'
})
export class MobilesComponent implements OnInit {
  router = inject(Router);
  searchString!: string | null;
  mobiles: Mobile[] = [];

  constructor(private mobileService: MobileService, private cartService: CartService, private authenticationService: AuthenticationService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.searchString = paramMap.get('search');
      this.update();
    });
  }

  update() {
    this.mobileService.getAll((this.searchString) ? (this.searchString) : ("")).subscribe({
      next: (data) => {
        if (data) {
          this.mobiles = data;
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  addToCart(mobile: Mobile) {
    if (this.authenticationService.isLoggedInVar) {
      this.cartService.addToCart(mobile.modelName, 1).subscribe({
        next: (data) => {
          console.log(data);
        }, error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log("User is not logged in");
      this.router.navigateByUrl('/login');
    }
  }
}
