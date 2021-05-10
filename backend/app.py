from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from threading import Lock
from datetime import datetime
import json, time, serial


# Websocket
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

# Threads
socketio_thread = None
daily_prod_thread = None
thread_lock = Lock()

# Variable & Data
solar_data = None
solar_daily_prod = 0
prod_buffer = 0
hour_data = []


# Converting ADC value to real power (W)
def adc_to_watts_converter(adc):
    if isinstance(adc, int):
        voltage = (int(adc)*5.12)/1024
    elif isinstance(adc, float):
        voltage = (float(adc)*5.12)/1024
    else:
        return 0
    current = voltage/10
    return voltage*current


# Daily production algorithm
def daily_production_logger():
    global solar_daily_prod, prod_buffer, hour_data
    minute_timer = time.time()
    current_date = time.localtime().tm_mday
    while True:
        if time.time() - minute_timer > 59:
            minute_timer = time.time()
            hour_data.append(adc_to_watts_converter(solar_data))
            solar_daily_prod = (sum(hour_data)*len(hour_data)/60)+prod_buffer
            if len(hour_data) > 59:
                prod_buffer += solar_daily_prod
                hour_data = []
        if time.localtime().tm_mday != current_date:
            current_date = time.localtime().tm_mday
            minute_timer = time.time()
            hour_data = []
            solar_daily_prod = 0
            prod_buffer = 0
        
        socketio.sleep(0.1)


# Start tasks on client connection.
@socketio.on('connect')
def start_get_data_thread():
    global socketio_thread, daily_prod_thread
    with thread_lock:
        if socketio_thread is None:
            socketio_thread = socketio.start_background_task(target=emit_solar_data)
    with thread_lock:
        if daily_prod_thread is None:
            daily_prod_thread = socketio.start_background_task(target=daily_production_logger)


# Reading signal from through serial port and emitting data to client
def emit_solar_data():
    global solar_data
    while True:
        try:
            serial_data = serial.Serial('/dev/ttyUSB0',115200).readline().decode('utf-8', errors='ignore')
            if serial_data != None:
                solar_data = float(serial_data)
                solar_data_real_power = adc_to_watts_converter(float(serial_data))
                data = {
                    "adc": solar_data,
                    "realPower": solar_data_real_power,
                    "dailyProd": solar_daily_prod,
                }
                socketio.emit('solarDataStream', json.dumps(data), broadcast=True)
                socketio.sleep(0.1)
        except:
            print("Failed to receive or send data")


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
