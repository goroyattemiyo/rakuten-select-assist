const genreOptions = [
  'レディースファッション',
  'キッズ・ベビー・マタニティ',
  '美容・コスメ・香水',
  '食品',
  '日用品雑貨・文房具・手芸',
];

export default function HomePage() {
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
            今日紹介する商品を、
            <br />
            迷わず選ぶための下準備。
          </h1>
          <p style={{ marginTop: 0, marginBottom: 24, color: '#4b5563', lineHeight: 1.7 }}>
            楽天市場の商品候補を絞り込みやすくするためのMVPです。
            まずはジャンルとキーワードから探します。
          </p>

          <form style={{ display: 'grid', gap: 16 }}>
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 700 }}>ジャンル</span>
              <select
                defaultValue=""
                style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db', background: '#fff' }}
              >
                <option value="" disabled>
                  ジャンルを選択
                </option>
                {genreOptions.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontWeight: 700 }}>キーワード</span>
              <input
                type="text"
                placeholder="例: 母の日 ギフト / 冷感 シーツ / ベビーローション"
                style={{ padding: 12, borderRadius: 12, border: '1px solid #d1d5db', background: '#fff' }}
              />
            </label>

            <button
              type="button"
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
