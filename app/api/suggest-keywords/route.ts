import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { input } = body as { input?: string };

  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const safeInput = input.trim().slice(0, 100);

  const prompt = `楽天市場でアフィリエイト商品を探すためのキーワードを5個提案してください。

ユーザーの入力: 「${safeInput}」

キーワードを1行に1個、5行だけ出力してください。
余計な説明、番号、記号は一切不要です。キーワードのみ出力してください。

例：
水着
ビキニ
ラッシュガード
サーフパンツ
日焼け止め`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 200,
            temperature: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      return NextResponse.json({ error: 'AI suggestion failed' }, { status: 502 });
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    const keywords = raw
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0 && line.length <= 20)
      .slice(0, 5);

    if (keywords.length === 0) {
      return NextResponse.json({ error: 'No keywords generated' }, { status: 502 });
    }

    return NextResponse.json({ keywords });
  } catch (err) {
    console.error('Suggest keywords error:', err);
    return NextResponse.json({ error: 'Failed to suggest keywords' }, { status: 502 });
  }
}
