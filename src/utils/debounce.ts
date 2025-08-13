export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
) {
  let timeoutId: NodeJS.Timeout;

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => clearTimeout(timeoutId);

  return debounced;
}