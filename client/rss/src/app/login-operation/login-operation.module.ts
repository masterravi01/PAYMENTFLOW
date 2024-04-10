import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginOperationRoutingModule } from './login-operation-routing.module';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    LoginOperationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class LoginOperationModule { }
