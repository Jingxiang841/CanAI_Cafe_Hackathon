# CanAI Café Dataset Cleaning

This README explains the purpose and workflow of the `data/dataset_cleaning.py` script.

## Overview

The `dataset_cleaning.py` script cleans the raw CanAI Café transaction dataset and saves a cleaned Excel file for later analysis, business intelligence, and machine learning forecasting.

The script reads:

```text
CanAI Cafe Data.csv
```

and exports:

```text
Cleaned_CanAI_Cafe_Data.xlsx
```

## File Location

```text
data/dataset_cleaning.py
```

## Main Goal

The goal of this script is to prepare the raw café transaction data by:

- Removing fully identical duplicate rows
- Cleaning text formatting issues
- Standardizing item names
- Standardizing province names
- Cleaning numeric columns
- Cleaning payment method and location values
- Cleaning transaction dates
- Filling selected missing values using logical rules
- Exporting a cleaned dataset for future modeling and analysis

## Libraries Used

```python
import pandas as pd
import numpy as np
```

`pandas` is used for reading, cleaning, transforming, and exporting tabular data. `numpy` is used mainly for representing missing values as `np.nan`.

## Input Dataset

The script expects the raw dataset to contain columns such as:

```text
Transaction ID
Item
Quantity
Price Per Unit
Total Spent
Payment Method
Location
Transaction Date
Province
```

## Cleaning Workflow

### 1. Read the Raw Dataset

```python
df = pd.read_csv("CanAI Cafe Data.csv")
```

The raw CSV file is loaded into a pandas DataFrame.

### 2. Clean Text Values

The script defines a helper function:

```python
def clean_text(series):
    return series.astype("string").str.strip().replace({
        "": np.nan,
        "nan": np.nan,
        "NaN": np.nan,
        "UNKNOWN": np.nan,
        "unknown": np.nan
    })
```

This function removes extra spaces and converts blank or unknown text values into `np.nan`.

### 3. Drop Fully Identical Duplicate Rows

```python
df = df.drop_duplicates()
```

Only fully identical duplicate rows are removed. Rows that only share the same `Transaction ID` are not automatically removed because they may still represent different transaction details.

### 4. Clean Transaction ID

```python
df["Transaction ID"] = clean_text(df["Transaction ID"])
```

Transaction IDs are cleaned by removing spaces and converting unknown or blank values into missing values.

### 5. Clean Item Names

The script maps misspelled or inconsistent item names to standard names.

Examples:

```text
cofee, coffe, c0ffee → Coffee
donut, donutt, doughnut → Doughnut
sandwhich → Sandwich
juicee, juic → Juice
```

Final standardized item values include:

```text
Coffee
Refresher
Doughnut
Tea
Salad
Sandwich
Cookie
Juice
```

### 6. Clean Province Names

The script maps province abbreviations, spelling mistakes, and alternate names to standardized province names.

Examples:

```text
mb, manitobaa, manitba → Manitoba
sk, sask., saskatchewn → Saskatchewan
on, ont., ontaroi → Ontario
nl, nfld, new foundland → Newfoundland
bc, b.c., britishcolumbia → British Columbia
```

Final standardized province values include:

```text
Manitoba
Saskatchewan
Ontario
Newfoundland
British Columbia
```

### 7. Clean Quantity

```python
df["Quantity"] = pd.to_numeric(clean_text(df["Quantity"]), errors="coerce")
```

The `Quantity` column is converted into numeric format. Invalid or missing values are converted to `np.nan`.

### 8. Clean Price Per Unit and Total Spent

```python
df["Price Per Unit"] = pd.to_numeric(df["Price Per Unit"], errors="coerce")
df["Total Spent"] = pd.to_numeric(df["Total Spent"], errors="coerce")
```

Both columns are converted into numeric format. Invalid values are converted into missing values.

### 9. Clean Payment Method

The script standardizes payment method values into:

```text
Cash
Credit Card
Digital Wallet
```

### 10. Clean Location

The script standardizes location values into:

```text
In-store
Takeaway
```

### 11. Clean Transaction Date

```python
date_clean = clean_text(df["Transaction Date"])
df["Transaction Date"] = pd.to_datetime(date_clean, errors="coerce").dt.strftime("%Y-%m-%d")
df["Transaction Date"] = df["Transaction Date"].replace({"NaT": np.nan})
```

Transaction dates are converted into the standard format:

```text
YYYY-MM-DD
```

Invalid dates are converted into missing values.

## Missing Value Handling

### 1. Fill Missing Item Values Using Price Per Unit

The script uses known product prices to infer missing item names:

```python
price_to_item = {
    3.5: "Coffee",
    5.0: "Refresher",
    2.0: "Doughnut",
    3.0: "Tea",
    9.0: "Salad",
    8.0: "Sandwich",
    2.5: "Cookie",
    4.5: "Juice"
}
```

This is logical because each café item has a fixed price.

### 2. Fill Missing Quantity Values

Missing quantity values are filled using:

```text
Quantity = Total Spent / Price Per Unit
```

This follows the relationship:

```text
Total Spent = Quantity × Price Per Unit
```

### 3. Fill Remaining Missing Values as Unknown

```python
df = df.fillna("Unknown")
```

Any remaining missing values are filled with `"Unknown"` so uncertainty is preserved instead of randomly assigning incorrect values.

## Validation Checks

The script prints unique values from important categorical columns:

```python
print(df["Item"].unique())
print(df["Province"].unique())
print(df["Payment Method"].unique())
print(df["Location"].unique())
```

It also checks remaining missing values:

```python
print(df.isna().sum())
```

These checks help confirm that the cleaning process worked correctly.

## Output File

The cleaned dataset is saved as:

```python
df.to_excel("Cleaned_CanAI_Cafe_Data.xlsx", index=False)
```

Final output:

```text
Cleaned_CanAI_Cafe_Data.xlsx
```

## Important Cleaning Decisions

### Duplicate Rows

Only fully identical duplicate rows are dropped. Repeated transaction IDs are not automatically removed.

### Missing Items

Missing item names are filled using `Price Per Unit`, because each item has a known fixed price.

### Missing Quantity

Missing quantity values are filled using:

```text
Total Spent / Price Per Unit
```

### Remaining Missing Values

Remaining unknown values are kept as `"Unknown"` rather than randomly filled. This avoids creating fake patterns in the dataset.

## Final Cleaned Dataset Purpose

The cleaned dataset can be used for:

- Business intelligence analysis
- Sales trend analysis
- Product performance analysis
- Province-wise sales analysis
- Payment method analysis
- Machine learning forecasting
- XGBoost sales prediction models

## How to Run

From the project root directory, run:

```bash
python data/dataset_cleaning.py
```

Make sure the raw CSV file is available as:

```text
CanAI Cafe Data.csv
```

After running the script, the cleaned Excel file will be created:

```text
Cleaned_CanAI_Cafe_Data.xlsx
```

## Expected Output

After successful execution, the script will:

1. Print cleaned unique values for item, province, payment method, and location.
2. Print missing value counts.
3. Save the cleaned dataset as `Cleaned_CanAI_Cafe_Data.xlsx`.

## Summary

`dataset_cleaning.py` converts the raw CanAI Café transaction dataset into a clean and standardized dataset. It fixes spelling inconsistencies, handles missing values logically, validates important categorical columns, and exports a cleaned Excel file ready for analysis and forecasting.
