import { NextRequest, NextResponse } from 'next/server';
import { searchRakutenItemsUnified } from '@/lib/rakuten-unified';
import { scoreProducts } from '@/lib/scoring';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') ?? undefined;
  const genreParam = searchParams.get('genre');
  const genreId = genreParam ? Number(genreParam) : undefined;

  try {
    const rawItems = await searchRakutenItemsUnified({ keyword, genreId });
    const scoredItems = scoreProducts(rawItems);

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
