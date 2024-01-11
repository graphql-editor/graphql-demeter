import { FieldType, Options, Parser, ScalarTypes, TypeDefinition, getTypeName } from 'graphql-js-tree';
import { fakeValue } from '@/MockServer/render';
import { FakerConfig } from '@/MockServer/models';
export { FakerConfig } from '@/MockServer/models';

const maxArray = 16;

const mockValue = (f: FieldType, fakeScalarFn: ReturnType<typeof fakeScalar>, required = false): unknown => {
  if (f.type === Options.name) {
    if (required) {
      return fakeScalarFn();
    }
    return Math.random() > 0.3 ? fakeScalarFn() : null;
  }
  if (f.type === Options.required) {
    return mockValue(f.nest, fakeScalarFn, true);
  }
  const arrayNumber = Math.floor(Math.random() * maxArray);
  return new Array(arrayNumber).fill(0).map(() => mockValue(f.nest, fakeScalarFn));
};
const mockObjectValue = (f: FieldType, required = false): unknown => {
  if (f.type === Options.name) {
    if (required) {
      return {};
    }
    return Math.random() > 0.3 ? {} : null;
  }
  if (f.type === Options.required) {
    return mockObjectValue(f.nest, true);
  }
  const arrayNumber = Math.floor(Math.random() * maxArray);
  return new Array(arrayNumber).fill(0).map(() => mockObjectValue(f.nest));
};

export const createFakeResolvers = (schemaString: string, fakerConfig?: FakerConfig) => {
  const tree = Parser.parse(schemaString);
  const resolvers = Object.fromEntries(
    tree.nodes
      .filter((n) => n.data.type === TypeDefinition.ObjectTypeDefinition)
      .map((n) => {
        return [
          n.name,
          Object.fromEntries(
            n.args.map((a) => {
              const tName = getTypeName(a.type.fieldType);
              return [
                a.name,
                () => {
                  const resolverValues = fakerConfig?.objects?.[n.name]?.[a.name];
                  const valueField = resolverValues && 'values' in resolverValues ? resolverValues : undefined;
                  if (valueField?.values.length) {
                    return mockValue(a.type.fieldType, () => {
                      if (!valueField.values.length) throw new Error('Invalid values length 0');
                      const chosenValue = Math.floor(Math.random() * valueField.values.length);
                      return valueField.values[chosenValue];
                    });
                  }
                  if ([ScalarTypes.Boolean, ScalarTypes.Float, ScalarTypes.Int].includes(tName as ScalarTypes)) {
                    return mockValue(a.type.fieldType, fakeScalar(tName));
                  }
                  if ([ScalarTypes.ID, ScalarTypes.String].includes(tName as ScalarTypes)) {
                    return mockValue(a.type.fieldType, () => {
                      const valueFromFaker =
                        resolverValues && 'key' in resolverValues ? fakeValue(resolverValues.key) : fakeValue(a.name);
                      if (typeof valueFromFaker !== 'string') {
                        return fakeScalar(tName)();
                      }
                      return valueFromFaker;
                    });
                  }
                  return mockObjectValue(a.type.fieldType);
                },
              ];
            }),
          ),
        ];
      }),
  );
  return resolvers;
};

const fakeScalar = (typeName: string) => () => {
  if (typeName === ScalarTypes.Boolean) {
    return Math.random() > 0.5;
  }
  if (typeName === ScalarTypes.Float) {
    return Math.random();
  }
  if (typeName === ScalarTypes.ID) {
    return Math.random().toString(8);
  }
  if (typeName === ScalarTypes.Int) {
    return Math.floor(Math.random() * 100);
  }
  if (typeName === ScalarTypes.String) {
    return 'dupa';
  }
  return 'dupa';
};
