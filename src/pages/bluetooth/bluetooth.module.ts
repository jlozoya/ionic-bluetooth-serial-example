import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../shared/shared.module';
import { BluetoothPage } from './bluetooth';

@NgModule({
  declarations: [
    BluetoothPage,
  ],
  imports: [
    IonicPageModule.forChild(BluetoothPage),
    SharedModule
  ],
  exports: [
    BluetoothPage
  ]
})
export class BluetoothPageModule {}
