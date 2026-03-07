import { Routes } from '@angular/router';
import { PetsComponent } from '../pets/pets.component';
import { AuthGuard } from '../auth/auth.guard';
import { LoginCallbackComponent } from '../login-callback/login-callback.component';
import { petsResolver } from '../pets/pets.resolver';

export const routes: Routes = [
  {
    path: 'login-callback',
    component: LoginCallbackComponent
  },
  {
    path: 'pets',
    component: PetsComponent,
    title: 'Pets',
    canActivate: [AuthGuard],
    resolve: { pets: petsResolver }
  },
  {
    path: '',
    redirectTo: '/pets',
    pathMatch: 'full'
  }
]
