import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { LoginForm } from '../components/LoginForm';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export function LoginPage() {
  const [view, setView] = useState<'login' | 'forgot-password'>('login');

  return (
    <Card className="w-full border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {view === 'login' ? 'Console Authentication' : 'Account Recovery'}
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
          {view === 'login'
            ? 'Sign in with your enterprise credentials to access management controls.'
            : 'Enter your email to request an authenticated reset link.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {view === 'login' ? (
          <LoginForm onForgotPasswordClick={() => setView('forgot-password')} />
        ) : (
          <ForgotPasswordForm onBackToLogin={() => setView('login')} />
        )}
      </CardContent>
    </Card>
  );
}

export default LoginPage;
export { LoginPage as Component };
