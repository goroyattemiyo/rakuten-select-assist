import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const today = new Date().toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const prompt = `今日は${today}です。
楽天アフィリエイターに向けて、今の時期に紹介すると売れやすい商品ジャンルのヒントを1文で教えてください。

ルール：
- 40文字以内
- 季節・イベント・トレンドを踏まえる
- 「〜が狙い目」「〜がおすすめ」などの形式
- 絵文字を1個だけ使う
- 余計な説明不要、1文のみ出力`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 100,
            temperature: 0.8,
          },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'AI failed' }, { status: 502 });
    }

    const data = await response.json();
    const hint = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

    if (!hint) {
      return NextResponse.json({ error: 'Empty response' }, { status: 502 });
    }

    return NextResponse.json({ hint });
  } catch (err) {
    console.error('Trend hint error:', err);
    return NextResponse.json({ error: 'Network error' }, { status: 502 });
  }
}
