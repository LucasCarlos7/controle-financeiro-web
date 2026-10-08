import { forwardRef, type InputHTMLAttributes } from 'react';
import { Field } from './Field';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const inputClasses = (hasError: boolean, className = '') =>
  `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 ${
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10 dark:border-red-800 dark:focus:border-red-600 dark:focus:ring-red-500/10'
      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/10 dark:border-slate-700 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20'
  } ${className}`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <Field label={label} htmlFor={id} error={error}>
        <input id={id} ref={ref} className={inputClasses(Boolean(error), className)} {...props} />
      </Field>
    );
  },
);
Input.displayName = 'Input';
