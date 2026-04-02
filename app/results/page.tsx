
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCandidate } from '@/lib/types';

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';
  const genre = searchParams.get('genre') ?? '';

  const [items, setItems] = useState<ProductCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (genre) params.set('genre', genre);

    fetch('/api/search?' + params.toString())
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.message);
        setItems(data.items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [keyword, genre]);

  return (
    <div className="min-h-screen bg-[#fcf9f6]">
      <header className="fixed top-0 w-full z-50 bg-[#fcf9f6] flex items-center justify-between px-6 h-16">
        <h1 className="text-lg font-bold text-[#8b5e34] tracking-tight">Rakuten Select</h1>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-sm font-bold text-[#8b5e34] border border-[#8b5e34] px-4 py-2 rounded-full"
        >
          再検索
        </button>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#1b1c1a] mb-2">おすすめ候補</h2>
          <p className="text-[#50443b] text-sm">
            {keyword && <span>「{keyword}」</span>}
            {genre && keyword && <span> × </span>}
            {genre && <span>ジャンル指定</span>}
            の検索結果です。
          </p>
        </section>

        {loading && (
          <div className="text-center py-20">
            <p className="text-[#50443b] font-medium">検索中...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 rounded-xl p-6 text-center">
            <p className="text-red-500 font-medium">検索に失敗しました。</p>
            <p className="text-red-400 text-sm mt-1">{error}</p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="mt-4 text-sm font-bold text-[#8b5e34] underline"
            >
              条件を変えて再検索する
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-[#50443b] font-medium">候補が見つかりませんでした。</p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="mt-4 text-sm font-bold text-[#8b5e34] underline"
            >
              条件を変えて再検索する
            </button>
          </div>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <article key={item.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-[#8b5e34] mb-3">候補 {index + 1}</p>
              <div className="flex gap-4">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    width={88}
                    height={88}
                    className="rounded-xl object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1b1c1a] leading-snug line-clamp-2 mb-1">{item.name}</p>
                  <p className="text-[#8b5e34] font-bold">¥{item.price.toLocaleString()}</p>
                  {item.shopName && (
                    <p className="text-xs text-[#83746a] mt-1">{item.shopName}</p>
                  )}
                </div>
              </div>
              {item.reasons && item.reasons.length > 0 && (
                <p className="mt-3 text-sm text-[#50443b] leading-relaxed">{item.reasons[0]}</p>
              )}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  className="flex-1 bg-gradient-to-br from-[#6f461f] to-[#8b5e34] text-white font-bold py-3 rounded-xl text-sm"
                >
                  保存する
                </button>
                <a
                  href={item.itemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#eae8e5] text-[#1b1c1a] font-bold py-3 rounded-xl text-sm text-center"
                >
                  詳細を見る
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>

      </div>
  );
}
