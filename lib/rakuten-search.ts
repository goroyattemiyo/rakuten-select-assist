import { ProductCandidate, SearchParams } from '@/lib/types';

const BASE_URL = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601';

function buildKeyword(params: SearchParams): string {
  const values = [params.genre, params.keyword]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  return values.join(' ');
}

function buildQuery(params: SearchParams): URLSearchParams {
  const query = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID ?? '',
    format: 'json',
    formatVersion: '2',
    hits: '20',
    imageFlag: '1',
    sort: '-reviewCount',
  });

  if (process.env.RAKUTEN_AFFILIATE_ID) {
    query.set('affiliateId', process.env.RAKUTEN_AFFILIATE_ID);
  }

  const mergedKeyword = buildKeyword(params);
  if (mergedKeyword) {
    query.set('keyword', mergedKeyword);
  }

  return query;
}

export async function searchRakutenItemsV2(params: SearchParams): Promise<ProductCandidate[]> {
  const applicationId = process.env.RAKUTEN_APPLICATION_ID;

  if (!applicationId) {
    throw new Error('RAKUTEN_APPLICATION_ID is not set.');
  }

  const response = await fetch(`${BASE_URL}?${buildQuery(params).toString()}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Rakuten API request failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    Items?: Array<{
      itemCode: string;
      itemName: string;
      itemPrice: number;
      mediumImageUrls?: string[];
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
    itemUrl: item.itemUrl,
    shopName: item.shopName,
    reviewCount: item.reviewCount,
    reviewAverage: item.reviewAverage,
  }));
}
