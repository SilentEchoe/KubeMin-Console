export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface App {
  id: string;
  name: string;
  alias: string;
  project: string;
  description: string;
  createTime: string;
  updateTime: string;
  icon: string;
  workflow_id: string;
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
