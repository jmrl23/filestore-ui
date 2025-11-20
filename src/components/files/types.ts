export interface FileData {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  size: number;
  path: string;
  mimetype: string;
  provider: string;
  url: string;
}

export interface FetchFilesResponse {
  data: {
    files: FileData[];
  };
}
