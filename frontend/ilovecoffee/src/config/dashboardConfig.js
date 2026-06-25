const dashboardConfig = {
  appName: 'CanAI Cafe',

  dashboardTitle: 'Marketing Overview',

  dashboardSubtitle:
    'Compare sales trends, order type performance, product performance, forecasted sales, and recommendations by province.',

  provinceLabel: 'Choose Province',

  monthFilter: {
    emptyLabel: 'No month range selected',
    helperText: 'Select a month range from the available dataset.',
    availableMonths: [
      {
        value: '01',
        label: 'January',
      },
      {
        value: '02',
        label: 'February',
      },
      {
        value: '03',
        label: 'March',
      },
      {
        value: '04',
        label: 'April',
      },
      {
        value: '05',
        label: 'May',
      },
      {
        value: '06',
        label: 'June',
      },
      {
        value: '07',
        label: 'July',
      },
      {
        value: '08',
        label: 'August',
      },
      {
        value: '09',
        label: 'September',
      },
      {
        value: '10',
        label: 'October',
      },
      {
        value: '11',
        label: 'November',
      },
      {
        value: '12',
        label: 'December',
      },
    ],
  },

  defaultMonthRange: {
    startMonth: '',
    endMonth: '',
  },

  provinces: [
    {
      id: 'britishColumbia',
      label: 'British Columbia',
    },
    {
      id: 'newfoundlandLabrador',
      label: 'Newfoundland and Labrador',
    },
    {
      id: 'manitoba',
      label: 'Manitoba',
    },
    {
      id: 'saskatchewan',
      label: 'Saskatchewan',
    },
    {
      id: 'ontario',
      label: 'Ontario',
    },
  ],

  overall: {
    id: 'overall',
    label: 'Overall',
  },

  layout: {
    pageMaxWidth: '1600px',
    dashboardGap: 3,
    metricMinHeight: 150,
    chartHeight: 430,
    smallChartHeight: 390,
    recommendationMinHeight: 240,
  },

  cards: {
    revenue: {
      label: 'Total Revenue',
      prefix: '$',
    },
    orders: {
      label: 'Total Orders',
      suffix: '',
    },
  },

  charts: {
    salesTrend: {
      title: 'Sales Trends',
      xKey: 'month',
      yKey: 'sales',
      lineName: 'Revenue',
    },

    orderTypePerformance: {
      title: 'In-Store vs Takeaway',
      nameKey: 'type',
      valueKey: 'orders',
      barName: 'Orders',
    },

    productPerformance: {
      title: 'Product Performance',
      nameKey: 'product',
      valueKey: 'quantity',
      barName: 'Quantity Sold',
    },

    forecastSales: {
      title: 'Forecasted Sales',
      xKey: 'month',
      actualKey: 'actual',
      forecastKey: 'forecast',
      actualName: 'Actual',
      forecastName: 'Forecast',
    },

    recommendations: {
      title: 'Business Recommendations',
    },
  },

  chartStyles: {
    gridDash: '3 3',
    salesColor: '#8b572a',
    orderTypeColor: '#a86f3d',
    productColor: '#d9903d',
    actualColor: '#6f8f52',
    forecastColor: '#c56f2d',
  },
};

export default dashboardConfig;