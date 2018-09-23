import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';

import { AdminGuardService as AdminGuard } from './services/admin-guard/admin-guard.service';
import { UserGuardService as UserGuard } from './services/user-guard/user-guard.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LandingComponent } from './components/landing/landing.component';
import { AdminLandingComponent } from './components/admin-landing/admin-landing.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { EnterOtpComponent } from './components/enter-otp/enter-otp.component';
import { EnterPhoneComponent } from './components/enter-phone/enter-phone.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/signup', component: SignupComponent },
  { path: 'landing', component: LandingComponent, canActivate: [UserGuard] },
  { path: 'admin/landing', component: AdminLandingComponent, canActivate: [AdminGuard] },
  { path: 'admin/user', component: AddUserComponent, canActivate: [AdminGuard] },
  { path: 'verification', component: EnterOtpComponent },
  { path: 'verify/:username', component: EnterPhoneComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminLoginComponent,
    SignupComponent,
    LandingComponent,
    AdminLandingComponent,
    AddUserComponent,
    EnterOtpComponent,
    EnterPhoneComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    HttpClientModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
