export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBackground: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  isPublic: boolean;
}

export interface AppListResponse {
  data: App[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AppFilters {
  search?: string;
  tags?: string[];
  myApps?: boolean;
}
