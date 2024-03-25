import APIResponse from '@configs/types/api-response.type';
import BaseClient from './BaseClient';
import { Category, Article, Tag } from '@configs/models/cms.model';
import { CombinedGetParams } from '@configs/models/utils.model';

export class CmsClient extends BaseClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(ctx: any, data: any) {
    super(ctx, data);
  }

  async getCMSCategories(
    payload: CombinedGetParams<
      object,
      {
        id?: string;
        slug?: string;
        title?: string;
        type?: 'BLOG' | 'PAGE';
        loadLevel?: 0 | 1 | 2;
      }
    >
  ): Promise<APIResponse<Category[]>> {
    return await super.callStg('GET', 'cms/v1/web/category', payload);
  }

  async getCMSTags(
    payload: CombinedGetParams<
      object,
      {
        id?: string;
        ids?: string[];
        slug?: string;
        status?: string;
        title?: string;
      }
    >
  ): Promise<APIResponse<Tag[]>> {
    return await super.callStg('GET', 'cms/v1/web/tag', payload);
  }

  async getArticles(
    payload: CombinedGetParams<
      {
        listCategoryIds?: string[];
        id?: string;
        slug?: string;
        title?: string;
        categoryId?: string;
        tagIds?: string[];
        status?: string;
        creatorId?: string;
        createdTimeFrom?: string;
        createdTimeTo?: string;
        updatedTimeFrom?: string;
        type?: 'BLOG' | 'PAGE';
        updatedTimeTo?: string;
        publishedTimeFrom?: string;
        publishedTimeTo?: string;
      },
      object
    >
  ): Promise<APIResponse<Article[]>> {
    return await super.callStg('GET', 'cms/v1/web/article', payload);
  }
}
