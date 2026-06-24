import { useMemo, useState } from 'react';
import { Box } from '@mui/material';

import ProvinceDashboard from '../components/ProvinceDashboard';
import ProvinceSidePanel from '../components/ProvinceSidePanel';
import dashboardConfig from '../config/dashboardConfig';

export default function App() {
  const [selectedProvinceId, setSelectedProvinceId] = useState(
    dashboardConfig.provinces[0].id
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: {
          xs: 'column',
          lg: 'row',
        },
      }}
    >
      <ProvinceSidePanel
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
        />
      </Box>
    </Box>
  );
}