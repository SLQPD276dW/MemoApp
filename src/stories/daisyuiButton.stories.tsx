import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Button } from './daisyuiButton';

const meta: Meta<typeof Button> = {
  title: 'DaisyUI',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  render: () => <Button label="Daisy UI" />,
};
