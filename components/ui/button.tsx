import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold tracking-tight whitespace-nowrap outline-none select-none transition-[color,box-shadow,transform,background-color,border-color] duration-200 ease-out motion-reduce:transition-none motion-reduce:active:translate-y-0 motion-reduce:hover:translate-y-0 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/45 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-1 ring-inset ring-white/15 [a]:hover:bg-primary/92 hover:-translate-y-px hover:shadow-lg hover:shadow-primary/35 active:translate-y-0 active:shadow-md dark:ring-white/10",
        outline:
          "border-2 border-border/90 bg-background/90 text-foreground shadow-sm backdrop-blur-sm hover:border-primary/35 hover:bg-primary/[0.06] hover:text-primary hover:shadow-md aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input/80 dark:bg-input/25 dark:hover:border-primary/40 dark:hover:bg-primary/10",
        secondary:
          "border border-border/70 bg-secondary text-secondary-foreground shadow-sm hover:border-border hover:bg-secondary/90 hover:shadow-md aria-expanded:bg-secondary aria-expanded:text-secondary-foreground dark:bg-secondary/80",
        ghost:
          "text-foreground hover:bg-muted/90 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/60",
        destructive:
          "border border-destructive/20 bg-destructive/10 text-destructive shadow-sm hover:border-destructive/30 hover:bg-destructive/16 hover:shadow-md focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:border-destructive/30 dark:bg-destructive/18 dark:hover:bg-destructive/26 dark:focus-visible:ring-destructive/40",
        link: "rounded-none border-0 text-primary underline-offset-4 shadow-none ring-0 hover:translate-y-0 hover:underline focus-visible:ring-2 focus-visible:ring-ring/50 active:translate-y-0",
      },
      size: {
        default:
          "min-h-10 gap-2 px-4 py-2 has-data-[icon=inline-end]:pe-3.5 has-data-[icon=inline-start]:ps-3.5",
        xs: "min-h-7 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-8 gap-1.5 rounded-[min(var(--radius-md),12px)] px-3 text-[0.8125rem] leading-none in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "min-h-11 gap-2 rounded-2xl px-6 text-base has-data-[icon=inline-end]:pe-5 has-data-[icon=inline-start]:ps-5",
        icon: "size-10 [&_svg:not([class*='size-'])]:size-[1.125rem]",
        "icon-xs":
          "size-7 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-11 rounded-2xl [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        variant: "link",
        class:
          "h-auto min-h-0 gap-0 p-0 py-0 text-sm font-medium underline-offset-4 hover:bg-transparent dark:hover:bg-transparent",
      },
    ],
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
