import { cn } from "@/lib/utils"

interface LoaderProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export const Loader = ({ className, size = "md" }: LoaderProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        className={cn(
          "inline-block animate-spin rounded-full border-purple-500/30 border-t-purple-400 border-r-fuchsia-400",
          sizeClasses[size],
          className
        )}
      />
    </div>
  )
}
