/**
 * -----------------------------
 * CSV LOADER (Shared Utility)
 * -----------------------------
 * Fetches the CSV file and converts it into an array of objects.
 * Each row becomes one record with key/value pairs based on headers.
 */
const fetchAndParseCSV = async () => {
  const response = await fetch('/data/cleaned_cafe_sales.csv');
  const text = await response.text();

  const lines = text.split('\n').filter(Boolean);

  const headers = lines[0].split(',');

  return lines.slice(1).map((line) => {
    const values = line.split(',');

    const record = {};
    headers.forEach((header, index) => {
      record[header.trim()] = values[index]?.trim();
    });

    return record;
  });
};

/**
 * -----------------------------
 * Helper: Safe number conversion
 * -----------------------------
 * Ensures numeric values don't break calculations.
 */
const toNumber = (value) => Number(value) || 0;

/**
 * -----------------------------
 * Helper: Safe province fallback
 * -----------------------------
 */
const getProvince = (record) => record.province || 'Unknown';

/**
 * ============================================================
 * Total Revenue by Province
 * ============================================================
 * Aggregates total_spent per province
 */
export async function fetchTotalSpentByProvince() {
  const records = await fetchAndParseCSV();

  const totalsByProvince = new Map();

  // Aggregate totals
  records.forEach((record) => {
    const province = getProvince(record);
    const totalSpent = toNumber(record.total_spent);

    const currentTotal = totalsByProvince.get(province) || 0;
    totalsByProvince.set(province, currentTotal + totalSpent);
  });

  // Convert to sorted array
  const provinces = Array.from(totalsByProvince.entries())
    .map(([province, totalSpent]) => ({
      province,
      totalSpent: Math.round(totalSpent * 100) / 100, // round to 2 decimals
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);

  return {
    provinces,
    totalProvinces: provinces.length,
  };
}

/**
 * ============================================================
 * Total Quantity Sold by Province
 * ============================================================
 * Aggregates quantity per province
 */
export async function fetchTotalQuantityByProvince() {
  const records = await fetchAndParseCSV();

  const totalsByProvince = new Map();

  // Aggregate quantities
  records.forEach((record) => {
    const province = getProvince(record);
    const quantity = toNumber(record.quantity);

    const currentTotal = totalsByProvince.get(province) || 0;
    totalsByProvince.set(province, currentTotal + quantity);
  });

  // Convert to sorted array
  const provinces = Array.from(totalsByProvince.entries())
    .map(([province, totalQuantity]) => ({
      province,
      totalQuantity,
    }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity);

  return {
    provinces,
    totalProvinces: provinces.length,
  };
}

/**
 * ============================================================
 * Item Breakdown by Province
 * ============================================================
 * Creates a nested structure:
 * province → item → total quantity
 */
export async function fetchItemBreakdownByProvince() {
  const records = await fetchAndParseCSV();

  const provinceMap = new Map();

  records.forEach((record) => {
    const province = getProvince(record);
    const item = record.item || 'Unknown';
    const quantity = toNumber(record.quantity);

    // Ensure province exists in map
    if (!provinceMap.has(province)) {
      provinceMap.set(province, new Map());
    }

    const itemMap = provinceMap.get(province);

    // Add quantity to the correct item
    const currentItemQty = itemMap.get(item) || 0;
    itemMap.set(item, currentItemQty + quantity);
  });

  // Convert nested map into clean array structure
  const provinces = Array.from(provinceMap.entries())
    .map(([province, itemMap]) => ({
      province,
      items: Array.from(itemMap.entries())
        .map(([item, quantity]) => ({
          item,
          quantity,
        }))
        .sort((a, b) => b.quantity - a.quantity), // sort items by most sold
    }))
    .sort((a, b) => a.province.localeCompare(b.province)); // alphabetize provinces

  return {
    provinces,
    totalProvinces: provinces.length,
  };
}

/**
 * ============================================================
 * Sales Over Time by Province
 * ============================================================
 * Aggregates total_spent by date for each province.
 * Output is a time series per province.
 */
export async function fetchSalesByDateByProvince() {
  const records = await fetchAndParseCSV();

  const provinceMap = new Map();

  records.forEach((record) => {
    const province = getProvince(record);

    // Extract only the date part (remove time)
    const date = record.transaction_date
      ? record.transaction_date.split(' ')[0]
      : 'Unknown';

    const totalSpent = toNumber(record.total_spent);

    // Ensure province exists
    if (!provinceMap.has(province)) {
      provinceMap.set(province, new Map());
    }

    const dateMap = provinceMap.get(province);

    // Add total spent for that date
    const currentTotal = dateMap.get(date) || 0;
    dateMap.set(date, currentTotal + totalSpent);
  });

  // Convert nested maps into arrays
  const provinces = Array.from(provinceMap.entries())
    .map(([province, dateMap]) => ({
      province,
      data: Array.from(dateMap.entries())
        .map(([date, totalSpent]) => ({
          date,
          totalSpent: Math.round(totalSpent * 100) / 100,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)), // sort ascending by date
    }))
    .sort((a, b) => a.province.localeCompare(b.province));

  return {
    provinces,
    totalProvinces: provinces.length,
  };
}