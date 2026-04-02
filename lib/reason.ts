import { ProductCandidate } from '@/lib/types';

export function buildReasons(item: ProductCandidate): string[] {
  const reasons: string[] = [];

  if ((item.reviewCount ?? 0) >= 100) {
    reasons.push('レビュー件数が多く、安心感を出しやすいです。');
  }

  if (item.price > 0 && item.price <= 5000) {
    reasons.push('価格帯が扱いやすく、紹介しやすい候補です。');
  }

  if (reasons.length === 0) {
    reasons.push('まず比較候補として見やすい商品です。');
  }

  return reasons;
}
