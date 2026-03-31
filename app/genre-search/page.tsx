import { genreCatalog } from '@/lib/genre-catalog';

export default function GenreSearchPage() {
  return (
    <main style={{ padding: '24px 16px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <section
          style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          }}
        >
          <p style={{ margin: 0, fontSize: 14, color: '#7c5c2e', fontWeight: 700 }}>
            Rakuten Select Assist
          </p>
          <h1 style={{ marginTop: 12, marginBottom: 12, fontSize: 32, lineHeight: 1.3 }}>
            genreId で候補を絞る。
          </h1>
          <p style={{ marginTop: 0, marginBottom: 24, color: '#4b5563', lineHeight: 1.7 }}>
            ジャンル名を単なるキーワードに混ぜるのではなく、楽天の genreId を使って検索する改善版です。
          </p>

          <form action="/genre-results" method="get" style={{ display: 'grid', gap: 16 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 700 }}>ジャンル</span>
              <select
                name="genreId"
                defaultValue=""
                style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db', background: '#fff' }}
              >
                <option value="">ジャンルを選択</option>
                {genreCatalog.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 700 }}>補助キーワード</span>
              <input
                name="keyword"
                type="text"
                placeholder="例: 母の日 / 冷感 / ベビーローション"
                style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db', background: '#fff' }}
              />
            </label>

            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: '14px 16px',
                borderRadius: 9999,
                border: 'none',
                background: '#8b5e34',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              候補を探す
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
