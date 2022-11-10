import React from 'react';
import type {
  ComponentStoryFn,
  ComponentMeta,
  Meta,
  Story,
} from '@storybook/react';

/* import { Button } from './Button';
 */ import { daisyuiButton } from './daisyuiButton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  // title: 'Example/daisyuiButton',
  component: daisyuiButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof daisyuiButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// const Template: ComponentStoryFn<typeof daisyuiButton> = (args) => <daisyuiButton {...args} />;

export const Daisy: Story<typeof daisyuiButton> = {
  args: {
    primary: true,
    label: 'Button',
  },
};
