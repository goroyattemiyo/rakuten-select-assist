'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSavedItems, removeItem, SavedItem } from '@/lib/saved-items';
import { generatePostText } from '@/lib/post-generator';

type Tone = 'casual' | 'polite';

interface GeneratedTexts {
  [itemId: string]: string;
}

interface GeneratingIds {
  [itemId: string]: boolean;
}

export default function SavedPage() {
  const router = useRouter();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [tone, setTone] = useState<Tone>('casual');
  const [generatedTexts, setGeneratedTexts] = useState<GeneratedTexts>({});
  const [generatingIds, setGeneratingIds] = useState<GeneratingIds>({});

  useEffect(() => {
    setItems(getSavedItems());
  }, []);

  function handleRemove(id: string) {
    removeItem(id);
    setItems(getSavedItems());
    setGeneratedTexts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function getPostText(item: SavedItem): string {
    return generatedTexts[item.id] ?? generatePostText(item);
  }

  function handleCopy(item: SavedItem) {
    const text = getPostText(item);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  async function handleGenerate(item: SavedItem) {
    if (generatingIds[item.id]) return;

    setGeneratingIds((prev) => ({ ...prev, [item.id]: true }));

    try {
      const res = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: item.name,
          price: item.price,
          reviewCount: item.reviewCount,
          reviewAverage: item.reviewAverage,
          tone,
        }),
      });

      if (!res.ok) throw new Error('generation failed');

      const data = await res.json();
      if (data.text) {
        setGeneratedTexts((prev) => ({ ...prev, [item.id]: data.text }));
      }
    } catch {
      // フォールバック：テンプレート文をそのまま使用
    } finally {
      setGeneratingIds((prev) => ({ ...prev, [item.id]: false }));
    }
  }

  return (
    <div className="min-h-screen" style={{background: "linear-gradient(135deg, #fff8f0 0%, #fef3e2 40%, #fde8c8 100%)"}}>
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 backdrop-blur-md" style={{background: "rgba(255,248,240,0.85)"}}>
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="icon" width={28} height={28} style={{borderRadius: 8}} />
          <h1 className="text-lg font-bold text-[#8b5e34] tracking-tight">Rakuten Select Assist</h1>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-bold text-[#8b5e34] border border-[#8b5e34] px-4 py-2 rounded-full transition-all active:scale-95 active:bg-[#8b5e34] active:text-white"
        >
          候補に戻る
        </button>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        {items.length > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium text-[#50443b]">文体：</span>
            <button
              type="button"
              onClick={() => setTone('casual')}
              className="text-sm font-bold px-4 py-2 rounded-full transition-all"
              style={{
                background: tone === 'casual' ? 'linear-gradient(135deg, #c17f3e 0%, #8b5e34 100%)' : '#f6f3f0',
                color: tone === 'casual' ? 'white' : '#50443b',
              }}
            >
              カジュアル
            </button>
            <button
              type="button"
              onClick={() => setTone('polite')}
              className="text-sm font-bold px-4 py-2 rounded-full transition-all"
              style={{
                background: tone === 'polite' ? 'linear-gradient(135deg, #c17f3e 0%, #8b5e34 100%)' : '#f6f3f0',
                color: tone === 'polite' ? 'white' : '#50443b',
              }}
            >
              丁寧
            </button>
          </div>
        )}

        {items.length === 0 && (
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-[#50443b] font-medium">保存済みの候補はありません。</p>
            <button
              type="button"
              onClick={() => router.back()}
              className="mt-4 text-sm font-bold text-[#8b5e34] underline"
            >
              候補に戻る
            </button>
          </div>
        )}

        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl p-5" style={{background: "linear-gradient(160deg, #ffffff 0%, #fff8f0 100%)", boxShadow: "0 8px 32px rgba(139,94,52,0.1), inset 0 1px 0 rgba(255,255,255,0.9)"}}>
              <p className="text-sm font-bold text-[#1b1c1a] leading-snug mb-2">{item.name}</p>
              <p className="text-[#8b5e34] font-bold mb-1">¥{item.price.toLocaleString()}</p>
              <div className="flex gap-3 items-center mb-4">
                {item.reviewCount !== undefined && (
                  <span className="text-xs px-2 py-1 rounded-full bg-[#f6f3f0] text-[#50443b] font-medium">
                    レビュー {item.reviewCount}件
                  </span>
                )}
                {item.reviewAverage !== undefined && item.reviewAverage > 0 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-[#f6f3f0] text-[#50443b] font-medium">
                    ★ {item.reviewAverage}
                  </span>
                )}
                <p className="text-xs text-[#83746a]">{new Date(item.savedAt).toLocaleDateString('ja-JP')}</p>
              </div>

              <div className="relative bg-[#f6f3f0] rounded-xl p-4 mb-4 text-sm text-[#50443b] whitespace-pre-wrap leading-relaxed min-h-[80px]">
                {generatingIds[item.id] ? (
                  <div className="flex items-center gap-2 text-[#8b5e34]">
                    <span className="animate-pulse">✨ AI生成中...</span>
                  </div>
                ) : (
                  getPostText(item)
                )}
              </div>

              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleGenerate(item)}
                  disabled={generatingIds[item.id]}
                  className="flex-1 font-bold py-3 rounded-xl text-sm transition-all active:scale-95 border"
                  style={{
                    borderColor: '#c17f3e',
                    color: generatingIds[item.id] ? '#c8b49a' : '#c17f3e',
                    background: 'white',
                    cursor: generatingIds[item.id] ? 'not-allowed' : 'pointer',
                  }}
                >
                  {generatingIds[item.id] ? '生成中...' : '✨ AIで生成'}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleCopy(item)}
                  className="flex-1 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95"
                  style={{background: copiedId === item.id ? '#6b9e6b' : 'linear-gradient(135deg, #c17f3e 0%, #8b5e34 50%, #6f461f 100%)'}}
                >
                  {copiedId === item.id ? 'コピーしました ✓' : '投稿文をコピー'}
                </button>
                <a href={item.itemUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-white font-bold py-3 rounded-xl text-sm text-center block transition-all active:scale-95" style={{background: "#8b5e34"}}>
                  楽天で確認
                </a>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="flex-1 bg-[#eae8e5] text-[#1b1c1a] font-bold py-3 rounded-xl text-sm transition-all active:scale-95"
                >
                  削除
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
