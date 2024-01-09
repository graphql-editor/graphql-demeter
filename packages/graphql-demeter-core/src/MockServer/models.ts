import type { faker } from '@faker-js/faker';

type FakerType = typeof faker;
type FakerFunctionKey =
  | 'address'
  | 'commerce'
  | 'company'
  | 'database'
  | 'date'
  | 'finance'
  | 'hacker'
  | 'helpers'
  | 'internet'
  | 'lorem'
  | 'name'
  | 'image'
  | 'phone'
  | 'random'
  | 'system';

type Join<Key, Previous, TKey extends number | string = string> = Key extends TKey
  ? Previous extends TKey
    ? `${Key}${'.'}${Previous}`
    : never
  : never;

type Previous = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]];

export type Paths<TEntity, TDepth extends number = 3, TKey extends number | string = string> = [TDepth] extends [never]
  ? never
  : TEntity extends object
    ? {
        [Key in keyof TEntity]-?: Key extends TKey
          ? `${Key}` | Join<Key, Paths<TEntity[Key], Previous[TDepth]>>
          : never;
      }[keyof TEntity]
    : '';

export type AllowedFakerStrings = Exclude<Paths<Pick<FakerType, FakerFunctionKey>>, FakerFunctionKey>;

export type FakerConfiguratedField =
  | {
      type: 'values';
      values: Array<string | number>;
    }
  | {
      type: 'faker';
      key: AllowedFakerStrings;
    };

export type FakerConfig = {
  objects: Record<string, Record<string, FakerConfiguratedField>> | undefined;
  scalars: Record<string, FakerConfiguratedField> | undefined;
};
