import { SearchParams, ProductCandidate } from '@/lib/types';

const BASE_URL = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601';

function buildQuery(params: SearchParams): URLSearchParams {
  const query = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID ?? '',
    accessKey: process.env.RAKUTEN_ACCESS_KEY ?? '',
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

  if (params.genre) {
    query.set('genreId', params.genre);
  }

  return query;
}

export async function searchRakutenItems(params: SearchParams): Promise<ProductCandidate[]> {
  const applicationId = process.env.RAKUTEN_APPLICATION_ID;

  if (!applicationId) {
    throw new Error('RAKUTEN_APPLICATION_ID is not set.');
  }

  const url = `${BASE_URL}?${buildQuery(params).toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Origin': 'https://example.com',
      'Referer': 'https://example.com/',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Rakuten API request failed: ${response.status} ${body}`);
  }

  const data = await response.json() as {
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
