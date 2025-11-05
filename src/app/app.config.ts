import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {providePrimeNG} from 'primeng/config';
import {provideHttpClient} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import Nora from '@primeuix/themes/aura';
import {routes} from './app.routes';
import {provideMarkdown} from 'ngx-markdown';
import {TreeModule} from 'primeng/tree';
import {CatppuccinPreset} from './catppuccinPreset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CatppuccinPreset,
        options: {
          darkModeSelector: '.app-dark',
        },
      },
    }),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    provideMarkdown(),
    TreeModule,
  ],
};
