# Ionic Bluetooth Serial

Ejemplo de comunicación Bluetooth Serial con Ionic 8, Angular 21 y Cordova Android 15.

## Requisitos

- Node.js 22.9 o posterior
- Ionic CLI y Cordova CLI
- Android Studio/JDK compatibles con Cordova Android 15
- Un dispositivo Android físico con Bluetooth

## Instalación y ejecución

```bash
git clone https://github.com/jlozoya/ionic-bluetooth-serial-example.git
cd ionic-bluetooth-serial-example
npm ci
ionic cordova run android --device
```

`ionic serve` sólo ejecuta la interfaz web. El plugin Bluetooth Serial depende de APIs nativas de Cordova y, por tanto, no puede descubrir, conectar ni escribir a dispositivos desde el navegador. Para probar Bluetooth se necesita compilar y ejecutar en un dispositivo Android físico.

> El plugin está orientado a periféricos Bluetooth Serial (por ejemplo, HC-05); no está diseñado para comunicar dos teléfonos Android entre sí.

## Seguridad

Las dependencias están fijadas mediante `package-lock.json`. Usa `npm ci` para instalaciones reproducibles y ejecuta `npm audit` al actualizar dependencias.
