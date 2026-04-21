'use client';

import { useState, useTransition } from 'react';
import { adminLogin } from '../actions';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const result = await adminLogin(password);
      if (!result.ok) setError('Contraseña incorrecta');
    });
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Impulso BioCycle</p>
          <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wide">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors text-sm"
          >
            {isPending ? 'Verificando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
