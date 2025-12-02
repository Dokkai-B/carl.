import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-[14px] text-base font-medium tracking-wide ring-offset-white transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]",
  variants: {
    variant: {
      default: "bg-gradient-to-r from-accent to-accent-hover text-primary shadow-[0_2px_6px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:brightness-110",
      primary: "bg-gradient-to-r from-primary to-primary/80 text-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]",
      outline:
        "border border-[1px] border-accent/50 bg-white/[0.03] backdrop-blur-sm text-accent hover:bg-white/[0.08] hover:border-accent",
      ghost: "hover:bg-accent/10 hover:text-accent",
      glass: "bg-white/[0.06] backdrop-blur-md border border-white/10 text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:bg-white/[0.1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
    },
    size: {
      default: "h-[44px] px-6 text-sm",
      sm: "h-[40px] px-5 text-sm",
      lg: "h-[52px] px-8 text-sm tracking-[1px]",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
