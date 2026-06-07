import { ReactNode } from 'react';

interface ButtonProps {
  text: string;
  w?: 'full' | 'fit';
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
  disabled?: boolean;
}

export default function Button({
  text,
  w = 'fit',
  className = '',
  onClick = () => {},
  children,
  disabled = false,
}: ButtonProps) {
  const fontStyles = disabled
    ? 'text-zinc-600 font-normal text-[15px]'
    : 'text-white font-normal text-[15px]';

  const baseStyles = disabled
    ? 'bg-zinc-950/40 p-2 pt-3 pb-3 border-zinc-800 border-1 rounded-[10px] cursor-not-allowed pointer-events-none'
    : 'bg-ui-card p-2 pt-3 pb-3 border-ui-border border-1 rounded-[10px] opacity-100 cursor-pointer';

  const hoverStyles = 'hover:text-t-main/50';
  const width = w === 'full' ? 'w-full' : 'w-fit';

  return (
    <button
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      className={`${width} ${baseStyles} ${fontStyles} ${!disabled ? `${hoverStyles} hover:scale-99` : ''} ${className}`}
    >
      {text || children}
    </button>
  );
}
