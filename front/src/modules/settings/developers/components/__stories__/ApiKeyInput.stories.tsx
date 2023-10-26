import { Meta, StoryObj } from '@storybook/react';

import { ApiKeyInput } from '@/settings/developers/components/ApiKeyInput';
import { ComponentDecorator } from '~/testing/decorators/ComponentDecorator';

const meta: Meta<typeof ApiKeyInput> = {
  title: 'Pages/Settings/Developers/ApiKeys/ApiKeyInput',
  component: ApiKeyInput,
  decorators: [ComponentDecorator],
  args: {
    apiKey:
      '***REMOVED***',
  },
};
export default meta;
type Story = StoryObj<typeof ApiKeyInput>;

export const Default: Story = {};
