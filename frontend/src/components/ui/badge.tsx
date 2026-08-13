import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#37352F] text-white shadow-2xs hover:bg-[#201F1C]',
        secondary:
          'border-transparent bg-neutral-100 text-[#37352F] hover:bg-neutral-200/80',
        destructive:
          'border-transparent bg-rose-600 text-white shadow-2xs hover:bg-rose-700',
        outline:
          'border-neutral-200 text-[#37352F] hover:bg-neutral-100',
        amber:
          'border-amber-200/80 bg-amber-50 text-amber-800 font-mono',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
