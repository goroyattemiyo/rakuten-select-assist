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

  const { name, price, reviewCount, reviewAverage, tone } = body as {
    name?: string;
    price?: number;
    reviewCount?: number;
    reviewAverage?: number;
    tone?: string;
  };

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid item name' }, { status: 400 });
  }
  if (typeof price !== 'number' || price < 0) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
  }

  const safeName = name.trim().slice(0, 200);
  const safePrice = Math.floor(price);
  const safeReviewCount = typeof reviewCount === 'number' ? Math.floor(reviewCount) : null;
  const safeReviewAverage = typeof reviewAverage === 'number' ? reviewAverage : null;
  const safeTone = tone === 'polite' ? 'polite' : 'casual';

  const toneInstruction =
    safeTone === 'polite'
      ? '丁寧でフォーマルな文体で書いてください。'
      : 'フレンドリーでカジュアルな文体で書いてください。';

  const reviewInfo =
    safeReviewCount && safeReviewAverage
      ? `レビュー数: ${safeReviewCount}件、平均評価: ${safeReviewAverage}`
      : safeReviewCount
      ? `レビュー数: ${safeReviewCount}件`
      : '（レビュー情報なし）';

  const prompt = `あなたは楽天アフィリエイターのSNS投稿文ライターです。
以下の商品情報をもとに、SNS（Threads・X）向けの紹介投稿文を日本語で作成してください。

【商品名】${safeName}
【価格】¥${safePrice.toLocaleString()}
【レビュー情報】${reviewInfo}

【ルール】
- ${toneInstruction}
- 絵文字を適度に使う
- 150文字以内に収める
- URLやリンクは含めない。代わりに「リンクはプロフィールから」と書く
- ハッシュタグは2〜3個まで
- 商品の魅力が伝わるような自然な文章にする

投稿文のみを出力してください。前置きや説明は不要です。`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.8,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      return NextResponse.json({ error: 'AI generation failed' }, { status: 502 });
    }

    const data = await response.json();
    const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generated || typeof generated !== 'string') {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 502 });
    }

    const trimmed = generated.trim().slice(0, 500);
    return NextResponse.json({ text: trimmed });
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return NextResponse.json({ error: 'Network error' }, { status: 502 });
  }
}
