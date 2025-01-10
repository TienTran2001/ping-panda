import { cn } from "@/utils"
import Link from "next/link"
import { AnchorHTMLAttributes } from "react"

interface ShinyButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export const ShinyButton = ({
  className,
  children,
  href,
  ...props
}: ShinyButtonProps) => {
  return (
    <Link href={href ?? "#"} className={cn("", className)}>
      {children}
    </Link>
  )
}
