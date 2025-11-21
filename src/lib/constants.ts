/**
 * Supported storage provider configurations
 */
export const PROVIDERS = [
  { label: 'Google Cloud', value: 'google-cloud-storage' },
  { label: 'ImageKit', value: 'imagekit' },
] as const;

/**
 * Type representing a valid provider value
 */
export type ProviderValue = (typeof PROVIDERS)[number]['value'];
