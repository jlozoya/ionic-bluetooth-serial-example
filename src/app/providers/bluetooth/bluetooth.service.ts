import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { StorageService } from '../storage/storage.service';
import { Observable, Subscription, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
/**
 * Esta clase maneja la conectividad bluetooth.
 *
 * @author <a href="mailto:jlozoya1995@gmail.com">Juan Lozoya</a>
 * @see [Bluetooth Serial](https://ionicframework.com/docs/native/bluetooth-serial/)
 */
@Injectable()
export class BluetoothService {

  private connection: Subscription;
  private connectionCommunication: Subscription;
  private reader: Observable<any>;

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private storage: StorageService
  ) {  }
  /**
   * Busca los dispositivos bluetooth disponibles, evalúa si es posible usar la funcionalidad
   * bluetooth en el dispositivo.
   * @return {Promise<Object>} Regresa una lista de los dispositivos que se localizaron.
   */
  searchBluetooth(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isEnabled().then(success => {
        this.bluetoothSerial.discoverUnpaired().then(response => {
          if (response.length > 0) {
            resolve(response);
          } else {
            reject('BLUETOOTH.NOT_DEVICES_FOUND');
          }
        }).catch((error) => {
          console.log(`[bluetooth.service-41] Error: ${JSON.stringify(error)}`);
          reject('BLUETOOTH.NOT_AVAILABLE_IN_THIS_DEVICE');
        });
      }, fail => {
        console.log(`[bluetooth.service-45] Error: ${JSON.stringify(fail)}`);
        reject('BLUETOOTH.NOT_AVAILABLE');
      });
    });
  }
  /**
   * Verifica si ya se encuentra conectado a un dispositivo bluetooth o no.
   */
  checkConnection() {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isConnected().then(isConnected => {
        resolve('BLUETOOTH.CONNECTED');
      }, notConnected => {
        reject('BLUETOOTH.NOT_CONNECTED');
      });
    });
  }
  /**
   * Se conceta a un dispostitivo bluetooth por su id.
   * @param id Es la id del dispositivo al que se desea conectarse
   * @return {Promise<any>} Regresa un mensaje para indicar si se conectó exitosamente o no.
   */
  deviceConnection(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.connection = this.bluetoothSerial.connect(id).subscribe(() => {
        this.storage.setBluetoothId(id);
        resolve('BLUETOOTH.CONNECTED');
      }, fail => {
        console.log(`[bluetooth.service-88] Error conexión: ${JSON.stringify(fail)}`);
        reject('BLUETOOTH.CANNOT_CONNECT');
      });
    });
  }
  /**
   * Cierra el socket para la conexión con un dispositivo bluetooth.
   * @return {Promise<boolean>}
   */
  disconnect(): Promise<boolean> {
    return new Promise((result) => {
      if (this.connectionCommunication) {
        this.connectionCommunication.unsubscribe();
      }
      if (this.connection) {
        this.connection.unsubscribe();
      }
      result(true);
    });
  }
  /**
   * Establece el socket para las comunicaciones seriales después de conectarse con un dispositivo
   * bluetooth.
   * @param message Es el texto que se desea enviar.
   * @returns {Observable<any>} Regresa el texto que llegue vía seria a través de la conexión
   * bluetooth al dispositivo, en caso de no existir una conexión regresa un mensaje indicando que:
   * _No estas conectado a ningún dispositivo bluetooth_.
   */
  dataInOut(message: string): Observable<any> {
    return Observable.create(observer => {
      this.bluetoothSerial.isConnected().then((isConnected) => {
        this.reader = from(this.bluetoothSerial.write(message)).pipe(mergeMap(() => {
            return this.bluetoothSerial.subscribeRawData();
          })).pipe(mergeMap(() => {
            return this.bluetoothSerial.readUntil('\n');   // <= delimitador
          }));
        this.reader.subscribe(data => {
          observer.next(data);
        });
      }, notConected => {
        observer.next('BLUETOOTH.NOT_CONNECTED');
        observer.complete();
      });
    });
  }
  /**
   * Es un método que se puede llamar desde otras partes del código para intentar conectar con la
   * id del ultimo dispositivo bluetooth al que se allá conectado.
   * @return {Promise<any>} Regresa un mensaje para indicar si se conectó exitosamente o no.
   */
  storedConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.getBluetoothId().then(bluetoothId => {
        console.log(`[bluetooth.service-129] ${bluetoothId}`);
        this.deviceConnection(bluetoothId).then(success => {
          resolve(success);
        }, fail => {
          reject(fail);
        });
      });
    });
  }
}
