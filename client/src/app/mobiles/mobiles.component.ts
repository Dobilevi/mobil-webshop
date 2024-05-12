import {CommonModule, NgOptimizedImage} from "@angular/common";
import {Component, OnInit} from '@angular/core';
import {MobileService} from "../shared/services/mobile.service";
import {Mobile} from "../shared/model/Mobile";
import {ActivatedRoute, RouterLink} from "@angular/router";
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
  searchString!: string | null;
  mobiles: Mobile[] = [];

  constructor(private mobileService: MobileService, private cartService: CartService, private authenticationService: AuthenticationService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.searchString = this.route.snapshot.paramMap.get('search');

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
      this.cartService.addToCart(mobile.modelName, 1).subscribe({
        next: (data) => {
          console.log(data);
        }, error: (err) => {
          console.log(err);
        }
      });
  }
}
