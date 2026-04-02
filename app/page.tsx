'use client';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { genreCatalog } from '@/lib/genre-catalog';

export default function HomePage() {
  const router = useRouter();
  const [genre, setGenre] = useState('');
  const [keyword, setKeyword] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [suggesting, setSuggesting] = useState(false);

  function handleSearch() {
    if (!keyword.trim() && !genre) {
      alert('ジャンルまたはキーワードを入力してください。');
      return;
    }
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (genre) params.set('genre', genre);
    router.push(`/results?${params.toString()}`);
  }

  async function handleSuggest() {
    if (!aiInput.trim() || suggesting) return;
    setSuggesting(true);
    setSuggestions([]);
    setSelectedSuggestions(new Set());
    try {
      const res = await fetch('/api/suggest-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: aiInput.trim() }),
      });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      if (Array.isArray(data.keywords)) {
        setSuggestions(data.keywords);
      }
    } catch {
      // 失敗時は何も表示しない
    } finally {
      setSuggesting(false);
    }
  }

  function handleToggleSuggestion(kw: string) {
    setSelectedSuggestions((prev) => {
      const next = new Set(prev);
      if (next.has(kw)) {
        next.delete(kw);
      } else {
        next.add(kw);
      }
      // 選択中のキーワードをスペース区切りで検索窓に反映
      const selected = suggestions.filter((s) => next.has(s));
      setKeyword(selected.join(' '));
      return next;
    });
  }

  return (
    <div className="min-h-screen font-[Manrope,sans-serif]" style={{background: "linear-gradient(135deg, #fff8f0 0%, #fef3e2 40%, #fde8c8 100%)"}}>
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 backdrop-blur-md" style={{background: "rgba(255,248,240,0.85)"}}>
        <div className="flex items-center gap-2">
          <Image src="/icon.png" alt="icon" width={28} height={28} className="rounded-lg" />
          <h1 className="text-lg font-bold text-[#8b5e34] tracking-tight">Rakuten Select Assist</h1>
        </div>
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

        {/* AI キーワード提案 */}
        <section className="rounded-2xl p-6 mb-6" style={{background: "linear-gradient(160deg, #ffffff 0%, #fff8f0 100%)", boxShadow: "0 8px 32px rgba(139,94,52,0.12), inset 0 1px 0 rgba(255,255,255,0.9)"}}>
          <p className="text-sm font-bold text-[#50443b] mb-3">✨ AIにキーワードを提案してもらう</p>
          <p className="text-xs text-[#83746a] mb-4">「今日紹介したい商品のイメージ」を自由に入力してください</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSuggest()}
              placeholder="例: 夏に使える日焼け止め、プレゼントに喜ばれるもの"
              className="flex-1 bg-[#eae8e5] border-none rounded-xl px-4 py-3 text-sm text-[#1b1c1a] placeholder:text-[#83746a] font-medium focus:outline-none focus:ring-2 focus:ring-[#8b5e34]"
            />
            <button
              type="button"
              onClick={handleSuggest}
              disabled={suggesting || !aiInput.trim()}
              className="px-4 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
              style={{
                background: suggesting || !aiInput.trim() ? '#c8b49a' : 'linear-gradient(135deg, #c17f3e 0%, #8b5e34 100%)',
                cursor: suggesting || !aiInput.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {suggesting ? '…' : '提案'}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-[#83746a] mb-2">タップして選択・もう一度タップで解除：</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((kw) => {
                  const isSelected = selectedSuggestions.has(kw);
                  return (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => handleToggleSuggestion(kw)}
                      className="px-3 py-2 rounded-full text-sm font-bold border transition-all active:scale-95"
                      style={{
                        borderColor: '#c17f3e',
                        color: isSelected ? 'white' : '#8b5e34',
                        background: isSelected ? 'linear-gradient(135deg, #c17f3e 0%, #8b5e34 100%)' : 'white',
                      }}
                    >
                      {kw}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* 検索フォーム */}
        <section className="rounded-2xl p-8 mb-10" style={{background: "linear-gradient(160deg, #ffffff 0%, #fff8f0 100%)", boxShadow: "0 8px 32px rgba(139,94,52,0.12), inset 0 1px 0 rgba(255,255,255,0.9)"}}>
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="例: 秋物 ワンピース、オーガニック"
                className="w-full bg-[#eae8e5] border-none rounded-xl px-5 py-4 text-[#1b1c1a] placeholder:text-[#83746a] font-medium focus:outline-none focus:ring-2 focus:ring-[#8b5e34]"
              />
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="w-full flex items-center justify-center gap-3 text-white font-bold py-5 rounded-xl active:scale-[0.98] transition-all"
              style={{background: "linear-gradient(135deg, #c17f3e 0%, #8b5e34 50%, #6f461f 100%)", boxShadow: "0 4px 20px rgba(139,94,52,0.4), 0 1px 0 rgba(255,255,255,0.2) inset"}}
            >
              候補を探す →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
