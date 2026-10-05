import { useCallback, useState } from 'react';

interface UseClipboardOptions {
  timeout?: number;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { timeout = 2000 } = options;
  const [hasCopied, setHasCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        setError(new Error('Clipboard API is not supported in this browser.'));
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setHasCopied(true);
        setError(null);
        setTimeout(() => setHasCopied(false), timeout);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to copy to clipboard'));
        setHasCopied(false);
        return false;
      }
    },
    [timeout],
  );

  return { hasCopied, copy, error };
}
