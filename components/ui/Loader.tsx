import { cn } from "@/lib/utils"

interface LoaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export const Loader = ({ className, size = "md" }: LoaderProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-b-2 border-[var(--purple-main)] border-t-transparent",
        sizeClasses[size],
        className
      )}
    />
  )
}
