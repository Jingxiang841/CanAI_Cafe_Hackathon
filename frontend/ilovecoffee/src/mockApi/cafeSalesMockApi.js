import csvDataUrl from '../data/cleaned_cafe_sales.csv?url';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toTitleCase = (value) =>
  value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const normalizeProvince = (value) => {
  if (!value) return 'Unknown';

  const cleaned = value.trim();
  if (!cleaned || cleaned.toLowerCase() === 'unknown') {
    return 'Unknown';
  }

  if (cleaned.toLowerCase() === 'newfoundland') {
    return 'Newfoundland and Labrador';
  }

  return toTitleCase(cleaned);
};

const normalizeLocation = (value) => {
  const normalized = (value || '').trim().toLowerCase();

  if (normalized === 'in-store' || normalized === 'instore') {
    return 'In-store';
  }

  if (normalized === 'takeaway' || normalized === 'take-away') {
    return 'Takeaway';
  }

  return 'Unknown';
};

const normalizeDate = (value) => {
  const cleaned = (value || '').trim();

  if (!cleaned || cleaned.toLowerCase() === 'unknown') {
    return null;
  }

  const parsed = new Date(cleaned);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
};

const parseCsvText = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',').map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });

    return {
      transactionId: row['Transaction ID'] || '',
      item: row.Item || 'Unknown',
      quantity: toNumber(row.Quantity),
      pricePerUnit: toNumber(row['Price Per Unit']),
      totalSpent: toNumber(row['Total Spent']),
      paymentMethod: row['Payment Method'] || 'Unknown',
      location: normalizeLocation(row.Location),
      transactionDate: normalizeDate(row['Transaction Date']),
      province: normalizeProvince(row.Province),
      source: row,
    };
  });
};

const monthFromIsoDate = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  return dateValue.slice(5, 7);
};

const isWithinMonthRange = (record, startMonth, endMonth) => {
  if (!startMonth || !endMonth) {
    return true;
  }

  const month = monthFromIsoDate(record.transactionDate);
  if (!month) {
    return false;
  }

  return month >= startMonth && month <= endMonth;
};

const groupByProvince = (records) => {
  const grouped = new Map();

  records.forEach((record) => {
    const key = record.province;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key).push(record);
  });

  return grouped;
};

export async function fetchTransactions() {
  const response = await fetch(csvDataUrl);

  if (!response.ok) {
    throw new Error(`Unable to load transaction data (${response.status})`);
  }

  const text = await response.text();
  return parseCsvText(text);
}

export async function fetchTotalSpentByProvince(filters = {}) {
  const { startMonth, endMonth } = filters;

  const records = await fetchTransactions();
  const filtered = records.filter((record) =>
    isWithinMonthRange(record, startMonth, endMonth)
  );

  const grouped = groupByProvince(filtered);
  const provinces = Array.from(grouped.entries())
    .map(([province, provinceRecords]) => ({
      province,
      totalSpent: provinceRecords.reduce((sum, record) => sum + record.totalSpent, 0),
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);

  return {
    provinces,
    totalProvinces: provinces.length,
  };
}

export async function fetchSalesByMonth(records, monthRange = {}) {
  const { startMonth, endMonth } = monthRange;
  const totals = new Map();

  records.forEach((record) => {
    if (!isWithinMonthRange(record, startMonth, endMonth)) {
      return;
    }

    const month = monthFromIsoDate(record.transactionDate);
    if (!month) {
      return;
    }

    const currentValue = totals.get(month) || 0;
    totals.set(month, currentValue + record.totalSpent);
  });

  return Array.from(totals.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, sales]) => ({
      month: MONTH_LABELS[Number(month) - 1],
      sales: Number(sales.toFixed(2)),
      monthValue: month,
    }));
}
