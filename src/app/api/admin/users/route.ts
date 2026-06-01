import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { identifier, name, password, role } = await request.json();

    if (!identifier || !name || !password) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios' }, { status: 400 });
    }

    const email = `${identifier.toLowerCase().trim()}@iait.aperam.com`;

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // Create user profile in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      identifier: identifier.toLowerCase().trim(),
      name,
      role: role || 'user',
      points: 0,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
