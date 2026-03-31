import { getGenreNameById } from '@/lib/genre-catalog';
import { searchRakutenItemsByGenreId } from '@/lib/rakuten-genre-search';
import { buildReasons } from '@/lib/reason';
import { scoreProducts } from '@/lib/scoring';

type PageProps = {
  searchParams?: Promise<{
    genreId?: string;
    keyword?: string;
  }>;
};

export default async function GenreResultsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const genreId = Number(params.genreId ?? '0');
  const keyword = params.keyword?.trim() ?? '';
  const genreName = getGenreNameById(genreId);

  let items:
    | Array<{
        id: string;
        name: string;
        price: number;
        itemUrl: string;
        score?: number;
        reasons?: string[];
        shopName?: string;
      }>
    | null = null;
  let errorMessage = '';

  if (genreId > 0) {
    try {
      const rawItems = await searchRakutenItemsByGenreId({ genreId, keyword });
      items = scoreProducts(rawItems)
        .slice(0, 3)
        .map((item) => ({
          ...item,
          reasons: buildReasons(item),
        }));
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : '検索に失敗しました。';
    }
  }

  return (
    <main style={{ padding: '24px 16px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: 0, color: '#7c5c2e', fontWeight: 700 }}>genreId 検索</p>
          <h1 style={{ marginTop: 8, marginBottom: 8, fontSize: 28 }}>おすすめ候補</h1>
          <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.7 }}>
            {genreId > 0
              ? `ジャンル: ${genreName || genreId} / キーワード: ${keyword || '未指定'}`
              : 'ジャンルが未指定です。まずは検索画面から条件を選んでください。'}
          </p>
        </div>

        {genreId <= 0 ? (
          <section style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
            <p style={{ marginTop: 0, color: '#4b5563', lineHeight: 1.7 }}>
              ジャンルが選ばれていません。genreId 検索画面へ戻ってください。
            </p>
            <a href="/genre-search" style={{ color: '#8b5e34', fontWeight: 700 }}>
              検索画面へ戻る
            </a>
          </section>
        ) : null}

        {errorMessage ? (
          <section style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#9a3412' }}>検索エラー</p>
            <p style={{ marginBottom: 0, color: '#7c2d12', lineHeight: 1.7 }}>{errorMessage}</p>
          </section>
        ) : null}

        {items && items.length > 0 ? (
          <div style={{ display: 'grid', gap: 16 }}>
            {items.map((item, index) => (
              <article
                key={item.id}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <p style={{ margin: 0, color: '#8b5e34', fontWeight: 700 }}>候補 {index + 1}</p>
                  <p style={{ margin: 0, color: '#374151', fontWeight: 700 }}>スコア: {item.score ?? '-'}</p>
                </div>
                <h2 style={{ marginTop: 12, marginBottom: 8, fontSize: 22 }}>{item.name}</h2>
                <p style={{ marginTop: 0, marginBottom: 8, fontWeight: 700 }}>¥{item.price.toLocaleString()}</p>
                <p style={{ marginTop: 0, marginBottom: 16, color: '#4b5563' }}>{item.shopName ?? 'ショップ名なし'}</p>
                <ul style={{ marginTop: 0, marginBottom: 16, paddingLeft: 20, color: '#4b5563', lineHeight: 1.7 }}>
                  {(item.reasons ?? []).map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <a
                    href={item.itemUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '10px 14px',
                      borderRadius: 9999,
                      background: '#8b5e34',
                      color: '#fff',
                      fontWeight: 700,
                    }}
                  >
                    商品を見る
                  </a>
                  <a
                    href="/genre-search"
                    style={{
                      padding: '10px 14px',
                      borderRadius: 9999,
                      border: '1px solid #d1d5db',
                      background: '#fff',
                      color: '#374151',
                      fontWeight: 700,
                    }}
                  >
                    条件を変える
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {items && items.length === 0 && !errorMessage ? (
          <section style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
            <p style={{ marginTop: 0, color: '#4b5563', lineHeight: 1.7 }}>
              条件に合う商品が見つかりませんでした。キーワードを短くするか、別ジャンルで試してください。
            </p>
            <a href="/genre-search" style={{ color: '#8b5e34', fontWeight: 700 }}>
              検索画面へ戻る
            </a>
          </section>
        ) : null}
      </div>
    </main>
  );
}
