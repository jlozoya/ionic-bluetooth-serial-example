import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BluetoothPage } from './bluetooth';

@NgModule({
  declarations: [
    BluetoothPage,
  ],
  imports: [
    IonicPageModule.forChild(BluetoothPage)
  ],
  exports: [
    BluetoothPage
  ]
})
export class BluetoothPageModule {}
