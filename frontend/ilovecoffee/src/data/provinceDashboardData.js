const provinceDashboardData = {
  britishColumbia: {
    metrics: {
      revenue: 128500,
      orders: 3820,
    },

    salesTrend: [
      { month: 'Jan', sales: 18500 },
      { month: 'Feb', sales: 21200 },
      { month: 'Mar', sales: 24800 },
      { month: 'Apr', sales: 23100 },
      { month: 'May', sales: 27600 },
      { month: 'Jun', sales: 30200 },
    ],

    orderTypePerformance: [
      { type: 'In-Store', orders: 2280 },
      { type: 'Takeaway', orders: 1540 },
    ],

    productPerformance: [
      { product: 'Latte', orders: 940 },
      { product: 'Americano', orders: 720 },
      { product: 'Mocha', orders: 610 },
      { product: 'Cold Brew', orders: 890 },
    ],

    forecastSales: [
      { month: 'Jul', actual: 30200, forecast: 31800 },
      { month: 'Aug', actual: null, forecast: 33600 },
      { month: 'Sep', actual: null, forecast: 35100 },
      { month: 'Oct', actual: null, forecast: 37200 },
    ],

    recommendations: [
      'Increase cold brew promotions in Vancouver.',
      'Create loyalty offers for Victoria customers.',
      'Stock more iced drinks during summer months.',
    ],
  },

  newfoundlandLabrador: {
    metrics: {
      revenue: 76400,
      orders: 2160,
    },

    salesTrend: [
      { month: 'Jan', sales: 9800 },
      { month: 'Feb', sales: 11200 },
      { month: 'Mar', sales: 12800 },
      { month: 'Apr', sales: 12100 },
      { month: 'May', sales: 14700 },
      { month: 'Jun', sales: 15800 },
    ],

    orderTypePerformance: [
      { type: 'In-Store', orders: 1240 },
      { type: 'Takeaway', orders: 920 },
    ],

    productPerformance: [
      { product: 'Latte', orders: 520 },
      { product: 'Americano', orders: 410 },
      { product: 'Mocha', orders: 360 },
      { product: 'Cappuccino', orders: 470 },
    ],

    forecastSales: [
      { month: 'Jul', actual: 15800, forecast: 16600 },
      { month: 'Aug', actual: null, forecast: 17400 },
      { month: 'Sep', actual: null, forecast: 18100 },
      { month: 'Oct', actual: null, forecast: 19200 },
    ],

    recommendations: [
      "Focus social media ads around St. John's.",
      'Bundle pastries with cappuccino orders.',
      'Improve delivery visibility for smaller regions.',
    ],
  },

  manitoba: {
    metrics: {
      revenue: 94300,
      orders: 2710,
    },

    salesTrend: [
      { month: 'Jan', sales: 13200 },
      { month: 'Feb', sales: 14100 },
      { month: 'Mar', sales: 16300 },
      { month: 'Apr', sales: 15700 },
      { month: 'May', sales: 18100 },
      { month: 'Jun', sales: 19600 },
    ],

    orderTypePerformance: [
      { type: 'In-Store', orders: 1580 },
      { type: 'Takeaway', orders: 1130 },
    ],

    productPerformance: [
      { product: 'Latte', orders: 650 },
      { product: 'Americano', orders: 530 },
      { product: 'Mocha', orders: 480 },
      { product: 'Espresso', orders: 570 },
    ],

    forecastSales: [
      { month: 'Jul', actual: 19600, forecast: 20700 },
      { month: 'Aug', actual: null, forecast: 21900 },
      { month: 'Sep', actual: null, forecast: 22800 },
      { month: 'Oct', actual: null, forecast: 24100 },
    ],

    recommendations: [
      'Expand weekday lunch campaigns in Winnipeg.',
      'Promote espresso bundles in Brandon.',
      'Use targeted discounts for slower regions.',
    ],
  },

  saskatchewan: {
    metrics: {
      revenue: 88100,
      orders: 2490,
    },

    salesTrend: [
      { month: 'Jan', sales: 11900 },
      { month: 'Feb', sales: 12600 },
      { month: 'Mar', sales: 14900 },
      { month: 'Apr', sales: 13800 },
      { month: 'May', sales: 16900 },
      { month: 'Jun', sales: 18000 },
    ],

    orderTypePerformance: [
      { type: 'In-Store', orders: 1390 },
      { type: 'Takeaway', orders: 1100 },
    ],

    productPerformance: [
      { product: 'Latte', orders: 590 },
      { product: 'Americano', orders: 500 },
      { product: 'Mocha', orders: 420 },
      { product: 'Cold Brew', orders: 610 },
    ],

    forecastSales: [
      { month: 'Jul', actual: 18000, forecast: 19100 },
      { month: 'Aug', actual: null, forecast: 20200 },
      { month: 'Sep', actual: null, forecast: 21300 },
      { month: 'Oct', actual: null, forecast: 22500 },
    ],

    recommendations: [
      'Increase cold brew ads in Saskatoon.',
      'Improve product visibility in Prince Albert.',
      'Run weekend promotions in Regina.',
    ],
  },

  ontario: {
    metrics: {
      revenue: 156800,
      orders: 4620,
    },

    salesTrend: [
      { month: 'Jan', sales: 22100 },
      { month: 'Feb', sales: 23800 },
      { month: 'Mar', sales: 26700 },
      { month: 'Apr', sales: 25400 },
      { month: 'May', sales: 29100 },
      { month: 'Jun', sales: 31900 },
    ],

    orderTypePerformance: [
      { type: 'In-Store', orders: 2720 },
      { type: 'Takeaway', orders: 1900 },
    ],

    productPerformance: [
      { product: 'Latte', orders: 1080 },
      { product: 'Americano', orders: 870 },
      { product: 'Mocha', orders: 740 },
      { product: 'Cold Brew', orders: 990 },
    ],

    forecastSales: [
      { month: 'Jul', actual: 31900, forecast: 33500 },
      { month: 'Aug', actual: null, forecast: 35100 },
      { month: 'Sep', actual: null, forecast: 36600 },
      { month: 'Oct', actual: null, forecast: 38400 },
    ],

    recommendations: [
      'Expand cold brew campaigns in Toronto.',
      'Increase loyalty promotions in Ottawa.',
      'Test seasonal bundles in Hamilton and London.',
    ],
  },

  overall: {
    metrics: {
      revenue: 544100,
      orders: 15800,
    },

    salesTrend: [
      { month: 'Jan', sales: 75500 },
      { month: 'Feb', sales: 82900 },
      { month: 'Mar', sales: 95500 },
      { month: 'Apr', sales: 90200 },
      { month: 'May', sales: 107400 },
      { month: 'Jun', sales: 117500 },
    ],

    orderTypePerformance: [
      { type: 'In-Store', orders: 9210 },
      { type: 'Takeaway', orders: 6590 },
    ],

    productPerformance: [
      { product: 'Latte', orders: 3780 },
      { product: 'Americano', orders: 3030 },
      { product: 'Mocha', orders: 2610 },
      { product: 'Cold Brew', orders: 3490 },
    ],

    forecastSales: [
      { month: 'Jul', actual: 117500, forecast: 124700 },
      { month: 'Aug', actual: null, forecast: 131900 },
      { month: 'Sep', actual: null, forecast: 139100 },
      { month: 'Oct', actual: null, forecast: 148000 },
    ],

    recommendations: [
      'Use Ontario and British Columbia as priority growth markets.',
      'Improve visibility in smaller regions with targeted offers.',
      'Promote high-performing drinks across all provinces.',
    ],
  },
};

export default provinceDashboardData;