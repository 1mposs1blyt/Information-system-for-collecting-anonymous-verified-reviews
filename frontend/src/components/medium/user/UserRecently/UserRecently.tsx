import Card from '../../../small/card/card';

interface Props {
  className: string;
}
export default function UserRecentlyActions({ className }: Props) {
  return (
    <Card className={className}>
      <h1 className="text-t-main leading-relaxed">Недавняя активность</h1>
    </Card>
  );
}
``;
