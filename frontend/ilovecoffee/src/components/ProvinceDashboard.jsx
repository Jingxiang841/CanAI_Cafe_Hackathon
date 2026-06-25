import { useMemo } from 'react';
import { Box, Chip, Typography } from '@mui/material';

import dashboardConfig from '../config/dashboardConfig';
import provinceDashboardData from '../data/provinceDashboardData';

import ForecastSalesChart from './ForecastSalesChart';
import MetricCard from './MetricCard';
import OrderTypePerformanceChart from './OrderTypePerformanceChart';
import ProductPerformanceChart from './ProductPerformanceChart';
import RecommendationCard from './RecommendationCard';
import SalesTrendChart from './SalesTrendChart';

export default function ProvinceDashboard({
  selectedProvinceId,
  selectedMonthRange,
  selectedDrink,
  onChangeDrink,
}) {
  const fallbackProvinceId = dashboardConfig.provinces[0].id;

  const selectedProvince = useMemo(() => {
    const filterItems = [...dashboardConfig.provinces, dashboardConfig.overall];

    return (
      filterItems.find((item) => item.id === selectedProvinceId) ||
      dashboardConfig.provinces[0]
    );
  }, [selectedProvinceId]);

  const dashboardData =
    provinceDashboardData[selectedProvinceId] ||
    provinceDashboardData[fallbackProvinceId];

  const getMonthLabel = (monthValue) => {
    const month = dashboardConfig.monthFilter.availableMonths.find(
      (availableMonth) => availableMonth.value === monthValue
    );

    return month?.label || '';
  };

  const monthRangeLabel =
    selectedMonthRange?.startMonth && selectedMonthRange?.endMonth
      ? `${getMonthLabel(selectedMonthRange.startMonth)} — ${getMonthLabel(
          selectedMonthRange.endMonth
        )}`
      : dashboardConfig.monthFilter.emptyLabel;

  return (
    <Box
      key={selectedProvinceId}
      sx={{
        maxWidth: dashboardConfig.layout.pageMaxWidth,
        mx: 'auto',
        animation: 'fadeSlideUp 0.45s ease both',
      }}
    >
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: {
            xs: 'flex-start',
            md: 'center',
          },
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 950,
              color: 'var(--text-heading)',
              fontSize: {
                xs: '2rem',
                md: '2.75rem',
              },
              letterSpacing: '-0.04em',
            }}
          >
            {dashboardConfig.dashboardTitle}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'var(--text-muted)',
              mt: 1,
              maxWidth: '850px',
              fontSize: '1rem',
              lineHeight: 1.7,
            }}
          >
            {dashboardConfig.dashboardSubtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: {
              xs: 'flex-start',
              md: 'flex-end',
            },
            gap: 1,
          }}
        >
          {selectedDrink && (
            <Chip
              label={`Selected: ${selectedDrink.name}`}
              onDelete={onChangeDrink}
              sx={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--text-heading)',
                fontWeight: 900,
                height: 34,
                borderRadius: '999px',
                border: '1px solid var(--border)',

                '& .MuiChip-deleteIcon': {
                  color: 'var(--primary)',

                  '&:hover': {
                    color: 'var(--primary-dark)',
                  },
                },
              }}
            />
          )}

          <Chip
            label={selectedProvince.label}
            sx={{
              background:
                'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              color: '#ffffff',
              fontWeight: 900,
              px: 1,
              height: 38,
              borderRadius: '999px',
              boxShadow: 'var(--shadow-sm)',
            }}
          />

          <Typography
            variant="caption"
            sx={{
              color: 'var(--text-muted)',
              fontWeight: 800,
            }}
          >
            {monthRangeLabel}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: '1fr 1fr 1.35fr',
          },
          gap: dashboardConfig.layout.dashboardGap,
          mb: dashboardConfig.layout.dashboardGap,
          alignItems: 'stretch',
        }}
      >
        <MetricCard
          label={dashboardConfig.cards.revenue.label}
          value={dashboardData.metrics.revenue}
          prefix={dashboardConfig.cards.revenue.prefix}
        />

        <MetricCard
          label={dashboardConfig.cards.orders.label}
          value={dashboardData.metrics.orders}
        />

        <RecommendationCard recommendations={dashboardData.recommendations} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            xl: '2fr 1fr',
          },
          gap: dashboardConfig.layout.dashboardGap,
          mb: dashboardConfig.layout.dashboardGap,
          alignItems: 'stretch',
        }}
      >
        <SalesTrendChart data={dashboardData.salesTrend} />

        <OrderTypePerformanceChart
          data={dashboardData.orderTypePerformance}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1fr 1fr',
          },
          gap: dashboardConfig.layout.dashboardGap,
          alignItems: 'stretch',
        }}
      >
        <ProductPerformanceChart data={dashboardData.productPerformance} />

        <ForecastSalesChart data={dashboardData.forecastSales} />
      </Box>
    </Box>
  );
}