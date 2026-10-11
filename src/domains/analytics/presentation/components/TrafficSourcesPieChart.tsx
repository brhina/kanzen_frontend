import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { LeadSourceMetric } from '../../domain/entities/analytics-event.entity';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/utils/cn';

export interface TrafficSourcesPieChartProps {
  sources?: LeadSourceMetric[];
  className?: string;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

export function TrafficSourcesPieChart({
  sources,
  className = '',
}: TrafficSourcesPieChartProps) {
  const data = (sources || []).map((s) => ({
    name: (s.source || 'Direct').replace('_', ' ').toUpperCase(),
    value: s.leadCount,
  }));

  return (
    <Card className={cn('border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900', className)}>
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
          Inbound Acquisition Channels
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Source distribution of leads and client inquiries
        </CardDescription>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <p className="text-xs">
              No inbound acquisition source data recorded for this period.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    color: '#f8fafc',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
