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
      ? '丁寧で信頼感のある文体'
      : 'フレンドリーで親しみやすい文体';

  const reviewInfo =
    safeReviewCount && safeReviewAverage
      ? `レビュー${safeReviewCount}件・平均${safeReviewAverage}点`
      : safeReviewCount
      ? `レビュー${safeReviewCount}件`
      : '';

  const prompt = `あなたは楽天アフィリエイターです。以下の商品情報をもとに、SNS（Threads・X）向けの日本語投稿文を作成してください。

【商品名（長い場合は要点だけ抽出してOK）】
${safeName}

【価格】¥${safePrice.toLocaleString()}
【レビュー情報】${reviewInfo || 'なし'}
【文体】${toneInstruction}

【出力ルール】
- 完結した文章で終わること（途中で切れないこと）
- 200文字以内
- 絵文字を2〜4個使う
- 「リンクはプロフィールから」を末尾に入れる
- ハッシュタグを2〜3個、末尾にまとめる
- 商品名をそのままコピーしない。魅力を自分の言葉で伝える
- URLは含めない

投稿文のみ出力してください。`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
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

    const trimmed = generated.trim().slice(0, 600);
    return NextResponse.json({ text: trimmed });
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return NextResponse.json({ error: 'Network error' }, { status: 502 });
  }
}
