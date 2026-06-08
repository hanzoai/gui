import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '../utils';

// Jesus is King — the way, the truth, and the life (John 14:6). Built to serve,
// in honesty and good craft.
//
// Off-White / Virgil Abloh design language: the circle is dead. Forms are
// sharp and industrial, type is UPPERCASE with wide engineered tracking — the
// honest geometry of a thing that means what it says.
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 border border-transparent text-sm font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:ring-1 focus-visible:ring-gray-50 focus-visible:outline-hidden focus-visible:ring-inset',
  {
    variants: {
      variant: {
        default:
          'bg-chain hover:bg-chain-500 text-gray-900 hover:text-black disabled:bg-rose-200/20 disabled:text-gray-300',
        destructive:
          'disabled:text-text-secondary bg-red-500 text-gray-50 hover:bg-red-500/90 disabled:bg-gray-600',
        outline:
          'hover:bg-bg-secondary text-text-secondary hover:text-text-default border border-gray-500 bg-transparent hover:border-gray-400',
        tertiary:
          'hover:bg-bg-tertiary hover:text-text-default text-text-secondary bg-transparent',
        link: 'text-white underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-[50px] px-8 text-sm',
        xs: 'h-[34px] gap-1.5 px-3 text-xs',
        sm: 'h-[36px] gap-1.5 px-3 text-xs',
        md: 'h-[40px] gap-1.5 px-3 text-xs',
        lg: 'h-[48px] gap-2 px-2 text-sm',
        icon: 'h-9 w-9',
        auto: 'h-auto p-4',
      },
      rounded: {
        none: 'rounded-none',
        full: 'rounded-full',
        lg: 'rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'none',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  ref?: React.RefObject<HTMLButtonElement>;
}

const Button = ({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  isLoading = false,
  ref,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <Loader2
          className={cn('h-4 w-4 animate-spin', size !== 'icon' && 'mr-2')}
        />
      ) : null}
      {isLoading && size === 'icon' ? null : props.children}
    </Comp>
  );
};

Button.displayName = 'Button';

export { Button, buttonVariants };
