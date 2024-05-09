import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FailureComponent } from './failure/failure.component';
import { SuccessComponent } from './success/success.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErrorComponent } from './error/error.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { LoginauthGuard } from './guards/loginauth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./login-operation/login-operation.module').then((m) => m.LoginOperationModule),
  },
  { path: 'checkout/:paymentOrderId', component: CheckoutComponent },
  { path: 'paymentfailed', component: FailureComponent },
  { path: 'paymentsuccess', component: SuccessComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'list', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [LoginauthGuard] },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
