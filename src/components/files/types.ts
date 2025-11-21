/**
 * Valid storage provider values as defined by the API
 */
export type Provider = 'google-cloud-storage' | 'imagekit';

/**
 * Represents a single file in the filestore
 */
export interface FileData {
  /** Unique identifier for the file */
  id: string;
  /** ISO 8601 timestamp of when the file was created */
  createdAt: string;
  /** ISO 8601 timestamp of when the file was last updated */
  updatedAt: string;
  /** File name including extension */
  name: string;
  /** File size in bytes */
  size: number;
  /** File path/location in storage */
  path: string;
  /** MIME type of the file (e.g., 'image/jpeg', 'application/pdf') */
  mimetype: string;
  /** Storage provider name (e.g., 'google-cloud-storage', 'imagekit') */
  provider: Provider | string;
  /** Public URL to access the file */
  url: string;
}

/**
 * API response structure for fetching files
 */
export interface FetchFilesResponse {
  data: {
    files: FileData[];
  };
}

/**
 * Filter parameters for file queries
 * Updated to match the latest filestore API schema
 */
export interface FileFilterParams {
  /** Array of file IDs to filter by */
  id?: string[];
  /** Filter files created from this date (ISO 8601) */
  createdAtFrom?: string;
  /** Filter files created until this date (ISO 8601) */
  createdAtTo?: string;
  /** Storage provider (google-cloud-storage, imagekit) */
  provider?: Provider;
  /** File location/path filter */
  location?: string;
  /** MIME type filter */
  mimetype?: string;
  /** File name filter */
  name?: string;
  /** Minimum file size in bytes */
  sizeFrom?: number;
  /** Maximum file size in bytes */
  sizeTo?: number;
  /** Maximum number of results to return */
  limit?: number;
  /** Number of results to skip (pagination) */
  offset?: number;
  /** Sort order (asc or desc) */
  order?: 'asc' | 'desc';
  /** Force revalidation of cached data */
  revalidate?: boolean;
}
