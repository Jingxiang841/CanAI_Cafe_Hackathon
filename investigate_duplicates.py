import pandas as pd

print("🚀 Script started...")

# Load ORIGINAL dataset
file_path = 'CanAI Cafe 2023 Sales Information.xlsx'
df = pd.read_excel(file_path, engine='openpyxl')

print("✅ File loaded. Rows:", len(df))

# -------------------------------
# STANDARDIZE COLUMN NAMES (important!)
# -------------------------------
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

# -------------------------------
# INVESTIGATE DUPLICATE TRANSACTIONS
# -------------------------------

# Count how many times each transaction_id appears
transaction_counts = df['transaction_id'].value_counts()

# Filter transaction IDs that appear more than once
duplicates = transaction_counts[transaction_counts > 1]

print("\n✅ Duplicate transaction IDs found:", len(duplicates))

# Show top duplicates
print("\n🔍 Top duplicate IDs:")
print(duplicates.head(10))

# Extract rows with duplicate transaction IDs
duplicate_rows = df[df['transaction_id'].isin(duplicates.index)]

# Sort for easier inspection
duplicate_rows = duplicate_rows.sort_values(by=['transaction_id'])

# Save investigation file
output_file = 'investigate_original_duplicates.xlsx'
duplicate_rows.to_excel(output_file, index=False)

print(f"\n✅ Investigation file saved as: {output_file}")

# -------------------------------
# EXTRA ANALYSIS
# -------------------------------

if not duplicates.empty:
    # Show one example transaction
    sample_id = duplicates.index[0]
    sample_data = df[df['transaction_id'] == sample_id]

    print("\n🔍 Sample Transaction ID:", sample_id)
    print(sample_data)

    # Summary (if columns exist)
    if 'quantity' in df.columns and 'total_spent' in df.columns:
        print("\n📊 Summary:")
        print('Total Items:', sample_data['quantity'].sum())
        print('Total Spent:', sample_data['total_spent'].sum())

# -------------------------------
# CHECK FULL ROW DUPLICATES
# -------------------------------

full_duplicates = df[df.duplicated(keep=False)]

print("✅ Full duplicate rows found:", len(full_duplicates))

if len(full_duplicates) > 0:
    full_duplicates.to_excel('full_duplicate_rows.xlsx', index=False)
    print("✅ Full duplicate rows saved to: full_duplicate_rows.xlsx")