'use client';
import Image from 'next/image';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCandidate } from '@/lib/types';
import { saveItem, isItemSaved } from '@/lib/saved-items';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';
  const genre = searchParams.get('genre') ?? '';

  const [items, setItems] = useState<ProductCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

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

  function handleSave(item: ProductCandidate) {
    saveItem({
      id: item.id,
      name: item.name,
      price: item.price,
      itemUrl: item.itemUrl,
      savedAt: new Date().toISOString(),
      reviewCount: item.reviewCount,
      reviewAverage: item.reviewAverage,
    });
    setSavedIds((prev) => new Set(prev).add(item.id));
  }

  function isSaved(id: string): boolean {
    return savedIds.has(id) || isItemSaved(id);
  }

  return (
    <div className="min-h-screen" style={{background: "linear-gradient(135deg, #fff8f0 0%, #fef3e2 40%, #fde8c8 100%)"}}>
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 backdrop-blur-md" style={{background: "rgba(255,248,240,0.85)"}}>
        <div className="flex items-center gap-2">
          <Image src="/icon.png" alt="icon" width={28} height={28} className="rounded-lg" />
          <h1 className="text-lg font-bold text-[#8b5e34] tracking-tight">Rakuten Select</h1>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => router.push('/saved')} className="text-sm font-bold text-[#8b5e34] border border-[#8b5e34] px-4 py-2 rounded-full transition-all active:scale-95 active:bg-[#8b5e34] active:text-white">
            保存済み
          </button>
          <button type="button" onClick={() => router.push('/')} className="text-sm font-bold text-[#8b5e34] border border-[#8b5e34] px-4 py-2 rounded-full transition-all active:scale-95 active:bg-[#8b5e34] active:text-white">
            再検索
          </button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <section className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#1b1c1a] mb-2">選定候補</h2>
          <div className="mt-2 px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-[#e8ddd4] text-sm text-[#50443b]">
            <span className="font-bold">検索条件：</span>
            {keyword && <span>キーワード「{keyword}」</span>}
            {keyword && genre && <span>　×　</span>}
            {genre && <span>ジャンル指定あり</span>}
            <span>　でスコアリングした結果です。レビュー数・価格帯を軸に上位を抽出しています。</span>
          </div>
        </section>

        {loading && <div className="text-center py-20"><p className="text-[#50443b] font-medium">検索中...</p></div>}

        {error && (
          <div className="bg-red-50 rounded-xl p-6 text-center">
            <p className="text-red-500 font-medium">検索に失敗しました。</p>
            <p className="text-red-400 text-sm mt-1">{error}</p>
            <button type="button" onClick={() => router.push('/')} className="mt-4 text-sm font-bold text-[#8b5e34] underline">条件を変えて再検索する</button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-[#50443b] font-medium">候補が見つかりませんでした。</p>
            <button type="button" onClick={() => router.push('/')} className="mt-4 text-sm font-bold text-[#8b5e34] underline">条件を変えて再検索する</button>
          </div>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <article key={item.id} className="rounded-2xl p-5" style={{background: "linear-gradient(160deg, #ffffff 0%, #fff8f0 100%)", boxShadow: "0 8px 32px rgba(139,94,52,0.1), inset 0 1px 0 rgba(255,255,255,0.9)"}}>
              <p className="text-xs font-bold text-[#8b5e34] mb-3">選定候補 {index + 1}</p>
              <div className="flex gap-4">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} width={88} height={88} className="rounded-xl object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1b1c1a] leading-snug line-clamp-2 mb-1">{item.name}</p>
                  <p className="text-[#8b5e34] font-bold">¥{item.price.toLocaleString()}</p>
                  {item.shopName && <p className="text-xs text-[#83746a] mt-1">{item.shopName}</p>}
                </div>
              </div>
              <div className="mt-3 flex gap-3 flex-wrap items-center">
                {item.score !== undefined && <span className="text-base font-bold px-3 py-1 rounded-full" style={{background: "linear-gradient(135deg, #c17f3e, #8b5e34)", color: "white"}}>総合 {item.score}</span>}
                {item.priceScore !== undefined && <span className="text-sm px-3 py-1 rounded-full bg-[#f6f3f0] text-[#50443b] font-medium">価格 {item.priceScore}</span>}
                {item.reviewScore !== undefined && <span className="text-sm px-3 py-1 rounded-full bg-[#f6f3f0] text-[#50443b] font-medium">レビュー {item.reviewScore}</span>}
                {item.reviewCount !== undefined && <span className="text-sm px-3 py-1 rounded-full bg-[#f6f3f0] text-[#50443b] font-medium">{item.reviewCount}件</span>}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => handleSave(item)}
                  disabled={isSaved(item.id)}
                  className="flex-1 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95"
                  style={{background: isSaved(item.id) ? '#bbb' : 'linear-gradient(135deg, #c17f3e 0%, #8b5e34 50%, #6f461f 100%)', boxShadow: '0 4px 16px rgba(139,94,52,0.35)'}}
                >
                  {isSaved(item.id) ? '保存済み ✓' : '保存する'}
                </button>
                <a href={item.itemUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#eae8e5] text-[#1b1c1a] font-bold py-3 rounded-xl text-sm text-center block transition-all active:scale-95">
                  楽天で確認する
                </a>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-[#50443b]">読み込み中...</p></div>}>
      <ResultsContent />
    </Suspense>
  );
}