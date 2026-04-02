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

  const toneInstruction = safeTone === 'polite' ? '丁寧で信頼感のある文体' : 'フレンドリーで親しみやすい文体';

  const reviewInfo =
    safeReviewCount && safeReviewAverage
      ? `レビュー${safeReviewCount}件・平均${safeReviewAverage}点`
      : safeReviewCount
      ? `レビュー${safeReviewCount}件`
      : '';

  const prompt = `楽天アフィリエイターとして、以下の商品のSNS投稿文を日本語で作成してください。

商品名（長い場合は要点を抽出）: ${safeName}
価格: ¥${safePrice.toLocaleString()}
${reviewInfo ? `レビュー: ${reviewInfo}` : ''}
文体: ${toneInstruction}

必須ルール:
1. 必ず文章を完結させること（途中で切らない）
2. 全体で100文字以上180文字以内
3. 絵文字を2〜3個使う
4. 末尾に「リンクはプロフィールから」を入れる
5. ハッシュタグを2個、最後に置く
6. 商品名をそのままコピーしない
7. URLは含めない

投稿文のみ出力:`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.7,
          },
          thinkingConfig: {
            thinkingBudget: 0
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

    return NextResponse.json({ text: generated.trim() });
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return NextResponse.json({ error: 'Network error' }, { status: 502 });
  }
}
