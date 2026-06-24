import pandas as pd
import numpy as np

# Read data
df = pd.read_csv("CanAI Cafe Data.csv")

# Helper function: strips spaces and converts blanks/unknown text to np.nan
def clean_text(series):
    return series.astype("string").str.strip().replace({
        "": np.nan,
        "nan": np.nan,
        "NaN": np.nan,
        "UNKNOWN": np.nan,
        "unknown": np.nan
    })

# 1. Drop only fully identical duplicate rows
# This does NOT drop rows that only share the same Transaction ID.
df = df.drop_duplicates()

# 2. Clean Transaction ID
df["Transaction ID"] = clean_text(df["Transaction ID"])

# 3. Clean Item
item_map = {
    "coffee": "Coffee",
    "cofee": "Coffee",
    "coffe": "Coffee",
    "c0ffee": "Coffee",

    "refresher": "Refresher",

    "donut": "Doughnut",
    "donutt": "Doughnut",
    "doughnut": "Doughnut",

    "tea": "Tea",
    "tee": "Tea",

    "salad": "Salad",

    "sandwich": "Sandwich",
    "sandwhich": "Sandwich",

    "cookie": "Cookie",

    "juice": "Juice",
    "juic": "Juice",
    "juicee": "Juice"
}

df["Item"] = clean_text(df["Item"]).str.lower().map(item_map)

# 4. Clean Province
province_map = {
    "manitoba": "Manitoba",
    "mb": "Manitoba",
    "manitobaa": "Manitoba",
    "manitba": "Manitoba",
    "manitob": "Manitoba",

    "saskatchewan": "Saskatchewan",
    "sasktchewan": "Saskatchewan",
    "sk": "Saskatchewan",
    "sask.": "Saskatchewan",
    "saskatchewn": "Saskatchewan",
    "saskatchewa": "Saskatchewan",

    "ontario": "Ontario",
    "on": "Ontario",
    "ont.": "Ontario",
    "ontaroi": "Ontario",
    "ontairo": "Ontario",

    "newfoundland": "Newfoundland",
    "newfoundland and labrador": "Newfoundland",
    "new foundland": "Newfoundland",
    "nl": "Newfoundland",
    "nfld": "Newfoundland",
    "newfoundlan": "Newfoundland",

    "british columbia": "British Columbia",
    "britishcolumbia": "British Columbia",
    "british columba": "British Columbia",
    "british columbi": "British Columbia",
    "b.c.": "British Columbia",
    "bc": "British Columbia"
}

df["Province"] = clean_text(df["Province"]).str.lower().map(province_map)

# 5. Clean Quantity
# Missing Quantity stays as np.nan. We are NOT filling it from Total Spent / Price Per Unit.
df["Quantity"] = pd.to_numeric(clean_text(df["Quantity"]), errors="coerce")

# 6. Clean Price Per Unit and Total Spent
df["Price Per Unit"] = pd.to_numeric(df["Price Per Unit"], errors="coerce")
df["Total Spent"] = pd.to_numeric(df["Total Spent"], errors="coerce")

# 7. Clean Payment Method
payment_map = {
    "cash": "Cash",
    "credit card": "Credit Card",
    "digital wallet": "Digital Wallet"
}

df["Payment Method"] = clean_text(df["Payment Method"]).str.lower().map(payment_map)

# 8. Clean Location
location_map = {
    "in-store": "In-store",
    "takeaway": "Takeaway"
}

df["Location"] = clean_text(df["Location"]).str.lower().map(location_map)

# 9. Clean Transaction Date
# Blank, UNKNOWN, and invalid dates stay as np.nan.
date_clean = clean_text(df["Transaction Date"])
df["Transaction Date"] = pd.to_datetime(date_clean, errors="coerce").dt.strftime("%Y-%m-%d")
df["Transaction Date"] = df["Transaction Date"].replace({"NaT": np.nan})

# 10. Check cleaned unique values
print("Item unique values:")
print(df["Item"].unique())

print("\nProvince unique values:")
print(df["Province"].unique())

print("\nPayment Method unique values:")
print(df["Payment Method"].unique())

print("\nLocation unique values:")
print(df["Location"].unique())

print("\nMissing values after cleaning:")
print(df.isna().sum())


df.to_excel("Cleaned_CanAI_Cafe_Data.xlsx", index=False)