import type { StatCard } from '@shared/interfaces/stats-card.interface';

export const STAT_CARDS: Omit<StatCard, 'value'>[] = [
  {
    key: 'total',
    title: 'Total de produtos',
    description: 'No catálogo',
    iconName: 'deployed_code',
    iconColor: '#7c3aed',
    iconBgColor: '#ede9fe',
  },
  {
    key: 'categories',
    title: 'Categorias',
    description: 'Tipos de produto',
    iconName: 'sell',
    iconColor: '#16a34a',
    iconBgColor: '#dcfce7',
  },
  {
    key: 'avgPrice',
    title: 'Preço médio',
    description: 'Entre todos os produtos',
    iconName: 'attach_money',
    iconColor: '#d97706',
    iconBgColor: '#fef3c7',
  },
  {
    key: 'bestRate',
    title: 'Melhor avaliado',
    description: 'Item mais bem avaliado',
    iconName: 'star',
    iconColor: '#dc2626',
    iconBgColor: '#fee2e2',
  },
];
