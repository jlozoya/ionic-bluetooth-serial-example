## Ionic bluetooth serial

Utiliza la librería [Bluetooth Serial](https://ionicframework.com/docs/native/bluetooth-serial/), y el estilo de ionic 3.

La librería no está optimizada para conectar dos dispositivos android, para conectar android con windows [por ejemplo] es necesario establecer el puerto de entrada en windows y una consola serial que este escuchando ese puerto.

Está pensado para conectar un dispositivo android con algún otro dispositivo como arduino por mencionar uno.

Para descargar usa:

```bash
$ git clone https://github.com/jlozoya/ionic-bluetooth-serial.git
$ npm install
$ ionic cordova run android --device
```

