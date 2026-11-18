import type { ComponentProps } from "react"

type ButtonProps = ComponentProps<"button"> & { variant?: "primary" | "secondary" | "danger" }

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  const styles = variant === "secondary" ? "btn-secondary" : [
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    variant === "danger" ? "bg-[#f9e8e1] text-[#8f2c20] hover:bg-[#f4d5c9]" : "bg-[#43532c] text-white hover:bg-[#303d20]",
  ].join(" ")
  return <button type={type} className={`${styles} ${className}`} {...props} />
}

export const buttonLink = "inline-flex items-center justify-center rounded-xl bg-[#43532c] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#303d20] focus-visible:outline-2 focus-visible:outline-offset-2"
