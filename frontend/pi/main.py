import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import pickle
from datetime import datetime, timedelta
import time
import board
import adafruit_ina219

print("=" * 70)
print("SOLAR VOLTAGE PREDICTION - REAL DATA COLLECTION & MODEL TRAINING")
print("=" * 70)

# Initialize INA219 sensor
def initialize_sensor():
    print("\n🔌 INITIALIZING VOLTAGE SENSOR...")
    print("-" * 70)
    try:
        i2c = board.I2C()
        ina219 = adafruit_ina219.INA219(i2c)
        print("✓ INA219 voltage sensor initialized successfully")
        
        # Test reading
        test_voltage = ina219.bus_voltage
        print(f"✓ Test reading: {test_voltage:.2f}V")
        print()
        return ina219
    except Exception as e:
        print(f"✗ Failed to initialize INA219: {e}")
        print("Please check your wiring and I2C connection!")
        return None

# Get data collection parameters from user
def get_collection_parameters():
    print("📊 DATA COLLECTION SETUP")
    print("-" * 70)
    
    while True:
        try:
            print("\nHow long should data be collected?")
            print("Options:")
            print("  1. Minutes (for quick testing)")
            print("  2. Hours (for detailed training)")
            print("  3. Days (for best accuracy)")
            
            choice = input("\nSelect option (1/2/3): ").strip()
            
            if choice == '1':
                duration_value = float(input("Enter duration in minutes: "))
                duration_seconds = duration_value * 60
                duration_text = f"{duration_value} minute(s)"
            elif choice == '2':
                duration_value = float(input("Enter duration in hours: "))
                duration_seconds = duration_value * 3600
                duration_text = f"{duration_value} hour(s)"
            elif choice == '3':
                duration_value = float(input("Enter duration in days: "))
                duration_seconds = duration_value * 86400
                duration_text = f"{duration_value} day(s)"
            else:
                print("Invalid choice. Please select 1, 2, or 3.")
                continue
            
            break
        except ValueError:
            print("Invalid input. Please enter a valid number.")
    
    while True:
        try:
            print("\nWhat interval between readings?")
            print("Examples:")
            print("  - 5 seconds (very detailed)")
            print("  - 30 seconds (detailed)")
            print("  - 1-5 minutes (normal)")
            print("  - 10-30 minutes (light)")
            
            interval_value = float(input("\nEnter interval in seconds: "))
            
            if interval_value < 1:
                print("Interval too small. Minimum 1 second.")
                continue
            
            interval_text = f"{interval_value} second(s)"
            break
        except ValueError:
            print("Invalid input. Please enter a valid number.")
    
    # Calculate expected number of readings
    expected_readings = int(duration_seconds / interval_value)
    
    print("\n" + "=" * 70)
    print("COLLECTION SUMMARY")
    print("-" * 70)
    print(f"Duration:          {duration_text}")
    print(f"Interval:          {interval_text}")
    print(f"Expected readings: ~{expected_readings}")
    print(f"Start time:        {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"End time:          {(datetime.now() + timedelta(seconds=duration_seconds)).strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    confirm = input("\nProceed with data collection? (yes/no): ").strip().lower()
    if confirm not in ['yes', 'y']:
        print("Data collection cancelled.")
        return None, None, None
    
    return duration_seconds, interval_value, expected_readings

# Collect voltage data
def collect_voltage_data(ina219, duration_seconds, interval_seconds):
    print("\n📡 STARTING DATA COLLECTION...")
    print("-" * 70)
    print("Press Ctrl+C to stop early\n")
    
    data = {
        'timestamp': [],
        'hour': [],
        'voltage': []
    }
    
    start_time = time.time()
    end_time = start_time + duration_seconds
    reading_count = 0
    
    try:
        while time.time() < end_time:
            try:
                # Read voltage
                voltage = ina219.bus_voltage
                current_time = datetime.now()
                hour_decimal = current_time.hour + current_time.minute / 60.0
                
                # Store data
                data['timestamp'].append(current_time.strftime('%Y-%m-%d %H:%M:%S'))
                data['hour'].append(hour_decimal)
                data['voltage'].append(voltage)
                
                reading_count += 1
                
                # Display progress
                elapsed = time.time() - start_time
                remaining = end_time - time.time()
                progress = (elapsed / duration_seconds) * 100
                
                print(f"[{reading_count:4d}] {current_time.strftime('%H:%M:%S')} | "
                      f"Voltage: {voltage:6.2f}V | "
                      f"Progress: {progress:5.1f}% | "
                      f"Remaining: {remaining/60:6.1f} min", end='\r')
                
                # Wait for next reading
                time.sleep(interval_seconds)
                
            except RuntimeError:
                # Sensor read error, skip this reading
                continue
            except Exception as e:
                print(f"\nError reading sensor: {e}")
                continue
    
    except KeyboardInterrupt:
        print("\n\n⚠  Data collection stopped by user")
    
    print("\n" + "-" * 70)
    print(f"✓ Collected {reading_count} readings")
    print("=" * 70)
    
    return pd.DataFrame(data)

# Save collected data
def save_raw_data(df, filename='collected_voltage_data.csv'):
    df.to_csv(filename, index=False)
    print(f"\n💾 Raw data saved to '{filename}'")

# Synthesize additional data based on collected patterns
def synthesize_from_collected(df, multiplier=5):
    print(f"\n🔄 SYNTHESIZING ADDITIONAL DATA (x{multiplier})...")
    print("-" * 70)
    
    original_count = len(df)
    
    # Fit a polynomial to the collected data
    hours = df['hour'].values
    voltages = df['voltage'].values
    
    # Remove outliers
    q1 = np.percentile(voltages, 25)
    q3 = np.percentile(voltages, 75)
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    
    mask = (voltages >= lower_bound) & (voltages <= upper_bound)
    hours_clean = hours[mask]
    voltages_clean = voltages[mask]
    
    # Fit polynomial
    degree = min(5, len(hours_clean) // 10 + 2)  # Adaptive degree
    z = np.polyfit(hours_clean, voltages_clean, degree)
    p = np.poly1d(z)
    
    # Generate synthetic data
    synthetic_data = []
    hour_min = hours.min()
    hour_max = hours.max()
    
    # Generate points throughout the day based on pattern
    synthetic_hours = np.linspace(hour_min, hour_max, original_count * multiplier)
    
    for hour in synthetic_hours:
        base_voltage = p(hour)
        
        # Add realistic noise based on actual data variance
        noise_std = np.std(voltages_clean) * 0.3
        noise = np.random.normal(0, noise_std)
        
        synthetic_voltage = base_voltage + noise
        synthetic_voltage = max(0, min(synthetic_voltage, 13))  # Clip to realistic range
        
        synthetic_data.append({
            'hour': hour,
            'voltage': synthetic_voltage
        })
    
    synthetic_df = pd.DataFrame(synthetic_data)
    
    print(f"✓ Original data: {original_count} points")
    print(f"✓ Synthetic data: {len(synthetic_df)} points")
    print(f"✓ Total dataset: {original_count + len(synthetic_df)} points")
    print()
    
    return synthetic_df

# Train models
def train_models(X, y):
    print("🤖 TRAINING MODELS...")
    print("-" * 70)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    models = {}
    results = {}
    
    # 1. Linear Regression
    print("Training Linear Regression...")
    lr = LinearRegression()
    lr.fit(X_train, y_train)
    y_pred_lr = lr.predict(X_test)
    models['Linear'] = lr
    results['Linear'] = {
        'rmse': np.sqrt(mean_squared_error(y_test, y_pred_lr)),
        'r2': r2_score(y_test, y_pred_lr)
    }
    
    # 2. Polynomial Regression
    print("Training Polynomial Regression (degree 5)...")
    poly = PolynomialFeatures(degree=5)
    X_train_poly = poly.fit_transform(X_train)
    X_test_poly = poly.transform(X_test)
    
    pr = LinearRegression()
    pr.fit(X_train_poly, y_train)
    y_pred_pr = pr.predict(X_test_poly)
    models['Polynomial'] = {'model': pr, 'poly': poly}
    results['Polynomial'] = {
        'rmse': np.sqrt(mean_squared_error(y_test, y_pred_pr)),
        'r2': r2_score(y_test, y_pred_pr)
    }
    
    # 3. Random Forest
    print("Training Random Forest...")
    rf = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    rf.fit(X_train, y_train)
    y_pred_rf = rf.predict(X_test)
    models['Random Forest'] = rf
    results['Random Forest'] = {
        'rmse': np.sqrt(mean_squared_error(y_test, y_pred_rf)),
        'r2': r2_score(y_test, y_pred_rf)
    }
    
    print("✅ Training complete!\n")
    return models, results

# Display results
def display_results(results):
    print("📈 MODEL PERFORMANCE")
    print("-" * 70)
    print(f"{'Model':<20} {'RMSE':<15} {'R² Score':<15}")
    print("-" * 70)
    
    best_model = None
    best_r2 = -999
    
    for model_name, metrics in results.items():
        print(f"{model_name:<20} {metrics['rmse']:<15.4f} {metrics['r2']:<15.4f}")
        if metrics['r2'] > best_r2:
            best_r2 = metrics['r2']
            best_model = model_name
    
    print("-" * 70)
    print(f"🏆 Best Model: {best_model} (R² = {best_r2:.4f})\n")
    return best_model

# Visualize predictions
def visualize_predictions(models, collected_df, synthetic_df, all_hours, all_voltages):
    print("📊 GENERATING VISUALIZATIONS...")
    
    time_range = np.linspace(0, 24, 200).reshape(-1, 1)
    
    plt.figure(figsize=(16, 10))
    
    # Plot 1: All models comparison with collected data
    plt.subplot(2, 3, 1)
    plt.scatter(collected_df['hour'], collected_df['voltage'], 
                color='red', s=50, label='Collected Data', zorder=5, alpha=0.6)
    plt.scatter(synthetic_df['hour'], synthetic_df['voltage'], 
                color='lightblue', s=10, label='Synthetic Data', alpha=0.3)
    
    for model_name, model in models.items():
        if model_name == 'Polynomial':
            X_pred = model['poly'].transform(time_range)
            y_pred = model['model'].predict(X_pred)
        else:
            y_pred = model.predict(time_range)
        
        plt.plot(time_range, y_pred, label=f'{model_name}', linewidth=2)
    
    plt.xlabel('Hour of Day', fontsize=11)
    plt.ylabel('Voltage (V)', fontsize=11)
    plt.title('Solar Voltage Prediction - All Models', fontsize=13, fontweight='bold')
    plt.legend(fontsize=9)
    plt.grid(True, alpha=0.3)
    plt.xlim(0, 24)
    
    # Plot 2: Best model with confidence band
    plt.subplot(2, 3, 2)
    plt.scatter(collected_df['hour'], collected_df['voltage'], 
                color='red', s=50, label='Collected Data', zorder=5, alpha=0.8)
    
    poly_model = models['Polynomial']
    X_pred = poly_model['poly'].transform(time_range)
    y_pred = poly_model['model'].predict(X_pred)
    y_pred = np.clip(y_pred, 0, 13)
    
    plt.plot(time_range, y_pred, color='green', linewidth=3, label='Polynomial Prediction')
    plt.fill_between(time_range.flatten(), 
                     np.maximum(y_pred - 0.5, 0), 
                     y_pred + 0.5, 
                     alpha=0.2, color='green', label='Confidence (±0.5V)')
    
    plt.xlabel('Hour of Day', fontsize=11)
    plt.ylabel('Voltage (V)', fontsize=11)
    plt.title('Best Model Prediction', fontsize=13, fontweight='bold')
    plt.legend(fontsize=9)
    plt.grid(True, alpha=0.3)
    plt.xlim(0, 24)
    
    # Plot 3: Collected data timeline
    plt.subplot(2, 3, 3)
    collection_order = range(len(collected_df))
    plt.plot(collection_order, collected_df['voltage'].values, 
             marker='o', markersize=3, linewidth=1, color='blue')
    plt.xlabel('Reading Number', fontsize=11)
    plt.ylabel('Voltage (V)', fontsize=11)
    plt.title('Data Collection Timeline', fontsize=13, fontweight='bold')
    plt.grid(True, alpha=0.3)
    
    # Plot 4: Hourly predictions table
    plt.subplot(2, 3, 4)
    plt.axis('off')
    
    hourly_predictions = []
    for hour in range(6, 20, 2):
        X_hour = poly_model['poly'].transform([[hour]])
        voltage = poly_model['model'].predict(X_hour)[0]
        voltage = max(0, min(voltage, 13))
        hourly_predictions.append([f"{hour:02d}:00", f"{voltage:.2f}V"])
    
    table = plt.table(cellText=hourly_predictions, 
                     colLabels=['Time', 'Voltage'],
                     cellLoc='center',
                     loc='center',
                     colWidths=[0.35, 0.35])
    table.auto_set_font_size(False)
    table.set_fontsize(9)
    table.scale(1, 1.8)
    
    for i in range(1, len(hourly_predictions) + 1):
        voltage_val = float(hourly_predictions[i-1][1].replace('V', ''))
        if voltage_val > 10:
            color = '#90EE90'
        elif voltage_val > 5:
            color = '#FFD700'
        else:
            color = '#FFB6C1'
        table[(i, 1)].set_facecolor(color)
    
    plt.title('Hourly Predictions', fontsize=13, fontweight='bold', pad=20)
    
    # Plot 5: Voltage distribution
    plt.subplot(2, 3, 5)
    plt.hist(collected_df['voltage'], bins=20, color='orange', 
             alpha=0.7, edgecolor='black')
    plt.xlabel('Voltage (V)', fontsize=11)
    plt.ylabel('Frequency', fontsize=11)
    plt.title('Collected Voltage Distribution', fontsize=13, fontweight='bold')
    plt.grid(True, alpha=0.3, axis='y')
    
    # Plot 6: Statistics
    plt.subplot(2, 3, 6)
    plt.axis('off')
    
    max_voltage = collected_df['voltage'].max()
    min_voltage = collected_df['voltage'].min()
    avg_voltage = collected_df['voltage'].mean()
    std_voltage = collected_df['voltage'].std()
    
    stats_text = f"""
    DATA COLLECTION STATISTICS
    ═══════════════════════════════
    
    Total Readings:      {len(collected_df)}
    
    Max Voltage:         {max_voltage:.2f}V
    Min Voltage:         {min_voltage:.2f}V
    Average Voltage:     {avg_voltage:.2f}V
    Std Deviation:       {std_voltage:.2f}V
    
    Collection Period:
    From: {collected_df['timestamp'].iloc[0]}
    To:   {collected_df['timestamp'].iloc[-1]}
    
    Model: Polynomial Deg 5
    """
    
    plt.text(0.1, 0.9, stats_text, fontsize=10, family='monospace',
            verticalalignment='top', 
            bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.7))
    
    plt.tight_layout()
    plt.savefig('real_solar_voltage_predictions.png', dpi=300, bbox_inches='tight')
    print("✅ Saved visualization as 'real_solar_voltage_predictions.png'\n")
    plt.show()

# Save model
def save_model(model, collected_df, model_name='real_solar_model.pkl', 
               metadata_name='real_model_metadata.pkl'):
    print(f"💾 SAVING MODEL...")
    print("-" * 70)
    
    with open(model_name, 'wb') as f:
        pickle.dump(model, f)
    print(f"✓ Model saved as '{model_name}'")
    
    metadata = {
        'model_type': 'Polynomial Regression (Degree 5)',
        'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'data_points': len(collected_df),
        'collection_start': collected_df['timestamp'].iloc[0],
        'collection_end': collected_df['timestamp'].iloc[-1],
        'max_voltage': float(collected_df['voltage'].max()),
        'min_voltage': float(collected_df['voltage'].min()),
        'avg_voltage': float(collected_df['voltage'].mean()),
        'features': ['hour_of_day'],
        'target': 'voltage'
    }
    
    with open(metadata_name, 'wb') as f:
        pickle.dump(metadata, f)
    print(f"✓ Metadata saved as '{metadata_name}'\n")

# Predict voltage
def predict_voltage(model, hour):
    if isinstance(model, dict):
        X = model['poly'].transform([[hour]])
        voltage = model['model'].predict(X)[0]
    else:
        voltage = model.predict([[hour]])[0]
    return max(0, min(voltage, 13))

# Main function
def main():
    print("\n🌞 Solar Voltage Prediction - Real Data Collection\n")
    
    # Initialize sensor
    ina219 = initialize_sensor()
    if ina219 is None:
        return
    
    # Get collection parameters
    duration, interval, expected_readings = get_collection_parameters()
    if duration is None:
        return
    
    # Collect data
    collected_df = collect_voltage_data(ina219, duration, interval)
    
    if len(collected_df) < 10:
        print("\n⚠  Not enough data collected (minimum 10 readings required)")
        return
    
    # Save raw data
    save_raw_data(collected_df)
    
    # Synthesize additional data
    synthetic_df = synthesize_from_collected(collected_df, multiplier=5)
    
    # Combine data
    all_hours = np.concatenate([collected_df['hour'].values, synthetic_df['hour'].values])
    all_voltages = np.concatenate([collected_df['voltage'].values, synthetic_df['voltage'].values])
    
    X = all_hours.reshape(-1, 1)
    y = all_voltages
    
    # Train models
    models, results = train_models(X, y)
    
    # Display results
    best_model_name = display_results(results)
    
    # Visualize
    visualize_predictions(models, collected_df, synthetic_df, all_hours, all_voltages)
    
    # Save model
    best_model = models[best_model_name]
    save_model(best_model, collected_df)
    
    # Demo predictions
    print("🔮 SAMPLE PREDICTIONS")
    print("-" * 70)
    for hour in [6, 9, 12, 15, 18]:
        voltage = predict_voltage(best_model, hour)
        print(f"  ⚡ {hour:02d}:00 → {voltage:.2f}V")
    
    print("\n" + "=" * 70)
    print("✅ Model training complete!")
    print("📁 Files saved:")
    print("   - collected_voltage_data.csv (raw collected data)")
    print("   - real_solar_model.pkl (trained model)")
    print("   - real_model_metadata.pkl (model information)")
    print("   - real_solar_voltage_predictions.png (visualization)")
    print("=" * 70)

if _name_ == "_main_":
    main()