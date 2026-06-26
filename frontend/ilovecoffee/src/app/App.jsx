import { useMemo, useState } from 'react';
import { Box } from '@mui/material';

import LandingPage from '../components/LandingPage';
import ProvinceDashboard from '../components/ProvinceDashboard';
import ProvinceSidePanel from '../components/ProvinceSidePanel';
import dashboardConfig from '../config/dashboardConfig';

const PAGE_TRANSITION_DURATION = 650;

export default function App() {
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [pendingDrink, setPendingDrink] = useState(null);
  const [isLeavingLanding, setIsLeavingLanding] = useState(false);

  const [selectedProvinceId, setSelectedProvinceId] = useState(
    dashboardConfig.overall.id
  );

  const filterItems = useMemo(
    () => [...dashboardConfig.provinces, dashboardConfig.overall],
    []
  );

  const initialMonthRanges = useMemo(
    () =>
      filterItems.reduce((ranges, item) => {
        ranges[item.id] = {
          startMonth: dashboardConfig.defaultMonthRange.startMonth,
          endMonth: dashboardConfig.defaultMonthRange.endMonth,
        };

        return ranges;
      }, {}),
    [filterItems]
  );

  const [monthRanges, setMonthRanges] = useState(initialMonthRanges);

  const handleMonthRangeChange = (itemId, field, value) => {
    setMonthRanges((previousRanges) => {
      const currentRange = previousRanges[itemId] || {
        startMonth: '',
        endMonth: '',
      };

      const updatedRange = {
        ...currentRange,
        [field]: value,
      };

      if (
        field === 'startMonth' &&
        updatedRange.endMonth &&
        updatedRange.endMonth < value
      ) {
        updatedRange.endMonth = '';
      }

      return {
        ...previousRanges,
        [itemId]: updatedRange,
      };
    });
  };

  const handleDrinkSelect = (drink) => {
    setPendingDrink(drink);
    setIsLeavingLanding(true);

    window.setTimeout(() => {
      setSelectedDrink(drink);
      setPendingDrink(null);
      setIsLeavingLanding(false);
    }, PAGE_TRANSITION_DURATION);
  };

  const handleChangeDrink = () => {
    setSelectedDrink(null);
    setPendingDrink(null);
    setIsLeavingLanding(false);
  };

  const selectedColors = selectedDrink?.colors;

  if (!selectedDrink) {
    return (
      <LandingPage
        selectedDrinkId={pendingDrink?.id}
        isLeaving={isLeavingLanding}
        onDrinkSelect={handleDrinkSelect}
      />
    );
  }

  return (
    <Box
      sx={{
        '--primary': selectedColors.primary,
        '--primary-dark': selectedColors.primaryDark,
        '--primary-soft': selectedColors.primarySoft,
        '--primary-light': selectedColors.primaryLight,

        '--surface': selectedColors.surface,
        '--surface-soft': selectedColors.surfaceSoft,
        '--border': selectedColors.border,

        '--text-heading': selectedColors.textHeading,
        '--text-main': selectedColors.textMain || selectedColors.textHeading,
        '--text-muted': selectedColors.textMuted,

        '--sidebar-bg': selectedColors.primaryLight,
        '--sidebar-bg-soft': selectedColors.surface,
        '--sidebar-bg-deep': selectedColors.primarySoft,
        '--sidebar-border': selectedColors.border,

        '--chart-sales': selectedColors.chartSales,
        '--chart-order-type': selectedColors.chartOrderType,
        '--chart-product': selectedColors.chartProduct,
        '--chart-actual': selectedColors.chartActual,
        '--chart-forecast': selectedColors.chartForecast,

        '--shadow-sm': `0 4px 12px ${selectedColors.shadow}`,
        '--shadow-md': `0 14px 34px ${selectedColors.shadow}`,

        minHeight: '100vh',
        display: 'flex',
        flexDirection: {
          xs: 'column',
          lg: 'row',
        },
        background: `linear-gradient(135deg, ${selectedColors.surface} 0%, ${selectedColors.surfaceSoft} 55%, ${selectedColors.primaryLight} 100%)`,
        animation: 'dashboardEnter 0.65s cubic-bezier(0.22, 1, 0.36, 1) both',
      }}
    >
      <ProvinceSidePanel
        selectedDrink={selectedDrink}
        selectedProvinceId={selectedProvinceId}
        onProvinceChange={setSelectedProvinceId}
        monthRanges={monthRanges}
        onMonthRangeChange={handleMonthRangeChange}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          overflowX: 'hidden',
          px: {
            xs: 2,
            md: 4,
            xl: 5,
          },
          py: {
            xs: 3,
            md: 4,
          },
        }}
      >
        <ProvinceDashboard
          selectedProvinceId={selectedProvinceId}
          selectedMonthRange={monthRanges[selectedProvinceId]}
          selectedDrink={selectedDrink}
          onChangeDrink={handleChangeDrink}
        />
      </Box>
    </Box>
  );
}