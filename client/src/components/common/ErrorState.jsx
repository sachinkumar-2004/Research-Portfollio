import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Unable to load content',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
}) {
  return (
    <div className="p-8 my-6 text-center border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl max-w-lg mx-auto">
      <AlertCircle className="w-8 h-8 text-rose-500 dark:text-rose-400 mx-auto mb-3" />
      <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200">{title}</h3>
      <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}
