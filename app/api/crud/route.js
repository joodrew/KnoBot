import { crud } from '@/services/crud';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await crud(body);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
