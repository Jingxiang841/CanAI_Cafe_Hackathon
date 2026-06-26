# CanAI Café Sales Forecasting Model
 
This project builds machine learning models to forecast CanAI Café sales using cleaned transaction-level sales data. The goal is to predict daily revenue for both overall café sales and province-wise café sales.
 
## Project Objective
 
The main objective of this model is to forecast future sales performance using historical 2023 sales data.
 
The project produces:
 
- Overall daily sales forecasting
- Province-wise daily sales forecasting
- 2024 overall daily and monthly sales predictions
- 2024 province-wise daily and monthly sales predictions
 
## Dataset
 
The model uses the file:
 
```text
Cleaned_CanAI_Cafe_Data.csv
```
 
The dataset includes transaction-level café sales information such as:
 
- Transaction Date
- Item
- Quantity
- Price Per Unit
- Total Spent
- Payment Method
- Location
- Province
- Transaction ID
 
## Main Target Variable
 
The target variable used for prediction is:
 
```text
Daily_Revenue
```
 
This is created by grouping transaction-level sales by date and summing the `Total Spent` column.
 
## Why This Is a Regression Problem
 
This is a regression-based machine learning problem because the model predicts a continuous numerical value: daily revenue.
 
The model is not predicting a category such as payment method or province. Instead, it predicts a dollar amount for future sales.
 
## Data Preprocessing Steps
 
The preprocessing pipeline performs the following steps:
 
1. Loads the cleaned sales dataset.
2. Replaces `Unknown` values with `NaN`.
3. Converts `Transaction Date` into datetime format.
4. Drops rows with missing transaction dates.
5. Creates date-based features such as year, month, day, day of week, and weekend indicator.
6. Checks duplicate transaction IDs.
7. Drops `Transaction ID` because it is not useful for forecasting.
8. Verifies that:
 
```text
Total Spent = Quantity × Price Per Unit
```
 
9. Sorts the data by transaction date.
 
## Overall Sales Forecasting DataFrame
 
The overall forecasting dataframe is:
 
```python
daily_sales_df
```
 
It is created by grouping the data by `Transaction Date`.
 
It contains:
 
- Transaction Date
- Daily Revenue
- Daily Quantity
- Number of Transactions
 
This dataframe is used to train the overall sales forecasting model.
 
## Province-Wise Sales Forecasting DataFrame
 
The province-wise forecasting dataframe is:
 
```python
province_daily_sales_df
```
 
It is created by grouping the data by:
 
```text
Transaction Date + Province
```
 
Rows with missing province values are removed because province-wise forecasting requires a known province.
 
Ontario is excluded because it has very few transactions compared with the other provinces, making it unreliable for province-level forecasting.
 
The province-wise model keeps:
 
- British Columbia
- Manitoba
- Newfoundland
- Saskatchewan
 
## Feature Engineering
 
Feature engineering is used to create useful prediction columns from the historical sales data.
 
The model uses date features:
 
- Year
- Month
- Day
- DayOfWeek
- IsWeekend
 
The model also uses lag features:
 
- Lag_1
- Lag_7
- Lag_14
- Lag_30
 
These represent past revenue values from 1, 7, 14, and 30 days before the current date.
 
Rolling average features are also created:
 
- Rolling_7
- Rolling_14
- Rolling_30
 
These represent the average revenue from the previous 7, 14, and 30 days.
 
The lag and rolling features help the model learn recent sales trends and patterns.
 
## Encoding
 
The province-wise model uses one-hot encoding for the `Province` column.
 
This converts province names into numerical columns so the XGBoost model can use them.
 
Example encoded columns:
 
- Province_British Columbia
- Province_Manitoba
- Province_Newfoundland
- Province_Saskatchewan
 
## Train-Test Split
 
The model uses a time-based train-test split instead of a random split.
 
Training period:
 
```text
January 2023 to October 2023
```
 
Testing period:
 
```text
November 2023 to December 2023
```
 
This is important because forecasting models should be tested on future data, not randomly shuffled data.
 
## Model Used
 
The model used is:
 
```python
XGBRegressor
```
 
XGBoost was selected because:
 
- The problem is regression-based.
- The target variable is daily revenue.
- The data contains non-linear sales patterns.
- XGBoost works well with tabular data.
- It can learn relationships between date features, lag values, rolling averages, and sales revenue.
- It does not require feature scaling.
 
## Models Trained
 
Two XGBoost models are trained:
 
```python
overall_model
```
 
Used for predicting overall daily café revenue.
 
```python
provincial_model
```
 
Used for predicting daily province-wise café revenue.
 
## Evaluation Metrics
 
The models are evaluated using:
 
### MAE
 
Mean Absolute Error measures the average prediction error in dollars.
 
### RMSE
 
Root Mean Squared Error penalizes larger prediction errors more heavily.
 
### R² Score
 
R² Score shows how much of the variation in sales revenue is explained by the model.
 
## Reported Model Performance
 
### Overall Model Performance
 
```text
MAE: 45.5131
RMSE: 59.1342
R2 Score: 0.6395
```
 
This means the overall model predicts daily revenue with an average error of about $45.51 per day.
 
### Province-Wise Model Performance
 
```text
Province             MAE       RMSE      R2 Score
Manitoba             19.01     23.35     0.31
Saskatchewan         18.54     24.19     0.22
Newfoundland         23.11     32.48     0.28
British Columbia     29.72     40.33     0.21
```
 
The province-wise model evaluates each province separately by comparing predicted daily sales against actual daily sales for that province.
 
## 2024 Forecasting
 
After evaluation, the models are retrained using all available 2023 data.
 
The code then predicts sales for every day in 2024.
 
The forecast outputs include:
 
```python
overall_forecast_2024_df
```
 
Daily overall sales forecast for 2024.
 
```python
province_forecast_2024_df
```
 
Daily province-wise sales forecast for 2024.
 
```python
overall_monthly_forecast_2024_df
```
 
Monthly overall sales forecast for 2024.
 
```python
province_monthly_forecast_2024_df
```
 
Monthly province-wise sales forecast for 2024.
 
## Output Files
 
The script exports the following CSV files:
 
```text
overall_forecast_2024_daily.csv
province_forecast_2024_daily.csv
overall_forecast_2024_monthly.csv
province_forecast_2024_monthly.csv
```
 
## Important Note About 2024
 
The year 2024 is a leap year, so it contains 366 days. The code forecasts from:
 
```text
2024-01-01 to 2024-12-31
```
 
## How to Run the Project
 
Install the required libraries:
 
```bash
pip install pandas numpy scikit-learn xgboost
```
 
Run the Python script:
 
```bash
python model_training.py
```
 
Make sure the following dataset is in the same folder as the script:
 
```text
Cleaned_CanAI_Cafe_Data.csv
```
 
## Final Summary
 
This project creates a complete sales forecasting pipeline for CanAI Café. It cleans the transaction data, prepares daily sales datasets, creates time-based forecasting features, trains XGBoost regression models, evaluates the models using daily actual vs predicted sales, and generates full-year 2024 sales forecasts for both overall revenue and province-wise revenue.