import { useNavigate } from 'react-router-dom';
import { AuthHeader, AuthLayout, AuthTabs, CheckRow, Field, PrimaryButton, SocialButtons } from './AuthParts';

export default function SignUpScreen() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault(); // visual only for now — hook up account creation here
  };

  return (
    <AuthLayout>
      <AuthHeader title="Create Account" subtitle="Start your personalized PCOS journey" />

      <AuthTabs active="signup" onLogin={() => navigate('/login', { replace: true })} />

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <Field label="Full name" name="name" autoComplete="name" placeholder="Your full name" />
        <Field label="Email address" type="email" name="email" autoComplete="email" placeholder="you@example.com" />
        <Field label="Password" name="password" autoComplete="new-password" placeholder="Create a password" password />
        <Field
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          password
        />

        <CheckRow name="terms">
          <span className="auth-small">
            I agree to the <a href="#terms" className="auth-inline-link">Terms of Service</a> and{' '}
            <a href="#privacy" className="auth-inline-link">Privacy Policy</a>
          </span>
        </CheckRow>

        <div className="auth-actions">
          <PrimaryButton title="Create Account" />
        </div>
      </form>

      <SocialButtons />
    </AuthLayout>
  );
}
