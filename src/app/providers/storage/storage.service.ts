import { Injectable } from '@angular/core';

import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class StorageService {

  BLUETOOTH_ID = 'bluetoothId';
  LANG = 'lang';

  constructor(
    public events: Events,
    public storage: Storage
  ) {}
  /**
   * Devuelve el tipo de usuario.
   * @return {Promise<string | null>} bluetoothId.
   */
  async getBluetoothId(): Promise<string | null> {
    const bluetoothId = await this.storage.get(this.BLUETOOTH_ID);
    return (bluetoothId) ? bluetoothId : null;
  }
  /**
   * Almacena el tipo de usuario.
   * @param {string} bluetoothId
   */
  async setBluetoothId(bluetoothId: string): Promise<any> {
    return await this.storage.set(this.BLUETOOTH_ID, bluetoothId);
  }
  /**
   * Almacena el idioma selecionado por el usuario.
   * @param lang Nombre del usuario
   */
  async setLang(lang: string): Promise<any> {
    return await this.storage.set(this.LANG, lang);
  }
  /**
   * Devuelve el idioma selecionado por el usuario.
   * @return {Promise<string>} Nombre de usuario.
   */
  async getLang(): Promise<string> {
    return await this.storage.get(this.LANG);
  }
}
