import { Component, OnInit } from '@angular/core';
import { LoginOperationService } from '../login-operation.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  PasswordForm: FormGroup | any;

  constructor(private _LOS: LoginOperationService) { }

  ngOnInit() {
    this.PasswordForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
    });

  }

  forgotPW() {

    this._LOS.forgotPassword(this.PasswordForm.value).subscribe(
      (data: any) => {
        console.log(data);

      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
