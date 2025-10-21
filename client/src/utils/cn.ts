/**
 * A utility function for conditionally joining class names together
 *
 * @example
 * // Basic usage
 * cn('text-red-500', 'bg-blue-200') // => 'text-red-500 bg-blue-200'
 *
 * @example
 * // With conditional classes
 * cn('text-lg', { 'text-red-500': isError, 'text-green-500': isSuccess })
 *
 * @example
 * // With arrays
 * cn('btn', ['p-2', 'rounded'], { 'opacity-50': isDisabled })
 */
export function cn(
  ...classes: (string | boolean | null | undefined | Record<string, boolean>)[]
) {
  return classes
    .filter(Boolean)
    .flatMap((cls) => {
      if (typeof cls === 'string') {
        return cls.trim();
      } else if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key.trim());
      }

      return [];
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Merges multiple style objects together
 *
 * @example
 * // Basic usage
 * mergeStyles({ color: 'red' }, { backgroundColor: 'blue' })
 * // => { color: 'red', backgroundColor: 'blue' }
 *
 * @example
 * // With conditional styles
 * mergeStyles(
 *   { padding: '1rem' },
 *   isActive && { fontWeight: 'bold' }
 * )
 */
export function mergeStyles(
  ...styles: (Record<string, string | number> | false | null | undefined)[]
) {
  return styles.reduce<Record<string, string | number>>((acc, style) => {
    if (style && typeof style === 'object' && !Array.isArray(style)) {
      Object.assign(acc, style);
    }

    return acc;
  }, {});
}

/**
 * Creates a variant class name generator
 *
 * @example
 * const buttonVariants = createVariants({
 *   variants: {
 *     color: {
 *       primary: 'bg-blue-500 text-white',
 *       secondary: 'bg-gray-200 text-gray-800',
 *       danger: 'bg-red-500 text-white',
 *     },
 *     size: {
 *       sm: 'text-sm py-1 px-2',
 *       md: 'text-base py-2 px-4',
 *       lg: 'text-lg py-3 px-6',
 *     },
 *   },
 *   defaultVariants: {
 *     color: 'primary',
 *     size: 'md',
 *   },
 * });
 *
 * // Usage:
 * buttonVariants({ color: 'danger', size: 'lg' })
 * // => 'bg-red-500 text-white text-lg py-3 px-6'
 */
export function createVariants<
  V extends Record<string, Record<string, string>>,
  D extends { [K in keyof V]?: string },
>({ variants, defaultVariants }: { variants: V; defaultVariants?: D }) {
  return (
    props?: { [K in keyof V]?: keyof V[K] | null } & { className?: string }
  ) => {
    if (!props) props = {};

    const variantClasses: string[] = [];

    Object.keys(variants).forEach((variant) => {
      const variantKey = variant as keyof V;
      const variantValue = props?.[variantKey] || defaultVariants?.[variantKey];

      if (variantValue && typeof variantValue === 'string') {
        const variantClass =
          variants[variantKey][variantValue as keyof V[keyof V]];

        if (variantClass) {
          variantClasses.push(variantClass);
        }
      }
    });

    return cn(...variantClasses, props.className);
  };
}

/**
 * Formats a date string to a localized format
 *
 * @example
 * formatDate('2023-10-15') // => '15/10/2023' (depending on locale)
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
) {
  try {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options,
    }).format(date);
  } catch (error) {
    return dateString;
  }
}

/**
 * Formats a number with thousand separators
 *
 * @example
 * formatNumber(1000) // => '1.000' (in Vietnamese locale)
 */
export function formatNumber(num: number) {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Truncates a string if it exceeds the specified length
 *
 * @example
 * truncateString('This is a very long text', 10) // => 'This is a...'
 */
export function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) return str;

  return `${str.slice(0, maxLength)}...`;
}

/**
 * Debounces a function call
 *
 * @example
 * const debouncedSearch = debounce((query) => {
 *   // search logic here
 * }, 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generates a random ID
 *
 * @example
 * generateId() // => 'id_1a2b3c4d'
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 10)}`;
}
