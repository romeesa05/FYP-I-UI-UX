import { useNavigate } from 'react-router-dom';
import { AuthHeader, AuthLayout, AuthTabs, CheckRow, Field, PrimaryButton, SocialButtons } from './AuthParts';

export default function LoginScreen() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault(); // hook up real authentication here before navigating
    navigate('/home');
  };

  return (
    <AuthLayout>
      <AuthHeader title="Welcome Back" subtitle="Sign in to continue your journey" />

      <AuthTabs active="login" onSignUp={() => navigate('/signup', { replace: true })} />

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <Field label="Email address" type="email" name="email" autoComplete="email" placeholder="you@example.com" />
        <Field label="Password" name="password" autoComplete="current-password" placeholder="Enter your password" password />

        <div className="auth-row">
          <CheckRow name="remember" defaultChecked>
            <span className="auth-small">Remember me</span>
          </CheckRow>
          <button type="button" className="auth-link">
            Forgot password?
          </button>
        </div>

        <div className="auth-actions">
          <PrimaryButton title="Sign In" />
        </div>
      </form>

      <SocialButtons />
    </AuthLayout>
  );
}
