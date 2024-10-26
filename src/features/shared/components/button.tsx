import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";

export const buttonVariants = cva(
  "rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc]",
  {
    variants: {
      size: {
        sm: "px-4 text-sm h-10",
        md: "px-5 text-base h-12",
      },
    },
    defaultVariants: { size: "md" },
  }
);

interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

export const Button = ({
  onClick,
  children,
  className,
  size,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    onClick={onClick}
    className={buttonVariants({ size, className })}
  >
    {children}
  </button>
);
