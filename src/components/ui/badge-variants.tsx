
import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        vip: "border-transparent bg-yellow-500 text-yellow-50 hover:bg-yellow-500/80",
        firstTimer: "border-transparent bg-green-500 text-green-50 hover:bg-green-500/80",
        regular: "border-transparent bg-blue-500 text-blue-50 hover:bg-blue-500/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
