/**
 * Utility for conditionally joining class names together.
 * Similar to the `clsx` or `classnames` library.
 *
 * @example
 * cn("base", isActive && "active", isDisabled && "disabled")
 * // => "base active" (if isActive is true, isDisabled is false)
 */
export function cn(
  ...args: (string | undefined | null | false | Record<string, boolean>)[]
): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === "string") {
      classes.push(arg);
    } else if (typeof arg === "object") {
      for (const [key, value] of Object.entries(arg)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}
