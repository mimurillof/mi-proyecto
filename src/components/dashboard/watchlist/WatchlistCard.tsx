import React, { useEffect, useMemo, useState } from 'react';
import {
    Typography,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import './WatchlistCard.css';
import {
    fetchPortfolioMarket,
    MarketOverviewEntry,
    MarketOverviewResult,
} from '../../../services/portfolioManagerService';
import WatchlistItemIcon from './WatchlistItemIcon';

export type WatchlistCategory = 'viewed' | 'gainer' | 'loser' | 'active';

interface WatchlistItem {
    name: string;
    ticker: string;
    displaySymbol: string;
    price: number;
    change: number;
    logoUrl?: string | null;
    type: WatchlistCategory;
}

const WatchlistCard: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        let mounted = true;

        const loadWatchlist = async () => {
            setLoading(true);
            setError(null);

            try {
                const { market }: MarketOverviewResult = await fetchPortfolioMarket();

                if (!mounted) {
                    return;
                }

                const flattenList = (
                    list: MarketOverviewEntry[] | undefined,
                    type: WatchlistCategory,
                ): WatchlistItem[] => {
                    if (!Array.isArray(list)) {
                        return [];
                    }

                    return list
                        .filter((entry): entry is MarketOverviewEntry => Boolean(entry?.symbol))
                        .map((entry) => {
                            const ticker = entry.symbol ?? '';
                            const displaySymbol = entry.exchange
                                ? `${entry.exchange} ${ticker}`
                                : ticker;

                            return {
                                name: entry.name ?? ticker,
                                ticker,
                                displaySymbol,
                        price: entry.current_price ?? 0,
                        change: entry.change_percent ?? 0,
                                logoUrl: entry.logo_url ?? null,
                                type,
                            };
                        });
                };

                const viewed = flattenList(market.most_viewed, 'viewed');
                const gainers = flattenList(market.gainers, 'gainer');
                const losers = flattenList(market.losers, 'loser');
                const actives = flattenList((market as MarketOverview & { most_active?: MarketOverviewEntry[] }).most_active, 'active');

                const combined = [...viewed, ...gainers, ...losers, ...actives];

                setItems(combined);
            } catch (err) {
                console.error('Error al cargar watchlist:', err);
                if (!mounted) {
                    return;
                }
                const message = err instanceof Error ? err.message : 'Error desconocido al cargar la watchlist.';
                setError(message);
                setItems([]);
            } finally {
                if (mounted) {
                setLoading(false);
                }
            }
        };

        loadWatchlist();

        return () => {
            mounted = false;
        };
    }, []);

    const filteredItems = useMemo(() => {
        if (items.length === 0) {
            return [];
        }

        switch (selectedTab) {
            case 1: {
                return items
                    .filter((item) => item.type === 'gainer')
                    .sort((a, b) => (b.change ?? 0) - (a.change ?? 0));
            }
            case 2: {
                return items
                    .filter((item) => item.type === 'loser')
                    .sort((a, b) => (a.change ?? 0) - (b.change ?? 0));
            }
            case 0:
            default: {
                const viewedItems = items.filter((item) => item.type === 'viewed');
                 return viewedItems.length > 0 ? viewedItems : items;
            }
        }
    }, [items, selectedTab]);

    if (loading) {
        return (
            <div className="watchlistContainer">
                <div className="headerRow">
                    <Typography variant="h6" component="div" className="watchlistTitle">
                        Watchlist
                    </Typography>
                </div>
                <div className="watchlist-feedback">Cargando watchlist…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="watchlistContainer">
                <div className="headerRow">
                    <Typography variant="h6" component="div" className="watchlistTitle">
                        Watchlist
                    </Typography>
                </div>
                <div className="watchlist-feedback watchlist-feedback--error">{error}</div>
            </div>
        );
    }

    if (filteredItems.length === 0) {
        return (
            <div className="watchlistContainer">
                <div className="headerRow">
                    <Typography variant="h6" component="div" className="watchlistTitle">
                        Watchlist
                    </Typography>
                </div>
                <div className="watchlist-feedback">No hay datos disponibles.</div>
            </div>
        );
    }

    return (
        <div className="watchlistContainer">
            <div className="headerRow">
                <Typography variant="h6" component="div" className="watchlistTitle">
                    Watchlist
                </Typography>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    aria-label="Watchlist filter tabs"
                    className="filterTabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{ minHeight: '30px' }}
                >
                    <Tab label="Most Viewed" />
                    <Tab label="Gainers" />
                    <Tab label="Losers" />
                </Tabs>
            </div>

            <div className="watchlistScrollableList">
                <List>
                    {filteredItems.map((item) => {
                        const isPositive = item.change > 0;
                        const ChangeIcon = isPositive ? ArrowUpwardIcon : ArrowDownwardIcon;

                        return (
                            <ListItem key={`${item.ticker}-${item.type}`} disablePadding>
                                <ListItemIcon>
                                    <WatchlistItemIcon symbol={item.ticker} logoUrl={item.logoUrl} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.name}
                                    secondary={item.displaySymbol}
                                    primaryTypographyProps={{ className: 'MuiListItemText-primary' }}
                                    secondaryTypographyProps={{ className: 'MuiListItemText-secondary' }}
                                />
                                <div className="priceChangeContainer">
                                    <Typography variant="body1" component="span" className="itemPrice">
                                        ${item.price.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        component="span"
                                        className={`itemChange ${isPositive ? 'itemChangePositive' : 'itemChangeNegative'}`}
                                    >
                                        <ChangeIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle' }} />
                                        {`${isPositive ? '+' : ''}${Math.abs(item.change).toFixed(2)}%`}
                                    </Typography>
                                </div>
                            </ListItem>
                        );
                    })}
                </List>
            </div>
        </div>
    );
};

export default WatchlistCard;
