import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';

import dashboardConfig from '../config/dashboardConfig';
import {
  fetchOverallForecastPredictions,
  fetchProvinceForecastPredictions,
  fetchTransactions,
} from '../mockApi/cafeSalesMockApi';

import ForecastSalesChart from './ForecastSalesChart';
import MetricCard from './MetricCard';
import OrderTypePerformanceChart from './OrderTypePerformanceChart';
import ProductPerformanceChart from './ProductPerformanceChart';
import RecommendationCard from './RecommendationCard';
import SalesTrendChart from './SalesTrendChart';

const MONTH_LABELS = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

const monthFromDate = (dateValue) => {
  if (!dateValue) return null;
  return dateValue.slice(5, 7);
};

const aggregateForecastByMonth = (rows) => {
  const byMonth = new Map();

  rows.forEach((row) => {
    if (!row.month) {
      return;
    }

    const current = byMonth.get(row.month) || 0;
    byMonth.set(row.month, current + row.predictedRevenue);
  });

  return byMonth;
};

const buildRecommendations = ({
  allTransactions,
  filteredTransactions,
  selectedProvince,
}) => {
  if (!filteredTransactions.length) {
    return [
      'No transactions found for this province/month filter. Broaden the month range to recover actionable insights.',
      'Check store operations and data collection for missing records in the selected period.',
      'Run a short campaign in nearby high-performing provinces, then compare uplift in the next month.',
    ];
  }

  const revenueByProvince = new Map();
  allTransactions.forEach((record) => {
    const currentRevenue = revenueByProvince.get(record.province) || 0;
    revenueByProvince.set(record.province, currentRevenue + record.totalSpent);
  });

  const topProvinceEntry = Array.from(revenueByProvince.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const productByQuantity = new Map();
  filteredTransactions.forEach((record) => {
    const currentQty = productByQuantity.get(record.item) || 0;
    productByQuantity.set(record.item, currentQty + record.quantity);
  });

  const topProductEntry = Array.from(productByQuantity.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const locationCounts = filteredTransactions.reduce(
    (acc, record) => {
      if (record.location === 'In-store') {
        acc.inStore += 1;
      }

      if (record.location === 'Takeaway') {
        acc.takeaway += 1;
      }

      return acc;
    },
    { inStore: 0, takeaway: 0 }
  );

  const strongerChannel =
    locationCounts.inStore >= locationCounts.takeaway
      ? 'In-store'
      : 'Takeaway';

  const recommendationOne = topProvinceEntry
    ? `Prioritize ${topProvinceEntry[0]} for budget allocation; it currently leads revenue at $${topProvinceEntry[1].toLocaleString('en-CA', { maximumFractionDigits: 0 })}.`
    : 'Prioritize the best-performing province for next-month growth campaigns.';

  const recommendationTwo = topProductEntry
    ? `Promote ${topProductEntry[0]} bundles; it is the top product in this view with ${topProductEntry[1].toLocaleString('en-CA')} units sold.`
    : 'Promote the most frequently purchased product with bundle offers.';

  const recommendationThree =
    selectedProvince.id === dashboardConfig.overall.id
      ? `Use ${strongerChannel} as the lead channel strategy, then test incentives to lift the weaker channel.`
      : `In ${selectedProvince.label}, reinforce ${strongerChannel} operations and launch targeted offers to increase conversion.`;

  return [recommendationOne, recommendationTwo, recommendationThree];
};

export default function ProvinceDashboard({
  selectedProvinceId,
  selectedMonthRange,
  selectedDrink,
  onChangeDrink,
}) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [overallForecastPredictions, setOverallForecastPredictions] = useState(
    []
  );
  const [provinceForecastPredictions, setProvinceForecastPredictions] =
    useState([]);
  const [isForecastLoading, setIsForecastLoading] = useState(true);
  const [forecastErrorMessage, setForecastErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTransactions = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchTransactions();

        if (isMounted) {
          setTransactions(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Unable to load dashboard transaction data.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadForecastData = async () => {
      setIsForecastLoading(true);
      setForecastErrorMessage('');

      try {
        const [overallForecastData, provinceForecastData] = await Promise.all([
          fetchOverallForecastPredictions(),
          fetchProvinceForecastPredictions(),
        ]);

        if (isMounted) {
          setOverallForecastPredictions(overallForecastData);
          setProvinceForecastPredictions(provinceForecastData);
        }
      } catch (error) {
        if (isMounted) {
          setForecastErrorMessage(
            error instanceof Error
              ? error.message
              : 'Unable to load forecast prediction data.'
          );
        }
      } finally {
        if (isMounted) {
          setIsForecastLoading(false);
        }
      }
    };

    loadForecastData();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProvince = useMemo(() => {
    const filterItems = [...dashboardConfig.provinces, dashboardConfig.overall];

    return (
      filterItems.find((item) => item.id === selectedProvinceId) ||
      dashboardConfig.provinces[0]
    );
  }, [selectedProvinceId]);

  const filteredTransactions = useMemo(() => {
    const isOverall = selectedProvince.id === dashboardConfig.overall.id;
    const selectedProvinceLabel = selectedProvince.label;

    return transactions.filter((record) => {
      if (!isOverall && record.province !== selectedProvinceLabel) {
        return false;
      }

      const startMonth = selectedMonthRange?.startMonth;
      const endMonth = selectedMonthRange?.endMonth;

      if (!startMonth || !endMonth) {
        return true;
      }

      const month = monthFromDate(record.transactionDate);
      if (!month) {
        return false;
      }

      return month >= startMonth && month <= endMonth;
    });
  }, [selectedMonthRange?.endMonth, selectedMonthRange?.startMonth, selectedProvince, transactions]);

  const dashboardData = useMemo(() => {
    const revenue = Number(
      filteredTransactions
        .reduce((sum, record) => sum + record.totalSpent, 0)
        .toFixed(2)
    );

    const orders = filteredTransactions.length;

    const salesMap = new Map();

    filteredTransactions.forEach((record) => {
      const month = monthFromDate(record.transactionDate);

      if (!month) {
        return;
      }

      const existing = salesMap.get(month) || 0;
      salesMap.set(month, existing + record.totalSpent);
    });

    const selectedMonths = dashboardConfig.monthFilter.availableMonths
      .map((monthEntry) => monthEntry.value)
      .filter((monthValue) => {
        const startMonth = selectedMonthRange?.startMonth;
        const endMonth = selectedMonthRange?.endMonth;

        if (!startMonth || !endMonth) {
          return salesMap.has(monthValue);
        }

        return monthValue >= startMonth && monthValue <= endMonth;
      });

    const salesTrend = selectedMonths.map((monthValue) => ({
      month: MONTH_LABELS[monthValue],
      monthValue,
      sales: Number((salesMap.get(monthValue) || 0).toFixed(2)),
    }));

    const locationCounts = filteredTransactions.reduce(
      (acc, record) => {
        if (record.location === 'In-store') {
          acc.inStore += 1;
        }

        if (record.location === 'Takeaway') {
          acc.takeaway += 1;
        }

        return acc;
      },
      { inStore: 0, takeaway: 0 }
    );

    const orderTypePerformance = [
      { type: 'In-store', orders: locationCounts.inStore },
      { type: 'Takeaway', orders: locationCounts.takeaway },
    ];

    const productMap = new Map();
    filteredTransactions.forEach((record) => {
      const currentQty = productMap.get(record.item) || 0;
      productMap.set(record.item, currentQty + record.quantity);
    });

    const productPerformance = Array.from(productMap.entries())
      .map(([product, quantity]) => ({
        product,
        quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity);

    const activeForecastRows =
      selectedProvince.id === dashboardConfig.overall.id
        ? overallForecastPredictions
        : provinceForecastPredictions.filter(
            (row) => row.province === selectedProvince.label
          );

    const forecastMap = aggregateForecastByMonth(activeForecastRows);

    const forecastMonths = dashboardConfig.monthFilter.availableMonths
      .map((monthEntry) => monthEntry.value)
      .filter((monthValue) => {
        const startMonth = selectedMonthRange?.startMonth;
        const endMonth = selectedMonthRange?.endMonth;

        if (startMonth && endMonth) {
          if (monthValue < startMonth || monthValue > endMonth) {
            return false;
          }
        }

        return salesMap.has(monthValue) || forecastMap.has(monthValue);
      });

    const forecastSales = forecastMonths.map((monthValue) => ({
      month: MONTH_LABELS[monthValue],
      actual: salesMap.has(monthValue)
        ? Number(salesMap.get(monthValue).toFixed(2))
        : null,
      forecast: forecastMap.has(monthValue)
        ? Number(forecastMap.get(monthValue).toFixed(2))
        : null,
    }));

    const recommendations = buildRecommendations({
      allTransactions: transactions,
      filteredTransactions,
      selectedProvince,
    });

    return {
      metrics: {
        revenue,
        orders,
      },
      salesTrend,
      orderTypePerformance,
      productPerformance,
      forecastSales,
      recommendations,
      hasForecastRows: activeForecastRows.length > 0,
    };
  }, [
    filteredTransactions,
    overallForecastPredictions,
    provinceForecastPredictions,
    selectedMonthRange?.endMonth,
    selectedMonthRange?.startMonth,
    selectedProvince,
    transactions,
  ]);

  const getMonthLabel = (monthValue) => {
    const month = dashboardConfig.monthFilter.availableMonths.find(
      (availableMonth) => availableMonth.value === monthValue
    );

    return month?.label || '';
  };

  const monthRangeLabel =
    selectedMonthRange?.startMonth && selectedMonthRange?.endMonth
      ? `${getMonthLabel(selectedMonthRange.startMonth)} - ${getMonthLabel(
          selectedMonthRange.endMonth
        )}`
      : dashboardConfig.monthFilter.emptyLabel;

  const renderStateCard = (content) => (
    <Card
      elevation={0}
      sx={{
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        borderRadius: 2,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <CardContent sx={{ p: 3 }}>{content}</CardContent>
    </Card>
  );

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

      {isLoading &&
        renderStateCard(
          <Box
            sx={{
              minHeight: 200,
              display: 'grid',
              placeItems: 'center',
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: 'var(--primary)' }} />
            <Typography sx={{ color: 'var(--text-muted)', fontWeight: 700 }}>
              Loading dashboard data...
            </Typography>
          </Box>
        )}

      {!isLoading && errorMessage &&
        renderStateCard(
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {errorMessage}
          </Alert>
        )}

      {!isLoading && !errorMessage && filteredTransactions.length === 0 &&
        renderStateCard(
          <Box sx={{ display: 'grid', gap: 1.25 }}>
            <Typography
              variant="h6"
              sx={{ color: 'var(--text-heading)', fontWeight: 900 }}
            >
              No records match the selected filters
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)' }}>
              Try selecting a different province or widening the month range.
            </Typography>
          </Box>
        )}

      {!isLoading && !errorMessage && filteredTransactions.length > 0 && (
        <>
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

            <ForecastSalesChart
              data={dashboardData.forecastSales}
              isForecastLoading={isForecastLoading}
              forecastErrorMessage={forecastErrorMessage}
              isForecastEmpty={!dashboardData.hasForecastRows}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
