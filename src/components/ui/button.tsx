import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'secondary';
  asChild?: boolean;
  href?: string;
};

const variants = {
  default: 'bg-slate-900 text-white hover:bg-slate-800',
  outline: 'border bg-white text-slate-900 hover:bg-slate-50',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
};

export function Button({ className, variant = 'default', asChild, children, href, ...props }: ButtonProps) {
  const styles = cn('inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition', variants[variant], className);

  if (asChild && href) {
    return <Link href={href} className={styles}>{children}</Link>;
  }

  return <button className={styles} {...props}>{children}</button>;
}
