import { ProductCandidate } from '@/lib/types';

/**
 * 楽天API エンドポイント
 */
const BASE_URL =
  'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601';

/**
 * 楽天API検索（統合版）
 * keyword / genreId の両方に対応
 */
export async function searchRakutenItemsUnified(params: {
  keyword?: string;
  genreId?: number;
}): Promise<ProductCandidate[]> {
  const { keyword, genreId } = params;

  // keyword も genreId も空ならエラー
  if (!keyword && genreId === undefined) {
    throw new Error('keyword または genreId のいずれかが必要です。');
  }

  const applicationId = process.env.RAKUTEN_APPLICATION_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  if (!applicationId) {
    throw new Error('RAKUTEN_APPLICATION_ID is not set.');
  }

  if (!accessKey) {
    throw new Error('RAKUTEN_ACCESS_KEY is not set.');
  }

  const query = new URLSearchParams({
    applicationId,
    accessKey,
    format: 'json',
    formatVersion: '2',
    hits: '20',
    imageFlag: '1',
    availability: '1',
    hasReviewFlag: '1',
    sort: '-reviewCount',
  });

  if (keyword?.trim()) {
    query.set('keyword', keyword.trim());
  }

  if (genreId !== undefined) {
    query.set('genreId', String(genreId));
  }

  if (process.env.RAKUTEN_AFFILIATE_ID) {
    query.set('affiliateId', process.env.RAKUTEN_AFFILIATE_ID);
  }

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const referer = appUrl.endsWith('/') ? appUrl : `${appUrl}/`;

  const response = await fetch(`${BASE_URL}?${query.toString()}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Origin: appUrl,
      Referer: referer,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Rakuten API request failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as {
    Items?: Array<{
      itemCode: string;
      itemName: string;
      itemPrice: number;
      mediumImageUrls?: string[];
      affiliateUrl?: string;
      itemUrl: string;
      shopName?: string;
      reviewCount?: number;
      reviewAverage?: number;
    }>;
  };

  return (data.Items ?? []).map((item) => ({
    id: item.itemCode,
    name: item.itemName,
    price: item.itemPrice,
    imageUrl: item.mediumImageUrls?.[0] ?? '',
    itemUrl: item.affiliateUrl ?? item.itemUrl,
    shopName: item.shopName,
    reviewCount: item.reviewCount,
    reviewAverage: item.reviewAverage,
  }));
}
