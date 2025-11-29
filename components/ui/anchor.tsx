import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const anchorVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-semibold transition-colors",
    {
        variants: {
            variant: {
                default: "text-accent hover:text-accent-hover",
                outline: "border border-accent text-accent px-6 py-3 hover:bg-accent hover:text-primary",
            },
            size: {
                default: "h-[44px] px-6",
                sm: "h-[48px] px-6",
                lg: "h-[56px] px-8 text-sm uppercase tracking-[2px]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Anchor = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return (
        <Comp
            className={cn(anchorVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    );
});
Anchor.displayName = "Anchor";

export { Anchor, anchorVariants };
