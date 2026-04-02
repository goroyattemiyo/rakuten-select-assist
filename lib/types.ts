export type ProductCandidate = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  itemUrl: string;
  shopName?: string;
  reviewCount?: number;
  reviewAverage?: number;
  score?: number;
  reasons?: string[];
};

export type SearchParams = {
  genre?: string;
  keyword?: string;
};
