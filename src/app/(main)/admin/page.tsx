'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPage() {
  const { userRole } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Proteção: apenas admin acessa
  if (userRole !== 'admin') {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Acesso negado. Apenas administradores podem ver esta página.</p>
      </div>
    );
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, name, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: `Usuário ${name} criado com sucesso!` });
        setIdentifier('');
        setName('');
        setPassword('');
        setRole('user');
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao criar usuário' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-0 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900 border-b border-gray-200 pb-3 mb-5">
          Cadastrar Novo Participante
        </h3>
        
        {message.text && (
          <div className={`p-3 rounded-md mb-4 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID Pessoal / Nome Login</label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-600 sm:text-sm px-3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-600 sm:text-sm px-3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha Provisória</label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-600 sm:text-sm px-3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nível de Acesso</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-600 sm:text-sm px-3"
            >
              <option value="user">Usuário Comum</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Participante'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
         <h3 className="text-base font-semibold leading-6 text-gray-900 border-b border-gray-200 pb-3 mb-5">
          Sincronização de Jogos (Admin)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          A atualização dos placares ocorre automaticamente no final do dia. Utilize esta opção apenas se precisar forçar uma atualização imediata via API (ex: API-Football).
        </p>
        <button
          disabled
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Sincronizar Placares Agora (Em Breve)
        </button>
      </div>
    </div>
  );
}
