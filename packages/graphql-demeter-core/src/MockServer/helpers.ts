/* eslint-disable @typescript-eslint/no-explicit-any */
import { colors } from '@/MockServer/consts';

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export function randomElementFromArray<T>(arr: Array<T>): T {
  return arr[randomNumber(0, arr.length - 1)];
}
export function isNumber(entry: string): boolean {
  return !isNaN(parseFloat(entry));
}
export function isObject(v: unknown): v is object {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
export function randomDate(): string {
  const now = new Date();
  const helper = new Date(2012, 0, 1);
  return new Date(helper.getTime() + Math.random() * (now.getTime() - helper.getTime())).toISOString();
}
export function resolveImages(name: string, width: number, height: number): string {
  return `https://source.unsplash.com/${width}x${height}/?${name}`;
}

export function traverseData(data: unknown, withLeaf: (leaf: string, path: string) => unknown, path?: string): unknown {
  path = path || '';
  if (typeof data === 'string') {
    return withLeaf(data, path);
  }
  if (isObject(data)) {
    const objectReducer = (pv: any, [key, value]: [key: string, value: any]): object => {
      pv[key] = traverseData(value, withLeaf, path + '.' + key);
      return pv;
    };
    data = Object.entries(data).reduce(objectReducer, {});
  } else if (Array.isArray(data)) {
    data = data.map((el, idx) => traverseData(el, withLeaf, path + '[' + idx.toString() + ']'));
  }
  return data;
}

const createCircle = (): string => {
  const radius = randomNumber(5, 100);
  return `<svg height="${radius * 2}" width="${radius * 2}">
        <circle cx="${radius}"
        cy="${radius}"
        r="${radius}"
        stroke="${randomElementFromArray(colors)}"
        stroke-width="${randomNumber(1, 20)}"
        fill="${randomElementFromArray(colors)}"
        />
    </svg>`.replace(/\n/g, '');
};

const createRect = (opts?: { height: number; width: number }): string => {
  const { height = randomNumber(5, 100), width = randomNumber(5, 100) } = opts || {};
  return `<svg height="${height}" width="${width}">
        <rect
        width="${width}"
        height="${height}"
        stroke="${randomElementFromArray(colors)}"
        stroke-width="${randomNumber(1, 20)}"
        fill="${randomElementFromArray(colors)}"
        />
    </svg>`.replace(/\n/g, '');
};

const createSquare = (): string => {
  const size = randomNumber(5, 100);
  return createRect({ height: size, width: size });
};

const createTriangle = (): string => {
  const height = randomNumber(5, 100);
  const width = randomNumber(5, 100);
  const points: string[] = [];

  for (let i = 0; i < 3; i++) {
    points.push(`${randomNumber(0, width)},${randomNumber(0, height)}`);
  }

  return `<svg height="${height}" width="${width}">
        <polygon
        points="${points.join(' ')}"
        stroke="${randomElementFromArray(colors)}"
        stroke-width="${randomNumber(1, 20)}"
        fill="${randomElementFromArray(colors)}"
        />
    </svg>`.replace(/\n/g, '');
};

export const randomShape = (shape: string): string => {
  switch (shape) {
    case 'circle':
      return createCircle();
    case 'square':
      return createSquare();
    case 'rectangle':
      return createRect();
    case 'triangle':
      return createTriangle();
    default:
      return randomElementFromArray([createCircle(), createSquare(), createRect(), createTriangle()]);
  }
};
