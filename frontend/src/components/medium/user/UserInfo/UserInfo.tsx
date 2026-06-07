import Card from '../../../small/card/card';

interface Props {
  className?: string;
}
export default function UserInfo({ className = '' }: Props) {
  return (
    <Card className={className}>
      <h1 className="mb-3 leading-relaxed">Как это работает?</h1>
      <ListElem
        num="1"
        title="Получите UUID-код"
        text="Получатель предоставляет вам уникальный код доступа"
      />
      <ListElem
        num="2"
        title="Напшите отзыв"
        text="Поделитесь честным мнением абсолютно анонимно"
      />
      <ListElem
        num="3"
        title="Отправьте сообщение"
        text="Мы доставим ваш отзыва получателю абсолютно безопасно"
      />
    </Card>
  );
}
interface ListElemProps {
  num: string;
  title: string;
  text: string;
}
const ListElem = ({ num, title, text }: ListElemProps) => {
  return (
    <div className="mb-3 flex ">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent border-ui-border border-2 font-bold text-white">
        {num}
      </div>
      <div className="ml-2">
        <h5 className="text-t-main text-md leading-tight">{title}</h5>
        <p className="text-t-muted text-xs leading-tight">{text}</p>
      </div>
    </div>
  );
};
