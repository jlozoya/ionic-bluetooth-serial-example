import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StorageService } from './providers/providers';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private storage: StorageService
  ) {
    this.initTranslate();
    this.initializeApp();
  }
  /**
   * Cierra el splash screen para mostrar la aplicación.
   */
  initializeApp() {
    this.platform.ready().then(() => {
      // Native plugins are available after the platform is ready.
    });
  }
  /**
   * Establezca el idioma predeterminado para las cadenas de traducción y el idioma actual.
   */
  initTranslate() {
    this.translate.setFallbackLang('es');
    this.storage.getLang().then(lang => {
      const browserLang = this.translate.getBrowserLang();
      if (!lang && browserLang) {
        this.translate.use(browserLang);
      } else {
        this.translate.use(lang || 'es'); // Establezca su idioma aquí
      }
    });
  }
}
