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

  const prompt = `楽天市場でアフィリエイト商品を探すためのキーワードを提案してください。

ユーザーの入力: 「${safeInput}」

以下のJSON形式のみで返してください。前置きや説明は不要です。

{
  "keywords": ["キーワード1", "キーワード2", "キーワード3", "キーワード4", "キーワード5"]
}

ルール:
- 楽天市場で実際に検索されそうな具体的なキーワードを5個
- 1キーワードは2〜6文字程度
- 季節・用途・素材など切り口を変えて提案する
- JSONのみ出力、他のテキスト不要`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
      return NextResponse.json({ error: 'AI suggestion failed' }, { status: 502 });
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    if (!Array.isArray(parsed.keywords)) {
      return NextResponse.json({ error: 'Invalid AI response' }, { status: 502 });
    }

    return NextResponse.json({ keywords: parsed.keywords.slice(0, 5) });
  } catch (err) {
    console.error('Suggest keywords error:', err);
    return NextResponse.json({ error: 'Failed to suggest keywords' }, { status: 502 });
  }
}
