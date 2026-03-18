import React from 'react';

type MetricPill = {
  icon?: React.ReactNode;
  value: React.ReactNode;
  className?: string;
};

interface ShortVideoCardProps {
  thumbnail: string;
  thumbnailAlt: string;
  title: string;
  subtitle: string;
  onPreview: () => void;
  onAction: () => void;
  actionLabel: string;
  actionIcon?: React.ReactNode;
  actionMeta?: React.ReactNode;
  actionClassName?: string;
  actionStyle?: React.CSSProperties;
  containerClassName?: string;
  imageClassName?: string;
  topLeftBadge?: React.ReactNode;
  topRightBadge?: React.ReactNode;
  leftMetric?: MetricPill;
  rightMetric?: MetricPill;
  showPlayButton?: boolean;
  fallbackContent?: React.ReactNode;
}

export const ShortVideoCard: React.FC<ShortVideoCardProps> = ({
  thumbnail,
  thumbnailAlt,
  title,
  subtitle,
  onPreview,
  onAction,
  actionLabel,
  actionIcon,
  actionMeta,
  actionClassName = 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-105 border-2 border-gray-200',
  actionStyle,
  containerClassName = '',
  imageClassName = '',
  topLeftBadge,
  topRightBadge,
  leftMetric,
  rightMetric,
  showPlayButton = true,
  fallbackContent,
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className={`group ${containerClassName}`}>
      <button
        type="button"
        onClick={onPreview}
        className="block w-full text-left relative cursor-pointer"
      >
        <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[9/16] mb-2.5 ring-2 ring-transparent group-hover:ring-blue-400 transition-all duration-300">
          {thumbnail && !imageError ? (
            <img
              src={thumbnail}
              alt={thumbnailAlt}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${imageClassName}`}
              onError={() => setImageError(true)}
            />
          ) : (
            fallbackContent || (
              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                <div className="text-white text-4xl">🎥</div>
              </div>
            )
          )}

          {showPlayButton && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

          {topLeftBadge ? <div className="absolute top-2 left-2">{topLeftBadge}</div> : null}
          {topRightBadge ? <div className="absolute top-2 right-2">{topRightBadge}</div> : null}

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white font-bold text-sm line-clamp-2 mb-1.5 drop-shadow-lg">{title}</p>
            <p className="text-gray-200 text-xs mb-2 drop-shadow-md">{subtitle}</p>
            <div className="flex items-center justify-between text-white text-xs gap-2">
              {leftMetric ? (
                <span className={`flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg ${leftMetric.className || ''}`}>
                  {leftMetric.icon}
                  {leftMetric.value}
                </span>
              ) : (
                <span />
              )}
              {rightMetric ? (
                <span className={`flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg ${rightMetric.className || ''}`}>
                  {rightMetric.icon}
                  {rightMetric.value}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onAction();
        }}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-md ${actionClassName}`}
        style={actionStyle}
      >
        {actionIcon}
        <span>{actionLabel}</span>
        {actionMeta ? <span className="text-xs opacity-75">{actionMeta}</span> : null}
      </button>
    </div>
  );
};
