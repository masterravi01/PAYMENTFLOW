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
export class LoginOperationService {

  constructor(
    private _http: HttpClient,
  ) { }
  BaseURL: string = environment.backendurl;
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
    if (data.Password) data.Password = this.encrypt(data.Password);
    return this._http
      .post(this.BaseURL + '/login/userlogin', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  userSignup(data: any) {
    if (data.User?.Password) data.User.Password = this.encrypt(data.User.Password);
    return this._http
      .post(this.BaseURL + '/login/userSignup', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  checkUserExist(data: any) {
    return this._http
      .post(this.BaseURL + '/login/checkUserExist', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  forgotPassword(data: any) {
    return this._http
      .post(this.BaseURL + '/login/forgot_password', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  checkResetToken(data: any) {
    return this._http
      .post(this.BaseURL + '/login/check_reset_token', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  resetPassword(data: any) {
    if (data.User?.Password) data.User.Password = this.encrypt(data.User.Password);
    return this._http
      .post(this.BaseURL + '/login/reset_password', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
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
