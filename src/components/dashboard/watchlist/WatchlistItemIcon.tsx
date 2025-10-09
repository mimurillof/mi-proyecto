import React, { useState } from 'react';
import { Avatar } from '@mui/material';

interface WatchlistItemIconProps {
  symbol: string;
  logoUrl?: string | null;
}

const FALLBACK_COLORS = [
  '#1f2937',
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#0f766e',
  '#ca8a04',
];

const getFallbackColor = (symbol: string): string => {
  if (!symbol) {
    return FALLBACK_COLORS[0];
  }
  const code = symbol
    .toUpperCase()
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_COLORS[code % FALLBACK_COLORS.length];
};

const WatchlistItemIcon: React.FC<WatchlistItemIconProps> = ({ symbol, logoUrl }) => {
  const [imageError, setImageError] = useState(false);
  const showImage = Boolean(logoUrl && !imageError);

  return (
    <Avatar
      src={showImage ? logoUrl ?? undefined : undefined}
      alt={`${symbol} logo`}
      sx={{
        width: 32,
        height: 32,
        fontSize: '0.8rem',
        bgcolor: showImage ? 'transparent' : getFallbackColor(symbol),
      }}
      imgProps={{
        loading: 'lazy',
        onError: () => setImageError(true),
        style: { objectFit: 'contain', padding: showImage ? '2px' : undefined },
      }}
    >
      {!showImage ? symbol.slice(0, 2).toUpperCase() : null}
    </Avatar>
  );
};

export default WatchlistItemIcon;

