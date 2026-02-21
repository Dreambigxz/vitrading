
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, RouteReuseStrategy, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/app.routes';
import { CustomReuseStrategy } from './app/reuseables/custom-reuse-strategy';
import { appConfig } from './app/app.config';
import { isDevMode, importProvidersFrom } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { NgOptimizedImage } from '@angular/common';
import { CurrencyConverterPipe } from './app/reuseables/pipes/currency-converter.pipe';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { provideIonicAngular } from '@ionic/angular/standalone';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },

  provideIonicAngular(),

    // ✅ Needed for NgOptimizedImage
    provideHttpClient(),

    // ✅ Register NgOptimizedImage
    importProvidersFrom(NgOptimizedImage),

    CurrencyConverterPipe,

    // 🔥 Service Worker
    provideServiceWorker('combined-sw.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    // ✅ Register combined service worker manually

    provideCharts(withDefaultRegisterables())


  ]
}).catch((err) => console.error(err));
