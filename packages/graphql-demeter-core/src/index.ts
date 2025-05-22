import { FieldType, Options, Parser, ScalarTypes, TypeDefinition, getTypeName } from 'graphql-js-tree';
import { fakeValue } from '@/MockServer/render';
import { FakerConfig } from '@/MockServer/models';
import { faker } from '@faker-js/faker';
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
  const scalars = tree.nodes.filter((n) => n.data.type === TypeDefinition.ScalarTypeDefinition).map((n) => n.name);
  const enums = tree.nodes.filter((n) => n.data.type === TypeDefinition.EnumTypeDefinition).map((n) => n.name);
  const alwaysRequired = fakerConfig ? fakerConfig.alwaysRequired : false;
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
                  const isEnum = enums.find((s) => s === tName);
                  if (isEnum) {
                    return mockValue(a.type.fieldType, () => {
                      const e = tree.nodes.find((tn) => tn.name === tName);
                      if (!e) {
                        console.warn(`Can't find enum "${tName} in schema returning brokenEnum"`);
                        return 'brokenEnum';
                      }
                      const possibleEnumValues = e.args.map((a) => a.name);
                      return possibleEnumValues[Math.floor(Math.random() * possibleEnumValues.length)];
                    });
                  }
                  const isCustomScalar = scalars.find((s) => s === tName);
                  const resolverValuesScalar = isCustomScalar && fakerConfig?.scalars?.[isCustomScalar];
                  const resolverValues = resolverValuesScalar || fakerConfig?.objects?.[n.name]?.[a.name];

                  const valueField = resolverValues && 'values' in resolverValues ? resolverValues : undefined;
                  if (valueField?.values.length) {
                    return mockValue(a.type.fieldType, () => {
                      if (!valueField.values.length) throw new Error('Invalid values length 0');
                      const chosenValue = Math.floor(Math.random() * valueField.values.length);
                      return valueField.values[chosenValue];
                    });
                  }
                  if ([ScalarTypes.Boolean, ScalarTypes.Float, ScalarTypes.Int].includes(tName as ScalarTypes)) {
                    return mockValue(a.type.fieldType, fakeScalar(tName), alwaysRequired);
                  }
                  if ([ScalarTypes.ID, ScalarTypes.String].includes(tName as ScalarTypes)) {
                    return mockValue(
                      a.type.fieldType,
                      () => {
                        const valueFromFaker =
                          resolverValues && 'fake' in resolverValues
                            ? fakeValue(resolverValues.fake)
                            : fakeValue(a.name);
                        if (typeof valueFromFaker !== 'string') {
                          const faked = fakeScalar(tName)();
                          if (faked === 'dupa') {
                            return faker.lorem.word();
                          }
                          return faked;
                        }
                        return valueFromFaker;
                      },
                      alwaysRequired,
                    );
                  }

                  return mockObjectValue(a.type.fieldType, alwaysRequired);
                },
              ];
            }),
          ),
        ];
      }),
  );
  const interfaceResolvers = Object.fromEntries(
    tree.nodes
      .filter((n) => n.data.type === TypeDefinition.InterfaceTypeDefinition)
      .map((n) => {
        const possibleTypes = tree.nodes
          .filter((n) => n.data.type === TypeDefinition.ObjectTypeDefinition)
          .filter((tn) => !!tn.interfaces.find((tni) => tni === n.name));
        return [
          n.name,
          {
            __resolveType: () => {
              if (possibleTypes.length) {
                const chosenTypeRandomly = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
                return chosenTypeRandomly.name;
              }
              return null;
            },
          },
        ];
      }),
  );
  const unionResolvers = Object.fromEntries(
    tree.nodes
      .filter((n) => n.data.type === TypeDefinition.UnionTypeDefinition)
      .map((n) => {
        const possibleTypes = n.args.map((a) => a.name);
        return [
          n.name,
          {
            __resolveType: () => {
              if (possibleTypes.length) {
                const chosenTypeRandomly = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
                return chosenTypeRandomly;
              }
              return null;
            },
          },
        ];
      }),
  );
  return {
    ...resolvers,
    ...interfaceResolvers,
    ...unionResolvers,
  };
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
