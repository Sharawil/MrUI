import { forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-[length:200%_auto] text-white shadow-[0_10px_30px_-5px_rgba(168,85,247,0.4)] hover:bg-[position:right_center] hover:shadow-[0_15px_35px_-5px_rgba(217,70,239,0.5)] border border-purple-400/30",
        destructive: "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20",
        outline:
          "border border-white/10 bg-white/[0.03] text-slate-200 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-white backdrop-blur-md",
        secondary:
          "bg-slate-900/80 border border-slate-800 text-slate-200 hover:bg-slate-800/80 hover:text-white hover:border-slate-700",
        ghost: "text-slate-400 hover:bg-white/[0.05] hover:text-white",
        link: "text-purple-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
