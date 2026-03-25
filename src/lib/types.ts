export interface RoastFix {
  title: string;
  description: string;
}

export interface RoastResult {
  roast: string;
  severity: number;
  fixes: RoastFix[];
}

export interface RepoFile {
  path: string;
  content: string;
  size: number;
}

export interface FetchRepoResult {
  owner: string;
  repo: string;
  files: RepoFile[];
}