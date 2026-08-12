import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'bluetooth', pathMatch: 'full' },
  { path: 'bluetooth', loadChildren: () => import('./pages/bluetooth/bluetooth.module').then(m => m.BluetoothPageModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
