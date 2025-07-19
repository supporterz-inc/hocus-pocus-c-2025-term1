import type { Config } from 'tailwindcss';

export default {
  theme: {
    borderRadius: {
      '0': '0px',
      '4': '4px',
      '8': '8px',
      full: '9999px',
    },
    colors: {
      black: '#000000',
      blue: {
        '100': '#D7EDFF',
        '500': '#0077D3',
      },
      gray: {
        '100': '#F6F6F6',
        '200': '#E9E9E9',
        '300': '#CFCFCF',
        '400': '#B3B3B3',
        '500': '#828282',
        '600': '#606060',
        '700': '#555555',
        '800': '#333333',
        '900': '#222222',
      },
      green: {
        '100': '#A2FCBA',
        '500': '#00C541',
      },
      red: {
        '100': '#FDDDDD',
        '500': '#F55151',
      },
      white: '#FFFFFF',
      yellow: {
        '100': '#FFFABC',
        '500': '#F8820D',
      },
    },
    fontSize: {
      '8': '8px',
      '10': '10px',
      '12': '12px',
      '14': '14px',
      '16': '16px',
      '18': '18px',
      '20': '20px',
      '32': '32px',
    },
    spacing: {
      '3xs': '4px',
      '2xs': '8px',
      xs: '12px',
      s: '16px',
      m: '20px',
      l: '24px',
      xl: '32px',
      '2xl': '40px',
      '3xl': '80px',
    },
  },
} satisfies Config;
