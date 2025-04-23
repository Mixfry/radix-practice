import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM rankings 
      ORDER BY score DESC
      LIMIT 100
    `;
    
    return NextResponse.json({ 
      success: true, 
      data: rows 
    });
  } catch (error) {
    console.error("ランキング取得エラー:", error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      score, 
      mode, 
      difficulty, 
      time, 
      correctAnswers, 
      totalQuestions 
    } = body;
    
    const { rows: exactMatch } = await sql`
      SELECT * FROM rankings 
      WHERE name = ${name} 
        AND mode = ${mode} 
        AND difficulty = ${difficulty}
        AND total_questions = ${totalQuestions}
        AND score = ${score}
    `;
    
    if (exactMatch.length > 0) {
      return NextResponse.json({ 
        success: true,
        message: `同じ記録が既に登録されています！(${score})`
      });
    }
    
    const { rows } = await sql`
      SELECT * FROM rankings 
      WHERE name = ${name} 
        AND mode = ${mode} 
        AND difficulty = ${difficulty}
        AND total_questions = ${totalQuestions === 10 ? 10 : totalQuestions}
      ORDER BY score DESC
      LIMIT 1
    `;
    
    if (rows.length > 0) {
      const existingEntry = rows[0];
      
      if (existingEntry.score > score) {
        return NextResponse.json({ 
          success: true,
          message: `前回の記録の方が良いスコアです！(${existingEntry.score} > ${score})\n今回の記録は保存されません`
        });
      }
      
      await sql`
        UPDATE rankings 
        SET 
          score = ${score}, 
          time = ${time}, 
          correct_answers = ${correctAnswers}, 
          total_questions = ${totalQuestions}, 
          created_at = CURRENT_TIMESTAMP
        WHERE id = ${existingEntry.id}
      `;
      
      return NextResponse.json({ 
        success: true, 
        message: `記録を更新しました！${existingEntry.score}→${score}`
      });
    }
    
    await sql`
      INSERT INTO rankings 
        (name, score, mode, difficulty, time, correct_answers, total_questions)
      VALUES 
        (${name}, ${score}, ${mode}, ${difficulty}, ${time}, ${correctAnswers}, ${totalQuestions})
    `;
    
    return NextResponse.json({ 
      success: true, 
      message: 'ランキングに初登録しました！'
    });
    
  } catch (error) {
    console.error("ランキング保存エラー:", error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}