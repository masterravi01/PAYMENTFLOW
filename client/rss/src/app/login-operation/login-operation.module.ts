import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginOperationRoutingModule } from './login-operation-routing.module';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    LoginOperationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class LoginOperationModule { }
