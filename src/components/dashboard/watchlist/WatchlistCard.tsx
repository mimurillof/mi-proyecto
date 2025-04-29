import React, { useState, useMemo } from 'react';
import {
    Typography, Tabs, Tab, Box,
    List, ListItem, ListItemIcon, ListItemText, Icon
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import './WatchlistCard.css'; // Importar los estilos CSS

// --- Tipos y Datos de Ejemplo ---
interface WatchlistItem {
    name: string;
    symbol: string;
    price: number;
    change: number;
    logoIcon: string; // Nombre del icono de Material Icons
    type: 'viewed' | 'gainer' | 'loser';
}

const initialWatchlistItems: WatchlistItem[] = [
    { name: "Spotify", symbol: "NYSE SPOT", price: 230.50, change: 2.34, logoIcon: "music_note", type: 'viewed' },
    { name: "Amazon", symbol: "NYSE AMZN", price: 185.10, change: -1.15, logoIcon: "shopping_bag", type: 'viewed' },
    { name: "Tesla", symbol: "NASDAQ TSLA", price: 175.80, change: 3.10, logoIcon: "electric_car", type: 'gainer' },
    { name: "Apple", symbol: "NASDAQ AAPL", price: 190.30, change: 0.85, logoIcon: "apple", type: 'gainer' },
    { name: "Nio", symbol: "NYSE NIO", price: 4.50, change: -5.20, logoIcon: "ev_station", type: 'loser' },
    { name: "Microsoft", symbol: "NASDAQ MSFT", price: 420.70, change: 1.50, logoIcon: "important_devices", type: 'viewed' },
    { name: "Nvidia", symbol: "NASDAQ NVDA", price: 910.00, change: 4.55, logoIcon: "memory", type: 'gainer' },
    { name: "Boeing", symbol: "NYSE BA", price: 178.20, change: -3.80, logoIcon: "flight", type: 'loser' },
    { name: "Netflix", symbol: "NASDAQ NFLX", price: 615.30, change: 1.95, logoIcon: "theaters", type: 'gainer' },
    { name: "AMD", symbol: "NASDAQ AMD", price: 160.50, change: -0.75, logoIcon: "developer_board", type: 'loser' },
    { name: "Disney", symbol: "NYSE DIS", price: 105.10, change: 0.25, logoIcon: "movie", type: 'viewed' },
    { name: "PayPal", symbol: "NASDAQ PYPL", price: 63.80, change: -2.10, logoIcon: "paypal", type: 'loser' }, // Nota: 'paypal' no es un icono estándar de Material Icons. Podrías necesitar un icono personalizado o uno genérico.
    { name: "Salesforce", symbol: "NYSE CRM", price: 270.90, change: 1.10, logoIcon: "cloud", type: 'gainer' },
    { name: "Intel", symbol: "NASDAQ INTC", price: 30.50, change: -1.55, logoIcon: "memory", type: 'loser' },
];

// --- Componente Principal ---
const WatchlistCard: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0); // 0: Most Viewed, 1: Gainers, 2: Losers

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    // Filtrar items basado en la pestaña seleccionada
    const filteredItems = useMemo(() => {
        switch (selectedTab) {
            case 1: // Gainers
                return initialWatchlistItems.filter(item => item.change > 0).sort((a, b) => b.change - a.change); // Ordenar por mayor ganancia
            case 2: // Losers
                return initialWatchlistItems.filter(item => item.change < 0).sort((a, b) => a.change - b.change); // Ordenar por mayor pérdida
            case 0: // Most Viewed (o todos si no hay tipo 'viewed')
            default:
                 const viewedItems = initialWatchlistItems.filter(item => item.type === 'viewed');
                 // Si no hay 'viewed', mostrar todos como fallback (o podrías dejarlos vacíos)
                 return viewedItems.length > 0 ? viewedItems : initialWatchlistItems;
        }
    }, [selectedTab]);

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
                            <ListItem key={item.symbol} disablePadding> {/* Añadir disablePadding si se maneja en CSS */}
                                <ListItemIcon>
                                    {/* Usar Icon de MUI para mostrar el icono por nombre */}
                                    <Icon>{item.logoIcon || 'inventory_2'}</Icon> {/* inventory_2 como fallback */}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.name}
                                    secondary={item.symbol}
                                    primaryTypographyProps={{ className: 'MuiListItemText-primary' }}
                                    secondaryTypographyProps={{ className: 'MuiListItemText-secondary' }}
                                />
                                <div className="priceChangeContainer">
                                    <Typography variant="body1" component="span" className="itemPrice">
                                        ${item.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        component="span"
                                        className={`itemChange ${isPositive ? 'itemChangePositive' : 'itemChangeNegative'}`}
                                    >
                                        <ChangeIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle' }} /> {/* Ajustar icono */}
                                        {Math.abs(item.change).toFixed(2)}%
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
