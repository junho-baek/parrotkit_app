import type { ImageSourcePropType, ImageURISource } from 'react-native';

export type AppImageSource = string | ImageSourcePropType;

export function toImageSource(source?: AppImageSource | null): ImageSourcePropType | undefined {
  if (!source) {
    return undefined;
  }

  if (typeof source === 'string') {
    return { uri: source };
  }

  return source;
}

export function imageSourceToUri(source?: AppImageSource | null) {
  if (!source) {
    return '';
  }

  if (typeof source === 'string') {
    return source;
  }

  if (Array.isArray(source)) {
    return '';
  }

  const uriSource = source as ImageURISource;
  return typeof uriSource.uri === 'string' ? uriSource.uri : '';
}
