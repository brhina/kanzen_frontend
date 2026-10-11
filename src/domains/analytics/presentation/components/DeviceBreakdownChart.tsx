import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/utils/cn';

export interface DeviceBreakdownChartProps {
  devices?: Array<{ device: string; count: number; percentage: number }>;
  className?: string;
}

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'];

export function DeviceBreakdownChart({
  devices,
  className = '',
}: DeviceBreakdownChartProps) {
  const data = (devices || []).map((d) => ({
    device: (d.device || 'Desktop').toUpperCase(),
    count: d.count,
    percentage: d.percentage,
  }));

  return (
    <Card className={cn('border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900', className)}>
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
          Client Device Footprint
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Hardware and browser categories accessing the application
        </CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <p className="text-xs">
              No client device metrics recorded for this period.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis
                  dataKey="device"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any) => [`${val} visitors`, 'Volume']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.map((_, index) => (
                    <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
