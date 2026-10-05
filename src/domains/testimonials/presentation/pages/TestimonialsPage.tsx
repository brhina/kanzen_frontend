import { useParams, Link } from 'react-router';
import { useUIStore } from '@/core/stores/ui.store';
import { Badge } from '@/shared/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Edit3, ArrowLeft } from 'lucide-react';

export function TestimonialsPage() {
  const params = useParams();
  const { isEditMode, viewMode } = useUIStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Client Endorsements & Reviews
            </h1>
            {isEditMode && (
              <Badge variant="warning" size="sm" className="flex items-center gap-1">
                <Edit3 className="h-3 w-3" />
                <span>Edit Mode</span>
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Verified testimonials from enterprise CTOs, VP Engineering, and founders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {Object.keys(params).length > 0 && (
            <Badge variant="neutral" size="sm" className="font-mono text-xs">
              {JSON.stringify(params)}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content Showcase */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Unified View Experience</CardTitle>
          <CardDescription>
            Layout mode: <strong className="text-slate-900 dark:text-white uppercase font-mono">{viewMode}</strong>.
            This view dynamically blends public visitor presentation with inline staff authoring.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Content modules and domain services for this view will synchronize seamlessly with the backend REST endpoints.
          </p>
          <div className="pt-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Home</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TestimonialsPage;
export { TestimonialsPage as Component };
