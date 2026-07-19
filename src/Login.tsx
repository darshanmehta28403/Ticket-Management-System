import { FormEvent, useState } from 'react';
import { api } from './api';
import type { User } from './types';

type Props = { onLogin: (token: string, user: User) => void };

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('cb@gmail.com');
  const [password, setPassword] = useState('cb@1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api('/auth/login', undefined, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      onLogin(result.token, result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  return <main className="login-page">
    <form className="login-card" onSubmit={submit}>
      <p className="eyebrow">TICKET MANAGEMENT</p>
      <h1>Welcome to FlowBit</h1>
      <p className="muted">Sign in to manage projects and tickets.</p>
      <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required /></label>
      <label>Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required /></label>
      {error && <p className="error">{error}</p>}
      <button disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      <p className="help-text">Demo admin: cb@gmail.com / cb@1234</p>
    </form>
  </main>;
}
