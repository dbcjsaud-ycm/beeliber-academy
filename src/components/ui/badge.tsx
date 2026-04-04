import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'outline' }) {
  const styles = {
    default: 'bg-slate-900 text-white',
    secondary: 'bg-blue-100 text-blue-700',
    outline: 'border bg-white text-slate-700',
  }[variant];

  return <div className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', styles, className)} {...props} />;
}
