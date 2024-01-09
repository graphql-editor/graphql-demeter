import { faker } from '@faker-js/faker';

export const colors: Array<string> = ['red', '#00ff00', 'rgb(0, 0, 255)', 'rgba(0, 255, 200, 0.5)'];

export const permittedFakerMethods: Array<keyof typeof faker> = [
  'address',
  'commerce',
  'company',
  'database',
  'date',
  'finance',
  'hacker',
  'helpers',
  'internet',
  'lorem',
  'name',
  'image',
  'phone',
  'random',
  'system',
];
