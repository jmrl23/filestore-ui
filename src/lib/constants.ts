export const PROVIDERS = [
  { label: 'Google Cloud', value: 'google-cloud-storage' },
  { label: 'ImageKit', value: 'imagekit' },
] as const;

export type ProviderValue = (typeof PROVIDERS)[number]['value'];
