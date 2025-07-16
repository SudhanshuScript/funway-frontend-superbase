
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#7B61FF] text-white shadow-sm hover:bg-[#7B61FF]/90 active:translate-y-[1px]",
        destructive:
          "bg-[#FF647C] text-white hover:bg-[#FF647C]/90",
        outline:
          "border border-input bg-transparent hover:bg-accent/10 hover:text-accent-foreground",
        secondary:
          "bg-[#4F4F4F] text-white hover:bg-[#3D3D3D]",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-[#7B61FF] underline-offset-4 hover:underline",
        success: "bg-[#00C48C] text-white hover:bg-[#00C48C]/90",
        warning: "bg-[#FFA26B] text-white hover:bg-[#FFA26B]/90",
        spotBooking: "bg-[#EB1A45] text-white hover:bg-[#EB1A45]/90",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
