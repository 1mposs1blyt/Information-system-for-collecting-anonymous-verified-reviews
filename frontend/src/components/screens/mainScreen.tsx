import { useEffect, useState } from 'react';
import Button from '../small/button/button';
import Card from '../small/card/card';
import UserScreen from './UserScreen';
import AdminScreen from './AdminScreen';

interface User {
  username: string;
  token?: string;
}

interface MainScreenProps {
  UUID: string | null;
  screen: 'main' | 'sender' | 'recipient';
  setScreen: (value: 'main' | 'sender' | 'recipient') => void;
  setUUID: (value: string | null) => void;
  user: User | null;
  setAuthToken: (value: string | null) => void;
}

export default function MainScreen({
  UUID,
  screen,
  setScreen,
  setUUID,
  user,
  setAuthToken,
}: MainScreenProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 920); // 768px — брейкпоинт md в Tailwind
    };

    handleResize(); // Проверяем при инициализации
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  if (UUID != null) {
    return (
      <UserScreen
        UUIDCODE={UUID}
        screen={screen}
        setScreen={setScreen}
        UUID={UUID}
        setUUID={setUUID}
      />
    );
  }
  if (screen === 'sender') {
    return (
      <UserScreen
        screen={screen}
        setScreen={setScreen}
        UUIDCODE={UUID}
        UUID={UUID}
        setUUID={setUUID}
      />
    );
  }
  if (screen === 'recipient') {
    // Прокидываем переданные сверху пропсы внутрь AdminScreen
    return (
      <AdminScreen
        screen={screen}
        setScreen={setScreen}
        user={user}
        setAuthToken={setAuthToken}
      />
    );
  }
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto overflow-x-hidden select-none text-white relative">
      <div className="flex flex-col items-center justify-center w-full gap-5">
        <Card className="w-full max-w-md">
          <h1 className="mb-3 leading-relaxed">В чем разница?</h1>
          <ListElem
            num="1"
            title="Отправитель"
            text="Может отправлять анонимные отзывы любому получателю зная UUID-код или ссылку"
          />
          <ListElem
            num="2"
            title="Получатель"
            text="Может создать UUID-код или ссылку и получать анонимные отзывы от отправителя. Для ПК-версии сайта"
          />
        </Card>
        <Card className="w-full max-w-2xl">
          <h1 className="mb-3 leading-relaxed">Выбор типа?</h1>
          <p className="text-t-muted text-xs mb-4">
            Выберите отправителя или получателя
          </p>
          <div className="flex flex-row justify-between items-center gap-4 w-full">
            <Button
              text={'Войти как отправитель'}
              onClick={() => setScreen('sender')}
            ></Button>
            <Button
              disabled={isMobile}
              className="pointer-events-none opacity-40 cursor-not-allowed md:pointer-events-auto md:opacity-100 md:cursor-pointer"
              text={'Войти как получатель'}
              onClick={() => setScreen('recipient')}
            ></Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface ListElemProps {
  num: string;
  title: string;
  text: string;
}

const ListElem = ({ num, title, text }: ListElemProps) => {
  return (
    <div className="mb-3 flex items-start">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-transparent border-ui-border border-2 font-bold text-white">
        {num}
      </div>
      <div className="ml-2">
        <h5 className="text-t-main text-md leading-tight">{title}</h5>
        <p className="text-t-muted text-xs leading-tight">{text}</p>
      </div>
    </div>
  );
};
