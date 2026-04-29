import * as MediaLibrary from 'expo-media-library';
import { Share } from 'react-native';

export type TakeExportResultStatus = 'saved' | 'shared' | 'cancelled' | 'denied' | 'failed';

export type TakeExportResult = {
  message: string;
  status: TakeExportResultStatus;
};

export async function saveTakeToGallery(uri: string): Promise<TakeExportResult> {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync(true, ['video']);

    if (!permission.granted) {
      return {
        message: 'Allow Photos access, then save this take again.',
        status: 'denied',
      };
    }

    await MediaLibrary.saveToLibraryAsync(uri);

    return {
      message: 'Saved to native Gallery.',
      status: 'saved',
    };
  } catch {
    return {
      message: 'Could not save this take to Gallery.',
      status: 'failed',
    };
  }
}

export async function openTakeInShareSheet(uri: string): Promise<TakeExportResult> {
  try {
    const result = await Share.share({
      message: uri,
      title: 'ParrotKit take',
      url: uri,
    });

    if (result.action === Share.dismissedAction) {
      return {
        message: 'Share sheet closed.',
        status: 'cancelled',
      };
    }

    return {
      message: 'Opened in another app.',
      status: 'shared',
    };
  } catch {
    return {
      message: 'Could not open this take.',
      status: 'failed',
    };
  }
}
