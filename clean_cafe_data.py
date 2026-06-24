import pandas as pd
import numpy as np

# Load the dataset
file_path = "CanAI Cafe 2023 Sales Information.xlsx"
df = pd.read_excel(file_path, engine="openpyxl")

# -------------------------------
# 1. STANDARDIZE COLUMN NAMES
# -------------------------------
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

# -------------------------------
# 2. TRIM SPACES & LOWERCASE TEXT
# -------------------------------
for col in ['item', 'payment_method', 'location', 'province']:
    if col in df.columns:
        df[col] = df[col].astype(str).str.strip().str.lower()

# -------------------------------
# 3. CLEAN ITEM NAMES
# -------------------------------
item_map = {
    'coffee': 'Coffee',
    'cofee': 'Coffee',
    'coffe': 'Coffee',
    'c0ffee': 'Coffee',
    'tea': 'Tea',
    'tee': 'Tea',
    'sandwich': 'Sandwich',
    'sandwhich': 'Sandwich',
    'donut': 'Donut',
    'doughnut': 'Donut',
    'donutt': 'Donut',
    'cookie': 'Cookie',
    'juice': 'Juice',
    'juic': 'Juice',
    'juicee': 'Juice',
    'salad': 'Salad',
    'refresher': 'Refresher'
}

df['item'] = df['item'].replace(item_map)

# -------------------------------
# 4. CLEAN PROVINCES
# -------------------------------
province_map = {
    # British Columbia
    'bc': 'British Columbia',
    'b.c.': 'British Columbia',
    'british columbia': 'British Columbia',
    'britishcolumbia': 'British Columbia',
    'british columba': 'British Columbia',
    'british columbi': 'British Columbia',
    'british columbi': 'British Columbia',

    # Manitoba
    'mb': 'Manitoba',
    'manitoba': 'Manitoba',
    'manitba': 'Manitoba',
    'manitobaa': 'Manitoba',
    'manitob': 'Manitoba',

    # Newfoundland and Labrador
    'nl': 'Newfoundland and Labrador',
    'nfld': 'Newfoundland and Labrador',
    'newfoundland': 'Newfoundland and Labrador',
    'newfoundland and labrador': 'Newfoundland and Labrador',
    'new foundland': 'Newfoundland and Labrador',
    'newfoundlan': 'Newfoundland and Labrador',

    # Ontario
    'on': 'Ontario',
    'ont': 'Ontario',
    'ont.': 'Ontario',
    'ontario': 'Ontario',
    'ontairo': 'Ontario',
    'ontaroi': 'Ontario',

    # Saskatchewan
    'sk': 'Saskatchewan',
    'sask.': 'Saskatchewan',
    'saskatchewan': 'Saskatchewan',
    'saskatchewn': 'Saskatchewan',
    'sasktchewan': 'Saskatchewan',
    'saskatchewa': 'Saskatchewan'
}

df['province'] = df['province'].replace(province_map)
df['province'] = df['province'].fillna('Unknown')
# -------------------------------
# 5. CLEAN PAYMENT METHOD
# -------------------------------
df['payment_method'] = df['payment_method'].replace({
    'err_pm_102': np.nan
})

df['payment_method'] = df['payment_method'].fillna('Unknown')

# -------------------------------
# 6. CLEAN LOCATION
# -------------------------------
df['location'] = df['location'].fillna('Unknown')

# -------------------------------
# 7. CLEAN NUMERIC COLUMNS
# -------------------------------
df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce')
df['price_per_unit'] = pd.to_numeric(df['price_per_unit'], errors='coerce')
df['total_spent'] = pd.to_numeric(df['total_spent'], errors='coerce')

# Remove invalid quantities (like decimals or negative)
df = df[(df['quantity'].notnull()) & (df['quantity'] > 0)]
df = df[df['quantity'] == df['quantity'].astype(int)]

# Convert quantity to integer
df['quantity'] = df['quantity'].astype(int)

# -------------------------------
# 8. FIX TOTAL SPENT
# -------------------------------
df['total_spent_calculated'] = df['quantity'] * df['price_per_unit']

# Replace incorrect totals
df['total_spent'] = df['total_spent_calculated']

df.drop(columns=['total_spent_calculated'], inplace=True)

# -------------------------------
# 9. CLEAN DATES
# -------------------------------
df['transaction_date'] = pd.to_datetime(df['transaction_date'], errors='coerce').dt.date

# Remove rows with missing dates
df = df[df['transaction_date'].notnull()]

# -------------------------------
# 10. REMOVE DUPLICATES
# -------------------------------
df = df.drop_duplicates(subset=['transaction_id'])

# -------------------------------
# 11. FINAL TEXT FORMATTING
# -------------------------------
df['item'] = df['item'].str.title()
df['payment_method'] = df['payment_method'].str.title()
df['location'] = df['location'].str.title()

# -------------------------------
# 12. SAVE CLEAN DATA
# -------------------------------
output_file = "cleaned_cafe_sales.xlsx"
df.to_excel(output_file, index=False)

print("✅ Data cleaning completed!")
print(f"Cleaned file saved as: {output_file}")