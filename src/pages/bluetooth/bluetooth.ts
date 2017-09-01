import { Component } from '@angular/core';
import { IonicPage, Platform, ToastController, AlertController, Refresher } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Observable } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";

/** 
 * Esta clase maneja la conectividad bluetooth
 * @author Juan Lozoya <jlozoya1995@gmail.com>
 * @see [Bluetooth Serial](https://ionicframework.com/docs/native/bluetooth-serial/)
 */
@IonicPage({
  name: 'BluetoothPage',
  priority: 'high'
})
@Component({
  selector: 'bluetooth-page',
  templateUrl: 'bluetooth.html'
})
export class BluetoothPage {

  li_devices: Array<any> = [];
  loading: any;
  mostrarSpiner = true;
  private conexion: ISubscription;
  private conexionMensajes: ISubscription;
  private reader: Observable<any>;
  bluetoothSerial;
  constructor(
  public platform: Platform, 
  public toastCtrl: ToastController,
  public alertCtrl: AlertController) {
    this.bluetoothSerial = new BluetoothSerial();
  }
  /**
   * Al entrar en la ventana ejecuta la función para buscar dispositivos bluetooth.
   */
  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.buscar_bluetooth().then((successMessage: Array<Object>) => {
        this.li_devices = successMessage;
        this.mostrarSpiner = false;
      },
      failureMessage => {
        const toast = this.toastCtrl.create({
          message: JSON.stringify(failureMessage),
          duration: 3000
        });
        toast.present();
        this.mostrarSpiner = false;
      });
    });
  }
  /**
   * Al cerrar la aplicación se asegura de que se cierre la conexión bluetooth.
   */
  public ngOnDestroy() {
    this.desconectar();
  }
  /**
   * Busca los dispositivos bluetooth disponibles, evalúa si es posible usar la funcionalidad
   * bluetooth en el dispositivo.
   * @return {Promise<Object>} Regresa una lista de los dispositivos que se localizaron.
   */
  buscar_bluetooth() {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isEnabled().then(success =>{
        this.bluetoothSerial.discoverUnpaired().then(success => {
          if (success.length > 0) {
            resolve(success);
          } else {
            reject('No se encontraron dispositivos');
          }
        }).catch((error) => {
          console.log(`Error: ${JSON.stringify(error)}`);
          reject('Bluetooth no disponible en esta plataforma');
        });
      }, fail => {
        console.log(`Error: ${JSON.stringify(fail)}`);
        reject('El bluetooth no está disponible o está apagado');
      });
    });
  }
  /**
   * Busca los dispositivos bluetooth dispositivos al arrastrar la pantalla hacia abajo.
   * @param refresher 
   */
  refresh_bluetooth(refresher: Refresher) {
    if (refresher) {
      this.buscar_bluetooth().then((successMessage: Array<Object>) => {
        this.li_devices = [];
        this.li_devices = successMessage;
        refresher.complete();
      }, fail => {
        const toast = this.toastCtrl.create({
          message: JSON.stringify(fail),
          duration: 3000
        });
        toast.present();
        refresher.complete();
      });
    }
  }
  /**
   * Verifica si ya se encuentra conectado a un dispositivo bluetooth o no.
   * @param seleccion Son los datos del elemento seleccionado  de la lista
   */
  revisar_conexion(seleccion) {
    this.bluetoothSerial.isConnected().then(
      isConnected => {
        let alert = this.alertCtrl.create({
          title: 'Reconectar',
          message: '¿Desea reconectarse a este dispositivo?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Aceptar',
              handler: () => {
                this.desconectar();
              }
            }
          ]
        });
        alert.present();
      }, notConnected => {
        let alert = this.alertCtrl.create({
          title: 'Conectar',
          message: '¿Desea conectar el dispositivo?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Aceptar',
              handler: () => {
                this.conectar(seleccion["id"]);
              }
            }
          ]
        });
        alert.present();
    });
  }
  /**
   * Se conceta a un dispostitivo bluetooth por su id.
   * @param id Es la id del dispositivo al que se desea conectarse
   * @return {Promise<any>} Regresa un mensaje para indicar si se conectó exitosamente o no.
   */
  conectar(id: string) {
    return new Promise((resolve, reject) => {
      this.conexion = this.bluetoothSerial.connect(id).subscribe((data: Observable<any>) => {
        this.dataInOut("OK");
        resolve("conectado");
      }, fail => {
        reject("no se logro conectar");
      });
    });
  }
  /**
   * Cierra el socket para la conexión con un dispositivo bluetooth.
   */
  desconectar() {
    if (this.conexion){
      this.conexion.unsubscribe();
    }
  }
  mensaje: string = "";
  /**
   * Permite enviar mensajes de texto vía serial al conectarse por bluetooth.
   */
  enviarMensajes() {
    this.conexionMensajes = this.dataInOut(this.mensaje).subscribe(data => {
      console.log(data);
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
  public dataInOut(message: string) {
    return Observable.create(observer => {
      this.bluetoothSerial.isConnected().then(isConnected => {
        this.reader = Observable.fromPromise(this.bluetoothSerial.write(message))
          .flatMap(() => {
            return this.bluetoothSerial.subscribeRawData()
          })
          .flatMap(() => {
            return this.bluetoothSerial.readUntil('\n');   // <= delimitador
          });
        this.reader.subscribe(data => {
          observer.next(data);
        });
      }, notConected => {
        observer.next("No estas conectado a ningun dispositivo bluetooth");
        observer.complete();
      });
    });
  }
}
