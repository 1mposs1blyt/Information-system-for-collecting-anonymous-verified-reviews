interface InputProps {
  placeholder?: string;
  w?: 'full' | 'fit';
  className?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password';
  autoComplete?: string;
}

export default function Input({
  placeholder = 'Введите текст...',
  w = 'fit',
  className = '',
  value,
  onChange,
  type = 'text',
  autoComplete,
}: InputProps) {
  const fontStyles =
    'text-white font-normal text-[15px] placeholder:text-gray-400';
  const baseStyles =
    'bg-ui-card p-2 pl-4 pt-3 pb-3` border-ui-border border-1 rounded-[10px] opacity-100 outline-none focus:border-blue-500 transition-colors';
  const width = w === 'full' ? 'w-full' : 'w-fit';
  const defaultAutoComplete =
    autoComplete !== undefined
      ? autoComplete === 'off'
        ? type === 'password'
          ? 'new-password'
          : 'one-time-code'
        : autoComplete
      : type === 'password'
        ? 'current-password'
        : 'username';

  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`${width} ${baseStyles} ${fontStyles} ${className}`}
      value={value}
      autoComplete={defaultAutoComplete}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
