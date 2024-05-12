import { Routes } from '@angular/router';
import {RegistrationComponent} from "./registration/registration.component";
import {LoginComponent} from "./login/login.component";
import {MobilesComponent} from "./mobiles/mobiles.component";
import {MobileComponent} from "./mobile/mobile.component";
import {UserComponent} from "./user/user.component";
import {authenticationGuard} from "./shared/guards/authentication.guard"
import {loggedInGuard} from "./shared/guards/logged-in.guard";
import {AddMobileComponent} from "./add-mobile/add-mobile.component";
import {CartComponent} from "./cart/cart.component";
import {adminGuard} from "./shared/guards/admin.guard";
import {InitializationComponent} from "./initialization/initialization.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent,  pathMatch: 'full', canActivate: [loggedInGuard] },
  { path: 'registration', component: RegistrationComponent,  pathMatch: 'full', canActivate: [loggedInGuard] },
  { path: 'mobiles', component: MobilesComponent,  pathMatch: 'full' },
  { path: 'mobiles/:search', component: MobilesComponent,  pathMatch: 'full' },
  { path: 'mobile/:modelName', component: MobileComponent,  pathMatch: 'full' },
  { path: 'add-mobile', component: AddMobileComponent,  pathMatch: 'full', canActivate: [] },
  { path: 'cart', component: CartComponent, pathMatch: 'full', canActivate: [authenticationGuard] },
  { path: 'user', component: UserComponent,  pathMatch: 'full', canActivate: [authenticationGuard] },
  { path: 'init', component: InitializationComponent,  pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
