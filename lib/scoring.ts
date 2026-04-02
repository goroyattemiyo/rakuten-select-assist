import { ProductCandidate } from '@/lib/types';

function calcPriceScore(price: number): number {
  if (price <= 0) return 0;
  if (price <= 2000) return 7;
  if (price <= 5000) return 10;
  if (price <= 10000) return 8;
  return 5;
}

function calcReviewScore(reviewCount?: number, reviewAverage?: number): number {
  const countScore = Math.min((reviewCount ?? 0) / 50, 10);
  const averageScore = Math.min(reviewAverage ?? 0, 5) * 2;
  return Math.min((countScore + averageScore) / 2, 10);
}

export function scoreProducts(items: ProductCandidate[]): ProductCandidate[] {
  return items
    .map((item) => {
      const priceScore = calcPriceScore(item.price);
      const reviewScore = calcReviewScore(item.reviewCount, item.reviewAverage);
      const baseScore = priceScore * 0.4 + reviewScore * 0.6;

      return {
        ...item,
        score: Math.round(baseScore * 10) / 10,
        priceScore: Math.round(priceScore * 10) / 10,
        reviewScore: Math.round(reviewScore * 10) / 10,
      };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
