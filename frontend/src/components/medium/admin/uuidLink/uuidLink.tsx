import Card from '../../../small/card/card';

interface ReviewProps {
  clicks: string;
  UUID: string;
  date: string;
  isActive: string;
  UUIDScreen?: boolean;
}

export default function UUIDLink({
  clicks,
  UUID,
  date,
  isActive,
  UUIDScreen,
}: ReviewProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(UUID);
  };

  return (
    <Card className="p-4! text-sm leading-loose mb-3">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col justify-between">
          <p className="text-t-main font-mono">{UUID}</p>
          <p className="text-t-muted">Создана: {date}</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-col justify-between text-t-muted text-end">
            <p
              className={isActive === 'Активна' ? 'text-t-green' : 'text-t-red'}
            >
              {isActive}
            </p>
            <p>Переходов: {clicks}</p>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-zinc-800 rounded-lg text-t-muted hover:text-white transition-colors cursor-pointer"
            title="Скопировать UUID"
          >
            <svg
              xmlns="http://w3.org"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          </button>
          {UUIDScreen ? (
            <>
              <button
                onClick={() => {}}
                className="p-2 hover:bg-zinc-800 rounded-lg text-t-muted hover:text-white transition-colors cursor-pointer"
                title={isActive === 'Активна' ? 'Остановить' : 'Запустить'}
              >
                {isActive === 'Активна' ? (
                  <svg
                    xmlns="http://w3.org"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <rect width="6" height="6" x="9" y="9" rx="1" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://w3.org"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon
                      points="10 8 16 12 10 16 10 8"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={() => {}}
                className="p-2 hover:bg-zinc-800 rounded-lg text-t-muted hover:text-white transition-colors cursor-pointer"
                title="Удалить"
              >
                <svg
                  xmlns="http://w3.org"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="14" y2="15" />
                  <line x1="14" y1="11" x2="10" y2="15" />
                </svg>
              </button>
            </>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
