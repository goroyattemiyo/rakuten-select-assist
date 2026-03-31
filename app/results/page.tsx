const mockItems = [
  {
    id: '1',
    name: '母の日向けフラワーギフトセット',
    price: 3980,
    reason: '季節性が高く、ギフト需要と相性が良い候補です。',
  },
  {
    id: '2',
    name: '冷感敷きパッド シングル',
    price: 2980,
    reason: '初夏の投稿テーマに使いやすく、価格訴求もしやすい候補です。',
  },
  {
    id: '3',
    name: 'ベビースキンケア保湿ローション',
    price: 2480,
    reason: '育児層に届きやすく、レビュー訴求にも向いています。',
  },
];

export default function ResultsPage() {
  return (
    <main style={{ padding: '24px 16px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>おすすめ候補</h1>
        <p style={{ color: '#4b5563', marginTop: 0, marginBottom: 24 }}>
          MVPでは上位候補を少数に絞って表示します。
        </p>

        <div style={{ display: 'grid', gap: 16 }}>
          {mockItems.map((item, index) => (
            <article
              key={item.id}
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              }}
            >
              <p style={{ margin: 0, color: '#8b5e34', fontWeight: 700 }}>候補 {index + 1}</p>
              <h2 style={{ marginTop: 12, marginBottom: 8, fontSize: 22 }}>{item.name}</h2>
              <p style={{ marginTop: 0, marginBottom: 12, fontWeight: 700 }}>¥{item.price.toLocaleString()}</p>
              <p style={{ marginTop: 0, marginBottom: 16, color: '#4b5563', lineHeight: 1.7 }}>{item.reason}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  style={{
                    padding: '10px 14px',
                    borderRadius: 9999,
                    border: 'none',
                    background: '#8b5e34',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  保存する
                </button>
                <button
                  type="button"
                  style={{
                    padding: '10px 14px',
                    borderRadius: 9999,
                    border: '1px solid #d1d5db',
                    background: '#fff',
                    color: '#374151',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  詳細を見る
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
