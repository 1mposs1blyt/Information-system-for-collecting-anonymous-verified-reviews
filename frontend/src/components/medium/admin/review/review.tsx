import Card from '../../../small/card/card';

interface ReviewProps {
  title: string;
  UUID: string;
  timeAgo: string;
}

export default function Review({ title, UUID, timeAgo }: ReviewProps) {
  return (
    <Card className="p-4! text-sm leading-loose mb-3">
      <h3 className="text-t-main font-medium mb-1.5 wrap-break-word">
        {title}
      </h3>
      <div className="flex flex-row justify-between items-center text-t-muted text-xs">
        <p className="font-mono max-w-[70%] truncate" title={UUID}>
          UUID: <span className="text-t-muted">{UUID}</span>
        </p>
        <p className="shrink-0 ml-2">{timeAgo}</p>
      </div>
    </Card>
  );
}
