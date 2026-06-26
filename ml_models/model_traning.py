import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

df = pd.read_csv("Cleaned_CanAI_Cafe_Data.csv")

df = df.replace("Unknown", np.nan)

df["Transaction Date"] = pd.to_datetime(
    df["Transaction Date"],
    format="%Y-%m-%d",
    errors="coerce"
)

df = df.dropna(subset=["Transaction Date"]).copy()

df["Year"] = df["Transaction Date"].dt.year
df["Month"] = df["Transaction Date"].dt.month
df["Day"] = df["Transaction Date"].dt.day
df["DayOfWeek"] = df["Transaction Date"].dt.day_name()
df["IsWeekend"] = df["Transaction Date"].dt.dayofweek.isin([5, 6]).astype(int)

# print("\nMissing Transaction IDs:")
# print(df["Transaction ID"].isna().sum())

# print("\nDuplicate Transaction IDs:")
# print(df["Transaction ID"].duplicated().sum())

# print("\nExact duplicate rows before dropping Transaction ID:")
# print(df.duplicated().sum())

# print("\nRows with duplicate Transaction IDs:")
duplicate_ids = df[df["Transaction ID"].duplicated(keep=False)]
# print(duplicate_ids.sort_values("Transaction ID"))

df = df.drop(columns=["Transaction ID"])

# print(df.columns)

# print("Shape:", df.shape)

# print("\nData types:")
# print(df.dtypes)

# print("\nMissing values:")
# print(df.isna().sum())

# print("\nMissing percentage:")
# print((df.isna().mean() * 100).round(2))

# print("\nDuplicate rows:")
# print(df.duplicated().sum())

# print("\nDate range:")
# print(df["Transaction Date"].min(), "to", df["Transaction Date"].max())

# print("\nNumeric summary:")
# print(df[["Quantity", "Price Per Unit", "Total Spent"]].describe())

# for col in ["Item", "Payment Method", "Location", "Province"]:
    # print(f"\n{col}:")
    # print(df[col].value_counts(dropna=False))

df["Expected Total"] = df["Quantity"] * df["Price Per Unit"]

df["Total Difference"] = df["Total Spent"] - df["Expected Total"]

# print(df["Total Difference"].describe())

# print(df[df["Total Difference"].abs() > 0.01])

df = df.drop(columns=["Expected Total", "Total Difference"])

df = df.sort_values("Transaction Date").reset_index(drop=True)

daily_sales_df = df.groupby("Transaction Date").agg(
    Daily_Revenue=("Total Spent", "sum"),
    Daily_Quantity=("Quantity", "sum"),
    Number_of_Transactions=("Total Spent", "count")
).reset_index()

daily_sales_df = daily_sales_df.sort_values("Transaction Date").reset_index(drop=True)

# print("\nDaily sales shape:")
# print(daily_sales_df.shape)

# print("\nDaily sales date range:")
# print(daily_sales_df["Transaction Date"].min(), "to", daily_sales_df["Transaction Date"].max())

# print("\nFirst 5 rows:")
# print(daily_sales_df.head())

# print("\nLast 5 rows:")
# print(daily_sales_df.tail())

province_df = df.copy()

province_df["Province"] = province_df["Province"].str.strip()

province_df = province_df.dropna(subset=["Province"]).copy()

province_df = province_df[province_df["Province"] != "Ontario"].copy()

province_daily_sales_df = province_df.groupby(["Transaction Date", "Province"]).agg(
    Daily_Revenue=("Total Spent", "sum"),
    Daily_Quantity=("Quantity", "sum"),
    Number_of_Transactions=("Total Spent", "count")
).reset_index()

all_dates = pd.date_range(
    start=df["Transaction Date"].min(),
    end=df["Transaction Date"].max(),
    freq="D"
)

all_provinces = sorted(province_df["Province"].unique())

full_index = pd.MultiIndex.from_product(
    [all_dates, all_provinces],
    names=["Transaction Date", "Province"]
)

province_daily_sales_df = (
    province_daily_sales_df
    .set_index(["Transaction Date", "Province"])
    .reindex(full_index, fill_value=0)
    .reset_index()
)

