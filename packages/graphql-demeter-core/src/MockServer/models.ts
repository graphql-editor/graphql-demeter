export type FakerConfiguratedField = {
  type: string;
  values?: Array<string | number>;
};

export type FakerConfig = {
  objects: Record<string, Record<string, FakerConfiguratedField>> | undefined;
  scalars: Record<string, FakerConfiguratedField> | undefined;
};
