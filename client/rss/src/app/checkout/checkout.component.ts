import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  razorPayKey: any;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  selectedProduct!: Product;
  ngOnInit() {
    console.log({
      key_id: environment.razor_key_id,
      key_secret: environment.razor_key_secret
    });
    this.getRazorPayKey();
    this.listenSelectedProduct();
    this.getOrderId();
  }
  getRazorPayKey() {
    this.razorPayKey = environment.razor_key_id;

  }
  getOrderId() {
    return this.route.snapshot.params['paymentOrderId'];
  }
  listenSelectedProduct() {
    this.selectedProduct = this.productService.getSelectedProductForCheckout();
  }

  payWithRazorpay() {
    const paymentOrderId = this.getOrderId();
    console.log(this.razorPayKey);
    const options: any = {
      key: this.razorPayKey,
      amount: this.selectedProduct?.price * 100, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'Ravi Limited', // company name or product name
      description: '', // product description
      image: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png', // company logo or product image
      order_id: paymentOrderId, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#ddcbff',
      },
    };
    options.handler = (response: any, error: any) => {
      options.response = response;
      if (error) {
        this.router.navigateByUrl('/paymentfailed');
      } else {
        this.productService
          .verifyPaymentSignature(response, paymentOrderId)
          .subscribe((response: any) => {
            response.data.isPaymentVerfied
              ? this.router.navigateByUrl('paymentsuccess')
              : this.router.navigateByUrl('paymentfailed');
          });
      }
      // call your backend api to verify payment signature & capture transaction
    };
    options.modal.ondismiss = () => {
      // handle the case when user closes the form while transaction is in progress
      alert('Transaction has been cancelled.');
      this.router.navigateByUrl('');
    };
    const rzp = new this.productService.nativeWindow.Razorpay(options);
    rzp.open();
  }
}