province_daily_sales_df = province_daily_sales_df.sort_values(
    ["Province", "Transaction Date"]
).reset_index(drop=True)

# print("\nProvince-wise daily sales shape:")
# print(province_daily_sales_df.shape)

# print("\nProvince-wise daily sales date range:")
# print(province_daily_sales_df["Transaction Date"].min(), "to", province_daily_sales_df["Transaction Date"].max())

# print("\nProvince-wise revenue by province:")
# print(province_daily_sales_df.groupby("Province")["Daily_Revenue"].sum().sort_values(ascending=False))

# print("\nProvince-wise transaction count:")
# print(province_df["Province"].value_counts())

# print("\nFirst 10 rows of province_daily_sales_df:")
# print(province_daily_sales_df.head(10))

# print("\nLast 10 rows of province_daily_sales_df:")
# print(province_daily_sales_df.tail(10))

daily_sales_df["Year"] = daily_sales_df["Transaction Date"].dt.year
daily_sales_df["Month"] = daily_sales_df["Transaction Date"].dt.month
daily_sales_df["Day"] = daily_sales_df["Transaction Date"].dt.day
daily_sales_df["DayOfWeek"] = daily_sales_df["Transaction Date"].dt.dayofweek
daily_sales_df["IsWeekend"] = daily_sales_df["DayOfWeek"].isin([5, 6]).astype(int)

daily_sales_df["Lag_1"] = daily_sales_df["Daily_Revenue"].shift(1)
daily_sales_df["Lag_7"] = daily_sales_df["Daily_Revenue"].shift(7)
daily_sales_df["Lag_14"] = daily_sales_df["Daily_Revenue"].shift(14)
daily_sales_df["Lag_30"] = daily_sales_df["Daily_Revenue"].shift(30)

daily_sales_df["Rolling_7"] = daily_sales_df["Daily_Revenue"].shift(1).rolling(window=7).mean()
daily_sales_df["Rolling_14"] = daily_sales_df["Daily_Revenue"].shift(1).rolling(window=14).mean()
daily_sales_df["Rolling_30"] = daily_sales_df["Daily_Revenue"].shift(1).rolling(window=30).mean()

daily_sales_df = daily_sales_df.dropna().reset_index(drop=True)

# print("\nDaily sales dataframe after feature engineering:")
# print(daily_sales_df.shape)

# print("\nFirst 5 rows:")
# print(daily_sales_df.head())

# print("\nLast 5 rows:")
# print(daily_sales_df.tail())

province_daily_sales_df["Year"] = province_daily_sales_df["Transaction Date"].dt.year
province_daily_sales_df["Month"] = province_daily_sales_df["Transaction Date"].dt.month
province_daily_sales_df["Day"] = province_daily_sales_df["Transaction Date"].dt.day
province_daily_sales_df["DayOfWeek"] = province_daily_sales_df["Transaction Date"].dt.dayofweek
province_daily_sales_df["IsWeekend"] = province_daily_sales_df["DayOfWeek"].isin([5, 6]).astype(int)

province_daily_sales_df["Lag_1"] = province_daily_sales_df.groupby("Province")["Daily_Revenue"].shift(1)
province_daily_sales_df["Lag_7"] = province_daily_sales_df.groupby("Province")["Daily_Revenue"].shift(7)
province_daily_sales_df["Lag_14"] = province_daily_sales_df.groupby("Province")["Daily_Revenue"].shift(14)
province_daily_sales_df["Lag_30"] = province_daily_sales_df.groupby("Province")["Daily_Revenue"].shift(30)

province_daily_sales_df["Rolling_7"] = province_daily_sales_df.groupby("Province")["Daily_Revenue"].transform(
    lambda x: x.shift(1).rolling(window=7).mean()
)

province_daily_sales_df["Rolling_14"] = province_daily_sales_df.groupby("Province")["Daily_Revenue"].transform(
    lambda x: x.shift(1).rolling(window=14).mean()
)

