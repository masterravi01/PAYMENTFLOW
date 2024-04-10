import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var razorPay: any;
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  public products: Product[] | undefined;
  constructor(private productService: ProductService, private router: Router, private modalService: NgbModal) { }


  public open(modal: any): void {
    this.modalService.open(modal);
  }
  ngOnInit() {
    this.getProducts();
  }
  getProducts() {
    this.productService.getProducts().subscribe((response: Product[]) => {
      this.products = response;
      console.log(this.products);
    });
  }

  addToCart(product: Product) {
    // Implement your cart logic here
    console.log('Product added to cart:', product);
  }
  buyNow(product: Product) {
    // Implement your checkout logic here
    this.productService.createOrder(product).subscribe((response: any) => {
      if (response.status == 200) {
        const paymentOrderId = response.data.id;
        this.productService.setSelectedProductForCheckout(product)
        this.router.navigateByUrl(`/checkout/${paymentOrderId}`);
      } else {
        alert('server side error cant process order');
      }
    });
  }
}
