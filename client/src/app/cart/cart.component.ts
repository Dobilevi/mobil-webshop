import {Component, OnInit} from '@angular/core';
import {CartItem} from "../shared/model/CartItem";
import {CartService} from "../shared/services/cart.service";
import {NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatFooterRow, MatFooterRowDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {RouterLink} from "@angular/router";
import {MatButton, MatFabButton} from "@angular/material/button";
import {update} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgForOf,
    MatIcon,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    RouterLink,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatFabButton,
    MatFooterRow,
    MatFooterRowDef,
    MatButton
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  columns = ['image', 'name', 'quantity', 'delete'];
  cart: CartItem[] = [];

  constructor(private cartService: CartService) {

  }

  ngOnInit(): void {
    this.update();
  }

  update() {
    this.cartService.getCart().subscribe({
      next: (data: CartItem[]) => {
        this.cart = data;
      }, error: err => {
        console.log(err);
      }
    });
  }

  removeCartItem(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem).subscribe({
      next: (data) => {
        console.log(data);
        this.update();
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  purchase() {
    this.cartService.purchase(this.cart).subscribe({
      next: (data) => {
        console.log(data);
        this.update();
      }, error: (err) => {
        console.log(err);
      }
    });
  }
}
