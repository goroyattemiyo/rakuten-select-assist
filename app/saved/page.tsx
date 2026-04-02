'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSavedItems, removeItem, SavedItem } from '@/lib/saved-items';

export default function SavedPage() {
  const router = useRouter();
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    setItems(getSavedItems());
  }, []);

  function handleRemove(id: string) {
    removeItem(id);
    setItems(getSavedItems());
  }

  return (
    <div className="min-h-screen" style={{background: "linear-gradient(135deg, #fff8f0 0%, #fef3e2 40%, #fde8c8 100%)"}}>
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 backdrop-blur-md" style={{background: "rgba(255,248,240,0.85)"}}>
        <h1 className="text-lg font-bold text-[#8b5e34] tracking-tight">保存済み候補</h1>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-sm font-bold text-[#8b5e34] border border-[#8b5e34] px-4 py-2 rounded-full"
        >
          検索に戻る
        </button>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        {items.length === 0 && (
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-[#50443b] font-medium">保存済みの候補はありません。</p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="mt-4 text-sm font-bold text-[#8b5e34] underline"
            >
              商品を探す
            </button>
          </div>
        )}

        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl p-5" style={{background: "linear-gradient(160deg, #ffffff 0%, #fff8f0 100%)", boxShadow: "0 8px 32px rgba(139,94,52,0.1), inset 0 1px 0 rgba(255,255,255,0.9)"}}>
              <p className="text-sm font-bold text-[#1b1c1a] leading-snug mb-2">{item.name}</p>
              <p className="text-[#8b5e34] font-bold mb-1">¥{item.price.toLocaleString()}</p>
              <p className="text-xs text-[#83746a] mb-4">{new Date(item.savedAt).toLocaleDateString('ja-JP')}</p>
              <div className="flex gap-3">
                
                  <a
                  href={item.itemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-white font-bold py-3 rounded-xl text-sm text-center block"
                  style={{background: "linear-gradient(135deg, #c17f3e 0%, #8b5e34 50%, #6f461f 100%)"}}>
                  楽天で確認する
                </a>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="flex-1 bg-[#eae8e5] text-[#1b1c1a] font-bold py-3 rounded-xl text-sm"
                >
                  削除する
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
