import { NextRequest, NextResponse } from 'next/server';
import { searchRakutenItems } from '@/lib/rakuten';
import { buildReasons } from '@/lib/reason';
import { scoreProducts } from '@/lib/scoring';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') ?? undefined;
  const genre = searchParams.get('genre') ?? undefined;

  try {
    const rawItems = await searchRakutenItems({ keyword, genre });
    const scoredItems = scoreProducts(rawItems).map((item) => ({
      ...item,
      reasons: buildReasons(item),
    }));

    return NextResponse.json({
      items: scoredItems,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'SEARCH_FAILED',
        message,
      },
      { status: 500 },
    );
  }
}
