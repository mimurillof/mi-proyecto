/**
 * Servicio para obtener la información de la sección de inicio.
 */

import { API_CONFIG } from '../config/api';

export type SentimentBucket = 'extreme-fear' | 'fear' | 'neutral' | 'greed' | 'extreme-greed';

export interface MarketSentiment {
  value: number | null;
  description: string;
  bucket: SentimentBucket;
}

export interface NewsItem {
  uuid?: string;
  title?: string;
  subtitle?: string;
  summary?: string;
  source?: string | null;
  url?: string;
  image_url?: string;
  published_at?: string;
  type?: string;
}

export interface HighlightCard {
  id?: string;
  type: 'reddit' | 'tradingview';
  layout: 'small' | 'large';
  badge: string;
  title: string;
  description?: string;
  body?: string;
  image_url?: string;
  url?: string;
  primary_stat_label?: string;
  primary_stat_value?: string | null;
  secondary_stat_label?: string;
  secondary_stat_value?: string | null;
  cta_label?: string;
  published_at?: string;
  score?: number;
}

export interface Highlights {
  small_cards: HighlightCard[];
  large_cards: HighlightCard[];
}

export interface HomeDashboardResponse {
  updated_at: string;
  source?: string;
  market_sentiment: MarketSentiment;
  portfolio_news: NewsItem[];
  highlights: Highlights;
}

const HOME_DASHBOARD_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOME_DASHBOARD}`;

export const fetchHomeDashboard = async (): Promise<HomeDashboardResponse> => {
  const response = await fetch(HOME_DASHBOARD_URL);

  if (!response.ok) {
    throw new Error(`Error al obtener datos de inicio: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as HomeDashboardResponse;
  return data;
};