province_daily_sales_df["Rolling_30"] = province_daily_sales_df.groupby("Province")["Daily_Revenue"].transform(
    lambda x: x.shift(1).rolling(window=30).mean()
)

province_daily_sales_df = province_daily_sales_df.dropna().reset_index(drop=True)

try:
    encoder = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
except TypeError:
    encoder = OneHotEncoder(sparse=False, handle_unknown="ignore")

province_encoded = encoder.fit_transform(province_daily_sales_df[["Province"]])

province_encoded_df = pd.DataFrame(
    province_encoded,
    columns=encoder.get_feature_names_out(["Province"])
)

province_daily_sales_df = pd.concat(
    [province_daily_sales_df.reset_index(drop=True), province_encoded_df.reset_index(drop=True)],
    axis=1
)

province_daily_sales_df = province_daily_sales_df.sort_values(
    ["Transaction Date", "Province"]
).reset_index(drop=True)

overall_feature_columns = [
    "Year",
    "Month",
    "Day",
    "DayOfWeek",
    "IsWeekend",
    "Lag_1",
    "Lag_7",
    "Lag_14",
    "Lag_30",
    "Rolling_7",
    "Rolling_14",
    "Rolling_30"
]

province_encoded_columns = list(encoder.get_feature_names_out(["Province"]))

province_feature_columns = [
    "Year",
    "Month",
    "Day",
    "DayOfWeek",
    "IsWeekend",
    "Lag_1",
    "Lag_7",
    "Lag_14",
    "Lag_30",
    "Rolling_7",
    "Rolling_14",
    "Rolling_30"
] + province_encoded_columns

target_column = "Daily_Revenue"

# print("\nProvince-wise daily sales dataframe after feature engineering and encoding:")
# print(province_daily_sales_df.shape)

# print("\nFirst 10 rows:")
# print(province_daily_sales_df.head(10))

# print("\nLast 10 rows:")
# print(province_daily_sales_df.tail(10))

# print("\nOverall feature columns:")
# print(overall_feature_columns)

# print("\nProvince feature columns:")
# print(province_feature_columns)

# print("\nTarget column:")
# print(target_column)

# print("\nFinal daily_sales_df shape:")
# print(daily_sales_df.shape)

# print("\nFinal province_daily_sales_df shape:")
# print(province_daily_sales_df.shape)

train_overall_df = daily_sales_df[
    daily_sales_df["Transaction Date"] < "2023-11-01"
].copy()

test_overall_df = daily_sales_df[
    daily_sales_df["Transaction Date"] >= "2023-11-01"
].copy()

train_provincial_df = province_daily_sales_df[
    province_daily_sales_df["Transaction Date"] < "2023-11-01"
].copy()

test_provincial_df = province_daily_sales_df[
    province_daily_sales_df["Transaction Date"] >= "2023-11-01"
].copy()

X_train_overall = train_overall_df[overall_feature_columns]
y_train_overall = train_overall_df[target_column]

X_test_overall = test_overall_df[overall_feature_columns]
y_test_overall = test_overall_df[target_column]

X_train_provincial = train_provincial_df[province_feature_columns]
y_train_provincial = train_provincial_df[target_column]

X_test_provincial = test_provincial_df[province_feature_columns]
y_test_provincial = test_provincial_df[target_column]

# print("\nOverall train date range:")
# print(train_overall_df["Transaction Date"].min(), "to", train_overall_df["Transaction Date"].max())

# print("\nOverall test date range:")
# print(test_overall_df["Transaction Date"].min(), "to", test_overall_df["Transaction Date"].max())

# print("\nProvincial train date range:")
# print(train_provincial_df["Transaction Date"].min(), "to", train_provincial_df["Transaction Date"].max())

# print("\nProvincial test date range:")
# print(test_provincial_df["Transaction Date"].min(), "to", test_provincial_df["Transaction Date"].max())

# print("\nX_train_overall shape:")
# print(X_train_overall.shape)

# print("\ny_train_overall shape:")
# print(y_train_overall.shape)

# print("\nX_test_overall shape:")
# print(X_test_overall.shape)

