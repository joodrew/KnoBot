import { NextResponse } from 'next/server';
import { crud } from '@/services/crud';

export async function POST(req) {
  try {
    const body = await req.json();
    const { data } = body;

    const result = await crud(data);

    return NextResponse.json({ success: true, results: result });
  } catch (error) {
    console.error('❌ Erro na API (POST /crud):', error);
    return NextResponse.json({ success: false, error: error.message || 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    return "POST API";
  } catch (error) {
    console.error('❌ Erro na API (GET):', error);
    return Response.json({ error: error.message || 'Erro interno do servidor' }, { status: 500 });
  }
}