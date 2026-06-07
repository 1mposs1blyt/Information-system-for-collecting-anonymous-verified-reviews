import { useEffect, useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';
import Card from '../../../small/card/card';
import { API_BASE_URL } from '../../../../utils/api';

interface FeedbackData {
  id?: string | number;
  text?: string;
  box_uuid?: string;
  created_at?: string; // Используем это поле для группировки
  is_moderated?: boolean; // Предполагаем поле статуса
}

type PeriodType = '7 дней' | '14 дней' | '30 дней' | 'Всё время';

export default function ActivityChart() {
  const [days, setDays] = useState<PeriodType>('7 дней');
  const [isOpen, setIsOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/my-feedbacks`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFeedbacks(data.feedbacks || []);
        }
      } catch (error) {
        console.error('Ошибка при получении данных для графика:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  // Вычисляем данные для графика на основе полученных отзывов
  const currentData = useMemo(() => {
    if (feedbacks.length === 0) {
      // Возвращаем пустую линию-заглушку, если отзывов еще нет в базе
      return [{ day: 'Нет данных', total: 0, moderated: 0, blocked: 0 }];
    }

    const now = new Date();

    // Хелпер для обнуления часов (работаем только с датами)
    const cloneDateWithoutTime = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());

    // Функция генерации пустых точек для ровного шага осей
    const generateEmptyDays = (count: number) => {
      const result = [];
      for (let i = count - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dayLabel = d.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'short',
        });
        result.push({
          dateKey: cloneDateWithoutTime(d).getTime(),
          day: dayLabel,
          total: 0,
          moderated: 0,
          blocked: 0,
        });
      }
      return result;
    };

    if (days === '7 дней') {
      const base = generateEmptyDays(7);
      feedbacks.forEach((item) => {
        if (!item.created_at) return;
        const fDate = cloneDateWithoutTime(new Date(item.created_at)).getTime();
        const point = base.find((p) => p.dateKey === fDate);
        if (point) {
          point.total += 1;
          if (item.is_moderated !== false) point.moderated += 1;
          else point.blocked += 1;
        }
      });
      return base;
    }

    if (days === '14 дней') {
      const base = generateEmptyDays(14);
      feedbacks.forEach((item) => {
        if (!item.created_at) return;
        const fDate = cloneDateWithoutTime(new Date(item.created_at)).getTime();
        const point = base.find((p) => p.dateKey === fDate);
        if (point) {
          point.total += 1;
          if (item.is_moderated !== false) point.moderated += 1;
          else point.blocked += 1;
        }
      });
      // Для 14 дней прореживаем подписи через одну, чтобы они не слипались
      return base.map((p, idx) => ({ ...p, day: idx % 2 === 0 ? p.day : '' }));
    }

    if (days === '30 дней') {
      const base = generateEmptyDays(30);
      feedbacks.forEach((item) => {
        if (!item.created_at) return;
        const fDate = cloneDateWithoutTime(new Date(item.created_at)).getTime();
        const point = base.find((p) => p.dateKey === fDate);
        if (point) {
          point.total += 1;
          if (item.is_moderated !== false) point.moderated += 1;
          else point.blocked += 1;
        }
      });
      // Оставляем подписи только для каждой 5-й точки
      return base.map((p, idx) => ({ ...p, day: idx % 5 === 0 ? p.day : '' }));
    }

    if (days === 'Всё время') {
      // Группируем по месяцам текущего года
      const months = [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
      ];
      const base = months.map((m, idx) => ({
        monthIdx: idx,
        day: m,
        total: 0,
        moderated: 0,
        blocked: 0,
      }));

      feedbacks.forEach((item) => {
        if (!item.created_at) return;
        const fDate = new Date(item.created_at);
        const point = base.find((p) => p.monthIdx === fDate.getMonth());
        if (point) {
          point.total += 1;
          if (item.is_moderated !== false) point.moderated += 1;
          else point.blocked += 1;
        }
      });
      return base;
    }

    return [];
  }, [feedbacks, days]);

  return (
    <Card className="h-full flex flex-col justify-between p-6!">
      <div className="flex flex-row justify-between items-center mb-2">
        <h2 className="text-[17px] font-normal">Динамика активности</h2>
        <div className="relative">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-ui-border rounded-lg text-sm text-t-main bg-zinc-950/30 cursor-pointer hover:bg-zinc-950/60 transition-colors select-none"
          >
            <span>{days}</span>
            <svg
              className={`w-3 h-3 text-t-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {isOpen && (
            <div className="absolute right-0 mt-1.5 w-32 bg-zinc-900 border border-ui-border rounded-lg shadow-xl z-50 overflow-hidden py-1">
              {PERIODS.map((period) => (
                <div
                  key={period}
                  onClick={() => {
                    setDays(period);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-sm text-left cursor-pointer transition-colors
										${period === days ? 'text-t-blue bg-zinc-800/40 font-medium' : 'text-t-main hover:bg-zinc-800'}`}
                >
                  {period}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row justify-center gap-6 text-xs text-t-muted mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-t-blue rounded-full"></span>
          <span>Всего отзывов</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-t-green rounded-full"></span>
          <span>Прошли модерацию</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-t-red rounded-full"></span>
          <span>Заблокировано</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 text-[11px] text-t-muted **:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={currentData}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#1e1e24"
              strokeDasharray="0"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              stroke="#52525b"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#52525b"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />

            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: '#09090b',
                borderColor: '#1e1e24',
                borderRadius: '8px',
                color: '#fff',
              }}
              itemStyle={{ color: '#fff' }}
            />

            <Line
              type="linear"
              dataKey="total"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ fill: '#fff', stroke: '#4f46e5', strokeWidth: 2, r: 4 }}
              activeDot={false}
            />

            <Line
              type="linear"
              dataKey="moderated"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#fff', stroke: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={false}
            />

            <Line
              type="linear"
              dataKey="blocked"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#fff', stroke: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

const PERIODS = ['7 дней', '14 дней', '30 дней', 'Всё время'] as const;