# print("\ny_test_overall shape:")
# print(y_test_overall.shape)

# print("\nX_train_provincial shape:")
# print(X_train_provincial.shape)

# print("\ny_train_provincial shape:")
# print(y_train_provincial.shape)

# print("\nX_test_provincial shape:")
# print(X_test_provincial.shape)

# print("\ny_test_provincial shape:")
# print(y_test_provincial.shape)


overall_model = XGBRegressor(
    n_estimators=100,
    learning_rate=0.05,
    max_depth=5,
    random_state=42
)

overall_model.fit(X_train_overall, y_train_overall)

overall_predictions = overall_model.predict(X_test_overall)

overall_mae = mean_absolute_error(y_test_overall, overall_predictions)
overall_rmse = np.sqrt(mean_squared_error(y_test_overall, overall_predictions))
overall_r2 = r2_score(y_test_overall, overall_predictions)

print("\nOverall Model Performance:")
print("MAE:", overall_mae)
print("RMSE:", overall_rmse)
print("R2 Score:", overall_r2)


provincial_model = XGBRegressor(
    n_estimators=100,
    learning_rate=0.05,
    max_depth=5,
    random_state=42
)

provincial_model.fit(X_train_provincial, y_train_provincial)

provincial_predictions = provincial_model.predict(X_test_provincial)

provincial_results_df = test_provincial_df.copy()

provincial_results_df["Predicted_Revenue"] = provincial_predictions
provincial_results_df["Error"] = provincial_results_df["Daily_Revenue"] - provincial_results_df["Predicted_Revenue"]
provincial_results_df["Absolute_Error"] = provincial_results_df["Error"].abs()

province_metrics = []

for province in provincial_results_df["Province"].unique():
    province_data = provincial_results_df[
        provincial_results_df["Province"] == province
    ]

    mae = mean_absolute_error(
        province_data["Daily_Revenue"],
        province_data["Predicted_Revenue"]
    )

    rmse = np.sqrt(mean_squared_error(
        province_data["Daily_Revenue"],
        province_data["Predicted_Revenue"]
    ))

    r2 = r2_score(
        province_data["Daily_Revenue"],
        province_data["Predicted_Revenue"]
    )

    province_metrics.append({
        "Province": province,
        "MAE": mae,
        "RMSE": rmse,
        "R2 Score": r2
    })

province_metrics_df = pd.DataFrame(province_metrics)

print("\nProvince-wise Model Performance:")
print(province_metrics_df.sort_values("RMSE"))

overall_model.fit(
    daily_sales_df[overall_feature_columns],
    daily_sales_df[target_column]
)

provincial_model.fit(
    province_daily_sales_df[province_feature_columns],
    province_daily_sales_df[target_column]
)

forecast_dates_2024 = pd.date_range(
    start="2024-01-01",
    end="2024-12-31",
    freq="D"
)

overall_history = daily_sales_df.sort_values("Transaction Date")["Daily_Revenue"].tolist()

overall_2024_rows = []

for current_date in forecast_dates_2024:
    overall_future_row = {
        "Year": current_date.year,
        "Month": current_date.month,
        "Day": current_date.day,
        "DayOfWeek": current_date.dayofweek,
        "IsWeekend": int(current_date.dayofweek in [5, 6]),
        "Lag_1": overall_history[-1],
        "Lag_7": overall_history[-7],
        "Lag_14": overall_history[-14],
        "Lag_30": overall_history[-30],
        "Rolling_7": np.mean(overall_history[-7:]),
        "Rolling_14": np.mean(overall_history[-14:]),
        "Rolling_30": np.mean(overall_history[-30:])
    }

    overall_2024_prediction_input = pd.DataFrame([overall_future_row])
    overall_2024_prediction_input = overall_2024_prediction_input[overall_feature_columns]

    overall_predictions_2024 = overall_model.predict(overall_2024_prediction_input)

    predicted_overall_revenue = overall_predictions_2024[0]
    predicted_overall_revenue = max(0, predicted_overall_revenue)

    overall_2024_rows.append({
        "Transaction Date": current_date,
        "Predicted_Overall_Revenue": predicted_overall_revenue
    })

    overall_history.append(predicted_overall_revenue)

