import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'rankings'
      ) as exists
    `;
    
    const tableExists = rows[0]?.exists || false;
    
    return NextResponse.json({ 
      success: true, 
      tableExists
    });
  } catch (error) {
    console.error("テーブル確認エラー:", error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}