import React from 'react';
import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from 'lucide-react';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-4" />,
        info: <Info className="size-4" />,
        warning: <TriangleAlert className="size-4" />,
        error: <OctagonX className="size-4" />,
        loading: <LoaderCircle className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-[#37352F] group-[.toaster]:border-neutral-200 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl',
          description: 'group-[.toast]:text-[#787774]',
          actionButton:
            'group-[.toast]:bg-[#37352F] group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-neutral-100 group-[.toast]:text-[#37352F]',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
