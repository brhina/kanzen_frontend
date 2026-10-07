import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { cn } from '@/shared/utils/cn';

export interface GeoHeatmapProps {
  countries?: Array<{ country: string; count: number }>;
  className?: string;
}

const DEFAULT_COUNTRIES = [
  { country: 'United States', count: 1420 },
  { country: 'Germany', count: 680 },
  { country: 'United Kingdom', count: 540 },
  { country: 'Japan', count: 320 },
  { country: 'Canada', count: 210 },
];

export function GeoHeatmap({ countries, className = '' }: GeoHeatmapProps) {
  const data = countries && countries.length > 0 ? countries : DEFAULT_COUNTRIES;
  const maxCount = Math.max(...data.map((c) => c.count), 1);

  return (
    <Card className={cn('border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900', className)}>
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
          Geographic Demographics
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Global distribution of inbound user sessions
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3.5">
          {data.slice(0, 6).map((item, idx) => {
            const pct = Math.round((item.count / maxCount) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {item.country}
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    {item.count.toLocaleString()} sessions
                  </span>
                </div>
                <Progress value={pct} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
