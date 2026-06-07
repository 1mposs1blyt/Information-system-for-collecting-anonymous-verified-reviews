import { useState, ChangeEvent } from 'react';
import Button from '../../../small/button/button';
import Card from '../../../small/card/card';
import Input from '../../../small/input/input';
import { API_BASE_URL } from '../../../../utils/api';
interface Props {
  className?: string;
  UUIDCODE: string | null;
  onBack?: () => void;
  setUUID: (value: string | null) => void;
}
const clearUuidParam = () => {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete('uuid');
  const newQueryString = urlParams.toString();
  const newRelativePath =
    window.location.pathname + (newQueryString ? `?${newQueryString}` : '');
  window.history.replaceState(null, '', newRelativePath);
};
export default function UserReview({
  className,
  onBack,
  UUIDCODE,
  setUUID,
}: Props) {
  const [text, setText] = useState<string>('');
  const [textTheme, setTextTheme] = useState<string>('');
  const maxChars = 460;
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxChars) {
      setText(e.target.value);
    }
  };
  return (
    <Card
      className={`relative w-full p-5 md:p-6 text-sm leading-normal ${className}`}
    >
      {onBack && (
        <button
          onClick={() => {
            onBack();
            clearUuidParam();
          }}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 border border-ui-border rounded-lg text-xs text-t-muted hover:text-white hover:bg-zinc-900 transition-all cursor-pointer select-none"
          title="Вернуться назад"
        >
          <svg
            xmlns="http://w3.org"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Назад</span>
        </button>
      )}

      <div className="pr-16">
        <h1 className="text-lg md:text-xl font-medium text-t-main leading-tight mb-1">
          Оставьте анонимный отзыв
        </h1>
        <p className="text-t-muted text-xs mb-5">
          Ваша анонимность под защитой
        </p>
      </div>
      <label className="block mb-1.5 text-xs md:text-sm font-medium text-t-main">
        Тема отзыва
        <span className="text-t-muted font-normal">(необязательно)</span>
      </label>
      <Input
        autoComplete="off"
        value={textTheme}
        onChange={setTextTheme}
        w="full"
        placeholder="Укажите тему обращения..."
      />
      <label className="block mt-4 mb-1.5 text-xs md:text-sm font-medium text-t-main">
        Ваш отзыв
      </label>
      <div className="relative w-full">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Поделитесь вашим мнением..."
          className="w-full pl-4 pr-4 pt-3 pb-8 h-32 md:h-40 bg-ui-card text-white placeholder-t-muted border border-ui-border rounded-[10px] resize-none focus:outline-none focus:border-ui-border-active transition-colors text-sm leading-relaxed"
        />
        <span className="absolute bottom-2.5 right-4 text-[11px] font-mono text-t-muted select-none">
          {text.length.toLocaleString('en-US')} / {maxChars}
        </span>
      </div>
      <div className="mb-3 flex flex-row justify-between items-center mt-5 gap-3">
        <Button
          text="Очистить"
          w="fit"
          onClick={() => {
            setText('');
            setTextTheme('');
          }}
          className="text-xs md:text-sm px-4"
        />
        <Button
          text="Отправить анонимно"
          w="fit"
          className="text-xs md:text-sm px-4 bg-brand-primary"
          onClick={async () => {
            const feefdbackText = `${textTheme}\n${text}`;
            const res = await sendFeedback(UUIDCODE, feefdbackText);
            console.log(res);
            if (res.id != null || undefined) {
              setSuccess(`Ваш отзыв по теме '${textTheme}' отправлен успешно!`);
              setTimeout(() => {
                setSuccess('');
                setUUID(null);
              }, 5000);
            } else {
              setError(res);
              setTimeout(() => {
                setError('');
              }, 5000);
            }
          }}
        />
      </div>
      {error ? <p className="text-t-red text-center">{error}</p> : ''}
      {success ? <p className="text-t-green text-center">{success}</p> : ''}
    </Card>
  );
}
const sendFeedback = async (uuid: string | null, text: string) => {
  try {
    if (uuid == null) throw new Error('UUID код не заполнен!');
    const response = await fetch(`${API_BASE_URL}/box/${uuid}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
      }),
    });
    if (response.status === 404) {
      return 'Неверный UUID код! Получатель не найден. Попробуйте другой UUID!';
    }
    if (!response.ok) {
      const errorData = await response.json();
      return errorData.detail || 'Ошибка при отправке отзыва';
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при отправке запроса:', error);
    return error;
  }
};
