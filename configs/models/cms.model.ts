export interface Category {
  desc: string;
  id: string;
  seoData: {
    description: string;
    keywords: string;
    title: string;
  };
  slug: string;
  subCategories: Category[];
  title: string;
  type: string;
  underCategory?: Category;
  underCategoryId?: string;
}

export interface Tag {
  desc: string;
  id: string;
  seoData: {
    description: string;
    keywords: string;
    title: string;
  };
  slug: string;
  title: string;
}

export interface Article {
  category: Category;
  categoryId: string;
  content: string;
  id: string;
  imageSrc: string;
  imageUrl: string;
  linkedProductIds: string[];
  publishedTime: string;
  seoData: {
    description: string;
    keywords: string;
    title: string;
  };
  shortDesc: string;
  slug: string;
  tagIds: string[];
  title: string;
}
