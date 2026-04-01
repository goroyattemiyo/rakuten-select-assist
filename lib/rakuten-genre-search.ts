import { ProductCandidate } from '@/lib/types';

const BASE_URL = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601';

function buildQuery(genreId: number, keyword?: string): URLSearchParams {
  const query = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID ?? '',
    accessKey: process.env.RAKUTEN_ACCESS_KEY ?? '',
    format: 'json',
    formatVersion: '2',
    hits: '20',
    imageFlag: '1',
    availability: '1',
    hasReviewFlag: '1',
    field: '1',
    sort: '-reviewCount',
    genreId: String(genreId),
    elements: 'itemName,itemPrice,itemUrl,affiliateUrl,mediumImageUrls,shopName,reviewCount,reviewAverage,itemCode',
  });

  if (process.env.RAKUTEN_AFFILIATE_ID) {
    query.set('affiliateId', process.env.RAKUTEN_AFFILIATE_ID);
  }

  if (keyword?.trim()) {
    query.set('keyword', keyword.trim());
  }

  return query;
}

export async function searchRakutenItemsByGenreId(params: {
  genreId: number;
  keyword?: string;
}): Promise<ProductCandidate[]> {
  const applicationId = process.env.RAKUTEN_APPLICATION_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  if (!applicationId) {
    throw new Error('RAKUTEN_APPLICATION_ID is not set.');
  }

  if (!accessKey) {
    throw new Error('RAKUTEN_ACCESS_KEY is not set.');
  }

  const response = await fetch(`${BASE_URL}?${buildQuery(params.genreId, params.keyword).toString()}`, {
    method: 'GET',
    cache: 'no-store',
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
      affiliateUrl?: string;
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
    itemUrl: item.affiliateUrl ?? item.itemUrl,
    shopName: item.shopName,
    reviewCount: item.reviewCount,
    reviewAverage: item.reviewAverage,
  }));
}
