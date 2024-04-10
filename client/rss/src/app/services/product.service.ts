import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Product } from 'src/app/models/product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, retry, throwError, catchError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  selectedProductForCheckout!: Product;
  constructor(private _http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }
  BaseURL: string = environment.backendurl;

  apiHelth(): any {
    return this._http.get(this.BaseURL);
  }
  httpOptions = {
    withCredentials: true,
  };
  encrypt = (text: any) => {
    const randomKey = environment.DECRYPT;
    const iv = randomKey ? randomKey.slice(0, 16) : "";
    const decrypted = CryptoJS.AES.encrypt(
      text,
      CryptoJS.enc.Utf8.parse(randomKey),
      {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CTR,
        padding: CryptoJS.pad.NoPadding,
      }
    );
    return decrypted.toString();
  };

  userLogin(data: any) {
    if (data.Password) {
      data.Password = this.encrypt(data.Password);
      console.log(data.Password)
    }
    return this._http
      .post(this.BaseURL + '/login/userlogin', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  readUsers(data: any) {
    return this._http
      .post(this.BaseURL + '/user/readusers', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  getProducts(): Observable<Product[]> {
    // Replace this with your actual product data
    return this._http.get(
      `https://fakestoreapi.com/products/`
    ) as Observable<Product[]>;
  }

  getSelectedProductForCheckout() {
    return this.selectedProductForCheckout;
  }

  setSelectedProductForCheckout(product: Product) {
    this.selectedProductForCheckout = product;
  }

  createOrder(product: Product) {
    const payload = {
      productName: product.title,
      amount: product.price,
    };
    return this._http.post(`${environment.backendurl}/api/createPaymentOrder`, {
      payload,
    });
  }

  verifyPaymentSignature(checkoutResponse: any, original_order_id: string) {
    const payload = {
      razorpay_signature: checkoutResponse.razorpay_signature,
      original_order_id: original_order_id,
      razorpay_payment_id: checkoutResponse.razorpay_payment_id,
    };

    return this._http.post(`${environment.backendurl}/api/validatePayment`, {
      payload,
    });
  }

  get nativeWindow(): any {
    if (isPlatformBrowser(this.platformId)) {
      return _window();
    }
  }
  // handleError
  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (
      error.error.statusMessage ==
      'Authentication token expired, please login again'
    ) {
      localStorage.clear();

      window.location.href = environment.url + 'login';
      return throwError(error.error);
    } else {
      return throwError(error.error);
    }
  }
}
function _window(): any {
  // return the global native browser window object
  return window;
}