/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from '@faker-js/faker';

import { fakerExtension, keyMapObject } from '@/MockServer/faker';
import { permittedFakerMethods } from '@/MockServer/consts';
import { compare } from '@/MockServer/levensthein';

const allKeys: keyMapObject[] = permittedFakerMethods
  .map((permKey) =>
    Object.keys(faker[permKey]).map(
      (fakerMethod): keyMapObject => ({
        name: `${permKey}.${fakerMethod}`,
        mapping: {
          key: permKey,
          value: fakerMethod,
        },
      }),
    ),
  )
  .reduce((a, b) => [...a, ...b])
  .filter((v) => ('value' in v.mapping ? v.mapping.value !== 'faker' : true))
  .concat(fakerExtension)
  .sort((a, b) => (a.name < b.name ? -1 : a.name === b.name ? 0 : 1));

export function fakeValue(data: string) {
  if (data.length <= 0) {
    return data;
  }
  const bestMatch = compare(data, allKeys);
  try {
    const [a, b] = bestMatch.split('.');
    return (faker as any)[a][b]();
  } catch (error) {
    return;
  }
  return;
}
