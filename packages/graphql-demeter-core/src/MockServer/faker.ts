/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomDate, randomElementFromArray, randomShape, resolveImages } from '@/MockServer/helpers';
import { faker } from '@faker-js/faker';
interface FakerMapping {
  key: string;
  value: string;
}
export function isFakerMapping(v: unknown): v is FakerMapping {
  return typeof v === 'object' && v !== null && 'key' in v && 'value' in v;
}
type mappingFunc = (...args: unknown[]) => unknown;
export type keyMapObject = {
  name: string;
  mapping: FakerMapping | mappingFunc;
};

function tryNumber(v: unknown): number | undefined {
  if (typeof v === 'number') {
    return v;
  }
  if (typeof v === 'string') {
    return parseInt(v);
  }
}

function imageAlias(...args: unknown[]): unknown {
  args.shift();
  const zeroArg = args[0] as keyof typeof faker.image;
  if (typeof args[0] === 'string' && typeof faker.image[zeroArg] !== 'undefined') {
    const fnMaybe = faker.image[zeroArg];
    if (typeof fnMaybe === 'function') {
      const argsSliced = args.slice(1) as any[];
      return (fnMaybe as any)(...argsSliced);
    }
  }
  const name = typeof args[0] === 'string' ? (args.shift() as string) : 'image';
  const w = tryNumber(args.shift()) || 200;
  const h = tryNumber(args.shift()) || 200;
  return resolveImages(name, w, h);
}

function dateAlias(...args: unknown[]): unknown {
  const zeroArg = args[0] as keyof typeof faker.date;
  if (typeof args[0] === 'string' && typeof faker.date[zeroArg] !== 'undefined') {
    const argsSliced = args.slice(1) as any[];
    return (faker.date[zeroArg] as any)(...argsSliced);
  }
  return randomDate();
}

function shapeAlias(...args: unknown[]): unknown {
  args.shift();
  const shape = typeof args[0] === 'string' ? args[0] : '';
  return randomShape(shape);
}

export const fakerExtension: keyMapObject[] = [
  {
    name: 'image',
    mapping: {
      value: 'image',
      key: 'image',
    },
  },
  {
    name: 'gender',
    mapping: {
      value: 'gender',
      key: 'gender',
    },
  },
  {
    name: 'shape',
    mapping: shapeAlias,
  },
  {
    name: 'shape.circle',
    mapping: shapeAlias,
  },
  {
    name: 'shape.square',
    mapping: shapeAlias,
  },
  {
    name: 'shape.triangle',
    mapping: shapeAlias,
  },
  {
    name: 'shape.rectangle',
    mapping: shapeAlias,
  },
  {
    name: 'image',
    mapping: imageAlias,
  },
  {
    name: 'photo',
    mapping: imageAlias,
  },
  {
    name: 'picture',
    mapping: imageAlias,
  },
  {
    name: 'gender',
    mapping: (): unknown => randomElementFromArray(['male', 'female', 'unset']),
  },
  {
    name: 'date',
    mapping: dateAlias,
  },
];
