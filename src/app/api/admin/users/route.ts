import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { identifier, name, password, role } = await request.json();

    if (!identifier || !name || !password) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios' }, { status: 400 });
    }

    const email = `${identifier.toLowerCase().trim()}@iait.aperam.com`;
    const supabaseAdmin = getSupabaseAdmin();

    // Cria o usuário de forma administrativa (autoverificado) no Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name }
    });

    if (authError || !authUser.user) {
      return NextResponse.json({ error: authError?.message || 'Erro ao criar autenticação' }, { status: 500 });
    }

    // Cria a linha de dados complementares na tabela de perfis (profiles)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authUser.user.id,
        identifier: identifier.toLowerCase().trim(),
        name,
        role: role || 'user',
        points: 0
      });

    if (profileError) {
      // Rollback se falhar na inserção da tabela (deleta o usuário do Auth para evitar sujeira)
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, uid: authUser.user.id });
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
