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

const DEFAULT_SOURCES: LeadSourceMetric[] = [
  { source: 'direct', leadCount: 38 },
  { source: 'google_organic', leadCount: 29 },
  { source: 'linkedin', leadCount: 18 },
  { source: 'github_referral', leadCount: 12 },
  { source: 'newsletter', leadCount: 7 },
];

export function TrafficSourcesPieChart({
  sources,
  className = '',
}: TrafficSourcesPieChartProps) {
  const data =
    sources && sources.length > 0
      ? sources.map((s) => ({
          name: (s.source || 'Direct').replace('_', ' ').toUpperCase(),
          value: s.leadCount,
        }))
      : DEFAULT_SOURCES.map((s) => ({
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
      </CardContent>
    </Card>
  );
}