overall_forecast_2024_df = pd.DataFrame(overall_2024_rows)

province_history = {}

for province in sorted(province_daily_sales_df["Province"].unique()):
    province_history[province] = (
        province_daily_sales_df[
            province_daily_sales_df["Province"] == province
        ]
        .sort_values("Transaction Date")["Daily_Revenue"]
        .tolist()
    )

province_2024_rows = []

for current_date in forecast_dates_2024:
    for province in sorted(province_history.keys()):
        history = province_history[province]

        provincial_future_row = {
            "Year": current_date.year,
            "Month": current_date.month,
            "Day": current_date.day,
            "DayOfWeek": current_date.dayofweek,
            "IsWeekend": int(current_date.dayofweek in [5, 6]),
            "Lag_1": history[-1],
            "Lag_7": history[-7],
            "Lag_14": history[-14],
            "Lag_30": history[-30],
            "Rolling_7": np.mean(history[-7:]),
            "Rolling_14": np.mean(history[-14:]),
            "Rolling_30": np.mean(history[-30:])
        }

        provincial_2024_prediction_input = pd.DataFrame([provincial_future_row])

        province_encoded_2024 = encoder.transform(
            pd.DataFrame({"Province": [province]})
        )

        province_encoded_2024_df = pd.DataFrame(
            province_encoded_2024,
            columns=province_encoded_columns
        )

        provincial_2024_prediction_input = pd.concat(
            [
                provincial_2024_prediction_input.reset_index(drop=True),
                province_encoded_2024_df.reset_index(drop=True)
            ],
            axis=1
        )

        provincial_2024_prediction_input = provincial_2024_prediction_input[province_feature_columns]

        provincial_predictions_2024 = provincial_model.predict(provincial_2024_prediction_input)

        predicted_province_revenue = provincial_predictions_2024[0]
        predicted_province_revenue = max(0, predicted_province_revenue)

        province_2024_rows.append({
            "Transaction Date": current_date,
            "Province": province,
            "Predicted_Province_Revenue": predicted_province_revenue
        })

        province_history[province].append(predicted_province_revenue)

province_forecast_2024_df = pd.DataFrame(province_2024_rows)

overall_forecast_2024_df["Year"] = overall_forecast_2024_df["Transaction Date"].dt.year
overall_forecast_2024_df["Month"] = overall_forecast_2024_df["Transaction Date"].dt.month

province_forecast_2024_df["Year"] = province_forecast_2024_df["Transaction Date"].dt.year
province_forecast_2024_df["Month"] = province_forecast_2024_df["Transaction Date"].dt.month

overall_monthly_forecast_2024_df = overall_forecast_2024_df.groupby(
    ["Year", "Month"]
).agg(
    Predicted_Overall_Revenue=("Predicted_Overall_Revenue", "sum")
).reset_index()

province_monthly_forecast_2024_df = province_forecast_2024_df.groupby(
    ["Year", "Month", "Province"]
).agg(
    Predicted_Province_Revenue=("Predicted_Province_Revenue", "sum")
).reset_index()

print("\nOverall 2024 Daily Forecast:")
print(overall_forecast_2024_df.head())
print(overall_forecast_2024_df.tail())

print("\nProvince-wise 2024 Daily Forecast:")
print(province_forecast_2024_df.head(20))
print(province_forecast_2024_df.tail(20))

print("\nOverall 2024 Monthly Forecast:")
print(overall_monthly_forecast_2024_df)

print("\nProvince-wise 2024 Monthly Forecast:")
print(province_monthly_forecast_2024_df)

overall_forecast_2024_df.to_csv("overall_forecast_2024_daily.csv", index=False)
province_forecast_2024_df.to_csv("province_forecast_2024_daily.csv", index=False)

overall_monthly_forecast_2024_df.to_csv("overall_forecast_2024_monthly.csv", index=False)
province_monthly_forecast_2024_df.to_csv("province_forecast_2024_monthly.csv", index=False)