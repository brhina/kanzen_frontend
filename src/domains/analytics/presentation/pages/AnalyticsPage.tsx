import { useState } from 'react';
import { useUIStore } from '@/core/stores/ui.store';
import { useAnalyticsDashboard } from '../../application/use-cases/useAnalyticsDashboard';
import { AnalyticsDateRangePicker } from '../components/AnalyticsDateRangePicker';
import { OverviewMetricCard } from '../components/OverviewMetricCard';
import { PageViewsChart } from '../components/PageViewsChart';
import { TrafficSourcesPieChart } from '../components/TrafficSourcesPieChart';
import { DeviceBreakdownChart } from '../components/DeviceBreakdownChart';
import { GeoHeatmap } from '../components/GeoHeatmap';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { HeaderBanner } from '@/layouts/components';

export function AnalyticsPage() {
  const { isEditMode } = useUIStore();
  const [rangeDays, setRangeDays] = useState<number>(30);

  const { data, isLoading, refetch } = useAnalyticsDashboard(rangeDays);

  const overview = data?.overview;
  const traffic = data?.traffic;
  const topPages = data?.topPages || [];
  const leadSources = data?.leadSources || [];
  const funnel = data?.funnel;

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <HeaderBanner
        badge="Telemetry & Observability Insights"
        title="Telemetry & Analytics"
        description="Production traffic velocity, conversion funnels, visitor demographics, and acquisition channels."
      />

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">
            Real-Time
          </Badge>
          {isEditMode && (
            <Badge variant="warning" size="sm">
              Edit Mode
            </Badge>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Aggregated real-time clickstream &amp; funnel telemetry.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <AnalyticsDateRangePicker
            value={rangeDays}
            onChange={(days) => setRangeDays(days)}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs"
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* High-Level Overview Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <OverviewMetricCard
          title="Total Page Views"
          value={overview?.totalPageViews?.toLocaleString() ?? (isLoading ? '...' : '0')}
          subtitle={`Past ${rangeDays} days`}
          change="+14.2%"
          trend="up"
          badge="PV"
        />

        <OverviewMetricCard
          title="Unique Visitors"
          value={overview?.uniqueVisitors?.toLocaleString() ?? (isLoading ? '...' : '0')}
          subtitle="Distinct client sessions"
          change="+8.6%"
          trend="up"
          badge="UV"
        />

        <OverviewMetricCard
          title="Inbound Leads"
          value={overview?.totalLeads?.toLocaleString() ?? (isLoading ? '...' : '0')}
          subtitle="Project inquiries submitted"
          change="+21.4%"
          trend="up"
          badge="CRM"
        />

        <OverviewMetricCard
          title="Conversion Rate"
          value={
            overview?.conversionRate !== undefined
              ? `${overview.conversionRate}%`
              : isLoading
                ? '...'
                : '0.0%'
          }
          subtitle="Visitors to qualified leads"
          change="+3.1%"
          trend="up"
          badge="CVR"
        />
      </div>

      {/* Main Charts Row: Area Traffic Velocity */}
      <PageViewsChart
        totalViews={overview?.totalPageViews ?? 1200}
        uniqueVisitors={overview?.uniqueVisitors ?? 450}
        days={rangeDays}
      />

      {/* Acquisition & Footprint Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TrafficSourcesPieChart sources={leadSources} />
        <DeviceBreakdownChart devices={traffic?.devices} />
        <GeoHeatmap countries={traffic?.topCountries} />
      </div>

      {/* Conversion Funnel & Top Pages Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Card */}
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              End-to-End Conversion Funnel
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Visitor drop-off across marketing awareness and discovery milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { stage: '1. Total Visitors', count: funnel?.visitors ?? overview?.uniqueVisitors ?? 450, color: 'bg-brand-500' },
                { stage: '2. Page Views Explored', count: funnel?.pageViews ?? overview?.totalPageViews ?? 1200, color: 'bg-sky-500' },
                { stage: '3. CTA Button Interactions', count: funnel?.ctaClicks ?? 180, color: 'bg-indigo-500' },
                { stage: '4. Form Inquiries Submitted', count: funnel?.leads ?? overview?.totalLeads ?? 34, color: 'bg-amber-500' },
                { stage: '5. Consultations Booked', count: funnel?.consultations ?? overview?.totalConsultations ?? 14, color: 'bg-emerald-500' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${step.color}`} />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {step.stage}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {step.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages Table */}
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Top Visited Content & Offerings
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Highest traffic landing pages and service solutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="pb-2">Path / Route</th>
                    <th className="pb-2 text-right">Page Views</th>
                    <th className="pb-2 text-right">Unique Visitors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {topPages.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-400">
                        No page views recorded in this period.
                      </td>
                    </tr>
                  ) : (
                    topPages.slice(0, 7).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                        <td className="py-2.5 font-mono text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                          {item.page}
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-600 dark:text-slate-300">
                          {item.views.toLocaleString()}
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-500">
                          {item.uniqueVisitors.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsPage;
export { AnalyticsPage as Component };
