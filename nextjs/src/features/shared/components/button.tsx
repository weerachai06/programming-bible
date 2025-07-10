import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

export const buttonVariants = cva(
  'rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc]',
  {
    variants: {
      size: {
        sm: 'px-4 text-sm h-10',
        md: 'px-5 text-base h-12',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {}

/**
 * A reusable button component with customizable styling and size variants.
 * @param props - The properties for the button component
 * @param props.onClick - Click event handler for the button
 * @param props.children - Content to be displayed inside the button
 * @param props.className - Additional CSS classes to apply to the button
 * @param props.size - Size variant for the button, can be 'sm' or 'md'
 *
 * @returns A styled button element with the provided props and styling variants
 *
 * @example
 * ```tsx
 * <Button onClick={() => console.log('Clicked!')} size="sm">
 *   Click Me
 * </Button>
 * ```
 *
 * @see {@link buttonVariants} for available styling variants
 * @see {@link VariantProps} for type definitions of the variants
 */
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
)
