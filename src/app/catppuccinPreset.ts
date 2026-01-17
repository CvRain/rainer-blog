import { bootstrapApplication } from '@angular/platform-browser';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { AppComponent } from './app.component';
import { providePrimeNG } from 'primeng/config';

export const CatppuccinPreset = definePreset(Aura, {
  semantic: {
    primary: {
      light: {
        50: '#f5f5f5', // zinc-50
        100: '#e3e3e3', // zinc-100
        200: '#cfcfcf', // zinc-200
        300: '#b1b1b1', // zinc-300
        400: '#9b9b9b', // zinc-400
        500: '#7e7e7e', // zinc-500
        600: '#656565', // zinc-600
        700: '#525252', // zinc-700
        800: '#3d3d3d', // zinc-800
        900: '#18181b', // zinc-900
      },
      dark: {
        50: '#f5e0dc',
        100: '#f2cdcd',
        200: '#f5c2e7',
        300: '#cba6f7',
        400: '#b4befe',
        500: '#89b4fa',
        600: '#74c7ec',
        700: '#94e2d5',
        800: '#a6e3a1',
        900: '#f9e2af',
      },
    },
    surface: {
      light: {
        0: '#fafafa', // zinc-50
        100: '#f5f5f5', // zinc-100
        200: '#e5e5e5', // zinc-200
        300: '#d4d4d4', // zinc-300
        400: '#a1a1aa', // zinc-400
        500: '#71717a', // zinc-500
        600: '#525252',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        950: '#09090b',
      },
      dark: {
        0: '#1e1e2e',
        100: '#181825',
        200: '#11111b',
        300: '#313244',
        400: '#45475a',
        500: '#585b70',
        600: '#7f849c',
        700: '#9399b2',
        800: '#a6adc8',
        900: '#bac2de',
        950: '#cdd6f4',
      },
    },
    accent: {
      light: {
        100: '#fab387', // peach
        200: '#eba0ac', // maroon
        300: '#f38ba8', // red
      },
      dark: {
        100: '#fab387',
        200: '#eba0ac',
        300: '#f38ba8',
      },
    },
    text: {
      light: {
        DEFAULT: '#18181b', // zinc-900
        subtext0: '#3d3d3d', // zinc-800
        subtext1: '#525252', // zinc-700
      },
      dark: {
        DEFAULT: '#cdd6f4',
        subtext0: '#a6adc8',
        subtext1: '#bac2de',
      },
    },
    overlay: {
      light: {
        overlay0: '#e5e5e5',
        overlay1: '#d4d4d4',
        overlay2: '#a1a1aa',
      },
      dark: {
        overlay0: '#6c7086',
        overlay1: '#7f849c',
        overlay2: '#9399b2',
      },
    },
    link: {
      light: { DEFAULT: '#3b82f6' }, // zinc推荐蓝色
      dark: { DEFAULT: '#89b4fa' },
    },
    success: {
      light: { DEFAULT: '#22c55e' }, // zinc推荐绿色
      dark: { DEFAULT: '#a6e3a1' },
    },
    warning: {
      light: { DEFAULT: '#eab308' }, // zinc推荐黄色
      dark: { DEFAULT: '#f9e2af' },
    },
    error: {
      light: { DEFAULT: '#ef4444' }, // zinc推荐红色
      dark: { DEFAULT: '#f38ba8' },
    },
    tag: {
      light: { DEFAULT: '#71717a' }, // zinc-500
      dark: { DEFAULT: '#89b4fa' },
    },
    pill: {
      light: { DEFAULT: '#a1a1aa' }, // zinc-400
      dark: { DEFAULT: '#b4befe' },
    },
    selection: {
      light: { DEFAULT: 'rgba(161, 161, 170, 0.2)' }, // zinc-400 20% opacity
      dark: { DEFAULT: 'rgba(147, 153, 178, 0.2)' },
    },
    cursor: {
      light: { DEFAULT: '#71717a' }, // zinc-500
      dark: { DEFAULT: '#f5e0dc' },
    },
  },
});

bootstrapApplication(AppComponent, {
  providers: [
    providePrimeNG({
      theme: {
        preset: CatppuccinPreset,
      },
    }),
  ],
});
