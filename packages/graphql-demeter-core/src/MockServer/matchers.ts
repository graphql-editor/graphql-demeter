// Additional matchers for fakerjs used for better field nam to faker field match

import { AllowedFakerStrings } from '@/MockServer/models';

export const matchers: Record<string, AllowedFakerStrings> = {
  picture: 'image.image',
};
