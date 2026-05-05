const fallbackImages = {
  appDemo:
    "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=540&h=960&q=86",
  beautyHero:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=540&h=960&q=86",
  beautyResult:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=540&h=960&q=86",
  foodPromo:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=540&h=960&q=86",
};

function isReactNativeRuntime() {
  return (
    typeof navigator !== "undefined" && navigator.product === "ReactNative"
  );
}

function resolveImage(asset: () => number, fallbackUri: string) {
  if (!isReactNativeRuntime()) return fallbackUri;
  const { Image } = require("react-native") as typeof import("react-native");
  return Image.resolveAssetSource(asset()).uri;
}

function resolveVideo(asset: () => number) {
  if (!isReactNativeRuntime()) return undefined;
  return asset();
}

export const ugcMedia = {
  appDemo: {
    image: resolveImage(
      () => require("../../../assets/mock-media/ugc-app-demo.png"),
      fallbackImages.appDemo,
    ),
    video: resolveVideo(
      () => require("../../../assets/mock-media/ugc-app-demo.mp4"),
    ),
  },
  beautyHero: {
    image: resolveImage(
      () => require("../../../assets/mock-media/ugc-beauty-hero.png"),
      fallbackImages.beautyHero,
    ),
    video: resolveVideo(
      () => require("../../../assets/mock-media/ugc-beauty-hero.mp4"),
    ),
  },
  beautyResult: {
    image: resolveImage(
      () => require("../../../assets/mock-media/ugc-beauty-result.png"),
      fallbackImages.beautyResult,
    ),
    video: resolveVideo(
      () => require("../../../assets/mock-media/ugc-beauty-result.mp4"),
    ),
  },
  foodPromo: {
    image: resolveImage(
      () => require("../../../assets/mock-media/ugc-food-promo.png"),
      fallbackImages.foodPromo,
    ),
    video: resolveVideo(
      () => require("../../../assets/mock-media/ugc-food-promo.mp4"),
    ),
  },
} as const;
