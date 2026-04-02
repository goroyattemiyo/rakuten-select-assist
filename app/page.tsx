'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { genreCatalog } from '@/lib/genre-catalog';

export default function HomePage() {
  const router = useRouter();
  const [genre, setGenre] = useState('');
  const [keyword, setKeyword] = useState('');

  function handleSearch() {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (genre) params.set('genre', genre);
    router.push(`/results?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-[#fcf9f6] font-[Manrope,sans-serif]">
      <header className="fixed top-0 w-full z-50 bg-[#fcf9f6] flex items-center justify-between px-6 h-16">
        <h1 className="text-lg font-bold text-[#8b5e34] tracking-tight">Rakuten Select</h1>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <section className="mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-[#816154] text-white rounded-full mb-6 shadow-sm">
            <span className="text-xs font-bold tracking-wide uppercase">Assistant MVP</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1b1c1a] leading-tight tracking-tight mb-4">
            今日紹介する商品を、<br />
            <span className="text-[#8b5e34]">迷わず選ぶため</span>の下準備。
          </h2>
          <p className="text-[#50443b] text-lg leading-relaxed font-medium">
            楽天市場の商品候補を絞り込みやすくするためのMVPです。まずはジャンルとキーワードから探します。
          </p>
        </section>

        <section className="bg-white rounded-2xl p-8 shadow-sm mb-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-[#50443b]">ジャンルを選択</label>
              <div className="relative">
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full appearance-none bg-[#eae8e5] border-none rounded-xl px-5 py-4 text-[#1b1c1a] font-medium focus:outline-none focus:ring-2 focus:ring-[#8b5e34] cursor-pointer"
                >
                  <option value="">ジャンルを選んでください</option>
                  {genreCatalog.map((g) => (
                    <option key={g.id} value={String(g.id)}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-[#50443b]">キーワード</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="例: 秋物 ワンピース, オーガニック"
                className="w-full bg-[#eae8e5] border-none rounded-xl px-5 py-4 text-[#1b1c1a] placeholder:text-[#83746a] font-medium focus:outline-none focus:ring-2 focus:ring-[#8b5e34]"
              />
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-[#6f461f] to-[#8b5e34] text-white font-bold py-5 rounded-xl shadow-lg active:scale-[0.98] transition-all"
            >
              候補を探す →
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-[#f6f3f0] rounded-xl p-6 flex flex-col justify-between aspect-square relative overflow-hidden">
            <div>
              <h3 className="font-bold text-[#1b1c1a] mb-1">効率的な選定</h3>
              <p className="text-xs text-[#50443b] leading-relaxed">膨大な商品データから最適な候補を瞬時に抽出します。</p>
            </div>
          </div>
          <div className="bg-[#eae8e5] rounded-xl aspect-square flex items-center justify-center">
            <p className="text-[#50443b] text-xs font-bold text-center px-4">スコアリングで<br/>最適な商品を提案</p>
          </div>
        </section>
      </main>

      </div>
  );
}
