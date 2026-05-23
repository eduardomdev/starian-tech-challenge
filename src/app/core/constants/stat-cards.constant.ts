import type { StatCard } from '@shared/interfaces/stats-card.interface';

export const STAT_CARDS: Omit<StatCard, 'value'>[] = [
  {
    title: 'Total de Produtos',
    description: 'No catálogo',
    iconName: 'deployed_code',
    iconColor: '#7c3aed',
    iconBgColor: '#ede9fe',
  },
  {
    title: 'Categorias',
    description: 'Tipos de produto',
    iconName: 'sell',
    iconColor: '#16a34a',
    iconBgColor: '#dcfce7',
  },
  {
    title: 'Preço Médio',
    description: 'Entre todos os produtos',
    iconName: 'attach_money',
    iconColor: '#d97706',
    iconBgColor: '#fef3c7',
  },
  {
    title: 'Melhor Avaliado',
    description: 'Item mais bem avaliado',
    iconName: 'star',
    iconColor: '#dc2626',
    iconBgColor: '#fee2e2',
  },
];
