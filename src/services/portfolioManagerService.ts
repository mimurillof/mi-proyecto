import { API_CONFIG, getApiUrl } from '../config/api';

const PORTFOLIO_MANAGER_BASE = API_CONFIG.ENDPOINTS.PORTFOLIO_MANAGER_BASE ?? '/api/portfolio-manager';

export interface PortfolioAsset {
  symbol: string;
  name?: string | null;
  units: number;
  current_price: number | null;
  position_value: number | null;
  change_percent: number | null;
  change_absolute?: number | null;
  logo_url?: string | null;
  market_cap?: number | null;
  volume?: number | null;
  weekly_performance?: number[] | null;
}

export interface PortfolioAllocationItem extends PortfolioAsset {
  allocation_percent: number;
}

export interface PortfolioSummary {
  total_value: number;
  total_change_percent: number;
  total_change_absolute: number;
  timestamp: string;
}

export interface PortfolioReport {
  generated_at: string;
  period: string;
  summary: PortfolioSummary;
  metrics?: Record<string, unknown> | null;
  assets: PortfolioAsset[];
  allocation: PortfolioAllocationItem[];
  gainers?: PortfolioAsset[];
  losers?: PortfolioAsset[];
  market_overview?: MarketOverview;
}

export interface MarketOverviewEntry {
  symbol: string;
  name?: string | null;
  exchange?: string | null;
  current_price?: number | null;
  change_percent?: number | null;
  market_cap?: number | null;
  volume?: number | null;
  logo_url?: string | null;
  weekly_performance?: number[] | null;
}

export interface MarketOverview {
  all?: MarketOverviewEntry[];
  gainers?: MarketOverviewEntry[];
  losers?: MarketOverviewEntry[];
  most_viewed?: MarketOverviewEntry[];
  most_active?: MarketOverviewEntry[];
  timestamp?: string;
}

export interface DisabledServiceResponse {
  enabled: false;
  message?: string;
}

export interface MarketOverviewEnvelope {
  status?: string;
  persisted?: boolean;
  generated_at?: string;
  market_overview?: MarketOverview | null;
  message?: string;
  enabled?: boolean;
}

export interface PortfolioManagerApiResponse {
  enabled?: boolean;
  status?: string;
  message?: string;
  data?: PortfolioReport | null;
  summary?: PortfolioSummary | null;
  market_open?: boolean;
  market?: MarketOverview | null;
  period?: string;
  last_refresh?: string;
  next_open_est?: string;
  timezone?: string;
}

export interface PortfolioSummaryEnvelope {
  enabled?: boolean;
  status?: string;
  summary: PortfolioSummary | null;
  message?: string;
  last_refresh?: string | null;
  period?: string;
  generated_at?: string;
}

export interface PortfolioWatchResponse {
  updated: boolean;
  persisted?: boolean;
  generated_at?: string | null;
  file_timestamp?: string | null;
  last_refresh?: string | null;
  status?: string;
  report?: PortfolioReport | null;
  summary?: PortfolioSummary | null;
  market_overview?: MarketOverview | null;
  enabled?: boolean;
  message?: string;
}

interface PollPortfolioOptions {
  since?: string;
  includeReport?: boolean;
  includeSummary?: boolean;
  includeMarket?: boolean;
}

interface FetchPortfolioOptions {
  period?: string;
  force?: boolean;
}

export const fetchPortfolioChartHtml = async (chartName: string): Promise<string> => {
  const endpoint = `${PORTFOLIO_MANAGER_BASE}/charts/${encodeURIComponent(chartName)}`;
  const url = getApiUrl(endpoint);

  const response = await fetch(url, {
    headers: {
      Accept: 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(`No se pudo cargar el gráfico '${chartName}': ${response.status} ${response.statusText}`);
  }

  return response.text();
};

export const getPortfolioManagerChartUrl = (chartName: string): string => {
  const endpoint = `${PORTFOLIO_MANAGER_BASE}/charts/${encodeURIComponent(chartName)}`;
  return getApiUrl(endpoint);
};

export const fetchPortfolioReport = async (
  options: FetchPortfolioOptions = {}
): Promise<PortfolioManagerApiResponse> => {
  const { period = '6mo', force = false } = options;

  const params = new URLSearchParams();
  if (period) {
    params.set('period', period);
  }
  if (force) {
    params.set('refresh', 'true');
  }

  const queryString = params.toString();
  const endpoint = `${PORTFOLIO_MANAGER_BASE}/report${queryString ? `?${queryString}` : ''}`;
  const url = getApiUrl(endpoint);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al obtener el portafolio: ${response.status} ${response.statusText}`);
  }

  const data: PortfolioManagerApiResponse = await response.json();
  return data;
};

export interface MarketOverviewResult {
  market: MarketOverview;
  generatedAt?: string;
  persisted?: boolean;
  status?: string;
}

export const fetchPortfolioMarket = async (): Promise<MarketOverviewResult> => {
  const endpoint = `${PORTFOLIO_MANAGER_BASE}/market`;
  const url = getApiUrl(endpoint);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al obtener la watchlist de mercado: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as MarketOverviewEnvelope | MarketOverview | DisabledServiceResponse;

  if ('enabled' in payload && payload.enabled === false) {
    throw new Error(payload.message ?? 'El servicio de Market Watchlist está deshabilitado.');
  }

  let market: MarketOverview | null = null;
  let metadata: MarketOverviewEnvelope | undefined;

  if ('market_overview' in payload) {
    metadata = payload as MarketOverviewEnvelope;
    market = metadata.market_overview ?? null;
  } else {
    const candidate = payload as MarketOverview;
    if (candidate && typeof candidate === 'object') {
      const hasData = [
        candidate.all,
        candidate.gainers,
        candidate.losers,
        (candidate as Record<string, unknown>).most_active,
        candidate.most_viewed,
      ].some((section) => Array.isArray(section) && section.length > 0);
      if (hasData) {
        market = candidate;
      }
    }
  }

  if (!market) {
    const message = metadata?.message ?? 'No hay datos de mercado disponibles.';
    throw new Error(message);
  }

  return {
    market,
    generatedAt: metadata?.generated_at,
    persisted: metadata?.persisted,
    status: metadata?.status,
  };
};

export const fetchPortfolioSummary = async (): Promise<PortfolioSummaryEnvelope> => {
  const endpoint = `${PORTFOLIO_MANAGER_BASE}/summary`;
  const url = getApiUrl(endpoint);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al obtener el resumen del portafolio: ${response.status} ${response.statusText}`);
  }

  const data: PortfolioSummaryEnvelope = await response.json();
  return data;
};

export const pollPortfolioUpdates = async (
  options: PollPortfolioOptions = {}
): Promise<PortfolioWatchResponse> => {
  const params = new URLSearchParams();

  if (options.since) {
    params.set('since', options.since);
  }
  if (options.includeReport) {
    params.set('include_report', 'true');
  }
  if (options.includeSummary === false) {
    params.set('include_summary', 'false');
  }
  if (options.includeMarket === false) {
    params.set('include_market', 'false');
  }

  const queryString = params.toString();
  const endpoint = `${PORTFOLIO_MANAGER_BASE}/watch${queryString ? `?${queryString}` : ''}`;
  const url = getApiUrl(endpoint);

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error al consultar actualizaciones del portafolio: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as PortfolioWatchResponse;
};
