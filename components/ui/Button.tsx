import { ButtonHTMLAttributes, forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[var(--purple-main)] to-[var(--purple-bright)] text-white shadow-[0_10px_30px_rgba(168,85,247,0.25)] hover:brightness-110 hover:shadow-[0_14px_35px_rgba(168,85,247,0.4)]",
        destructive: "bg-red-500 text-white hover:bg-red-400",
        outline: "border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] hover:border-[var(--purple-main)] hover:bg-white/5",
        secondary: "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-white/10",
        ghost: "text-[var(--text-secondary)] hover:bg-white/5 hover:text-white",
        link: "text-[var(--purple-main)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
