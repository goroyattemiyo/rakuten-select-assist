import { SearchParams, ProductCandidate } from '@/lib/types';

const BASE_URL = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601';

function buildQuery(params: SearchParams): URLSearchParams {
  const query = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID ?? '',
    format: 'json',
    formatVersion: '2',
    hits: '10',
  });

  if (process.env.RAKUTEN_AFFILIATE_ID) {
    query.set('affiliateId', process.env.RAKUTEN_AFFILIATE_ID);
  }

  if (params.keyword) {
    query.set('keyword', params.keyword);
  }

  return query;
}

export async function searchRakutenItems(params: SearchParams): Promise<ProductCandidate[]> {
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
