import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
    'btn disabled:btn-disabled inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                primary: 'btn-primary bg-components-button-primary-bg text-components-button-primary-text hover:bg-components-button-primary-hover',
                warning: 'btn-warning bg-state-warning-solid text-white hover:bg-yellow-600',
                secondary: 'btn-secondary border border-components-button-secondary-border bg-components-button-secondary-bg text-text-secondary hover:bg-state-base-hover',
                'secondary-accent': 'btn-secondary-accent border border-state-accent-solid text-state-accent-solid hover:bg-state-accent-active',
                ghost: 'btn-ghost hover:bg-state-base-hover text-text-secondary',
                'ghost-accent': 'btn-ghost-accent text-state-accent-solid hover:bg-state-accent-active',
                tertiary: 'btn-tertiary text-text-tertiary hover:text-text-primary',
                destructive: 'btn-destructive bg-state-destructive-solid text-white hover:bg-red-600',
            },
            size: {
                small: 'btn-small h-8 px-3 text-xs',
                medium: 'btn-medium h-9 px-4 py-2 text-sm',
                large: 'btn-large h-11 px-8 text-base',
                icon: 'h-9 w-9 p-0',
            },
        },
        defaultVariants: {
            variant: 'secondary',
            size: 'medium',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
