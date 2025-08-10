import { type Meta, type StoryObj } from '@storybook/react';

import { ApiKeyInput } from '@/settings/developers/components/ApiKeyInput';
import { I18nFrontDecorator } from '~/testing/decorators/I18nFrontDecorator';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';
import { ComponentDecorator } from 'twenty-ui/testing';

const meta: Meta<typeof ApiKeyInput> = {
  title: 'Modules/Settings/Developers/ApiKeys/ApiKeyInput',
  component: ApiKeyInput,
  decorators: [ComponentDecorator, SnackBarDecorator, I18nFrontDecorator],
  args: {
    apiKey:
      '***REMOVED***',
  },
};
export default meta;
type Story = StoryObj<typeof ApiKeyInput>;

export const Default: Story = {};
