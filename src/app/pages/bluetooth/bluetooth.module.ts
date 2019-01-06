import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { BluetoothPage } from './bluetooth.page';

@NgModule({
  declarations: [
    BluetoothPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: BluetoothPage }]),
    TranslateModule.forChild()
  ],
  exports: [
    BluetoothPage,
  ]
})
export class BluetoothPageModule {}
