import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginOperationService } from '../login-operation.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  constructor(private router: Router, private _LOS: LoginOperationService, private _Route: ActivatedRoute,) { }

  ResetForm: FormGroup | any;

  ngOnInit(): void {
    this.ResetForm = new FormGroup({

      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      ConfirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
    let Token = this._Route.snapshot.paramMap.get('token');
    this._LOS.checkResetToken({ Token: Token }).subscribe((data: any) => {
      console.log(data);
      this.ResetForm['controls']['Email'].setValue(data.data.User.Email)
    }, (error: any) => {
      console.log(error);
    });


  }

  ResetPW() {
    this._LOS.resetPassword({ User: this.ResetForm?.value }).subscribe((data: any) => {
      console.log(data);
    }, (error: any) => {
      console.log(error);
    });
  }
}
