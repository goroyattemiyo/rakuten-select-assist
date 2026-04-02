import { SavedItem } from '@/lib/saved-items';

export function generatePostText(item: SavedItem): string {
  const price = item.price.toLocaleString();
  const review = item.reviewCount ? `レビュー${item.reviewCount}件` : '';
  const rating = item.reviewAverage && item.reviewAverage > 0 ? `★${item.reviewAverage}` : '';

  const lines = [
    `💡 今日のおすすめ商品`,
    ``,
    `📦 ${item.name}`,
    ``,
    `💰 ¥${price}`,
    review || rating ? `⭐ ${[rating, review].filter(Boolean).join('　')}` : '',
    ``,
    `👇 楽天で詳細を見る`,
    `（リンクはプロフィールから）`,
  ].filter((line) => line !== undefined && line !== null && line !== '');

  return lines.join('\n');
}
