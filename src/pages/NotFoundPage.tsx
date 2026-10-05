import { Link } from 'react-router';
import { Home } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="space-y-4 max-w-md">
        <span className="font-mono text-6xl sm:text-7xl font-black text-brand-500">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Route Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The requested resource does not exist or has been relocated to another endpoint.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
export { NotFoundPage as Component };
