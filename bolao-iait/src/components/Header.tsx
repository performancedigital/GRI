'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Settings, Trophy, User as UserIcon } from 'lucide-react';

export default function Header() {
  const { user, userRole, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  // Extract ID from the fake email
  const userId = user.email ? user.email.split('@')[0] : 'Usuário';

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <span className="text-xl font-bold uppercase tracking-wider">Bolão IAIT</span>
            </div>
            <nav className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') ? 'bg-green-800 text-white' : 'text-green-100 hover:bg-green-600 hover:text-white'
                }`}
              >
                Palpites
              </Link>
              <Link
                href="/ranking"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/ranking') ? 'bg-green-800 text-white' : 'text-green-100 hover:bg-green-600 hover:text-white'
                }`}
              >
                Ranking
              </Link>
              {userRole === 'admin' && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin') ? 'bg-green-800 text-white' : 'text-green-100 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-green-100">
              <UserIcon className="w-4 h-4" />
              <span className="capitalize">{userId}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-md hover:bg-green-600 transition-colors text-green-100 hover:text-white"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
