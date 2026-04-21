'use client';

import { useTransition } from 'react';
import { adminLogout } from './actions';

export default function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => adminLogout())}
      disabled={pending}
      className="text-xs px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
    >
      {pending ? '…' : 'Salir'}
    </button>
  );
}
