from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # برای اجازه دادن به مینی‌اپ جهت ارسال داده

# اطلاعات ربات و ادمین
BOT_TOKEN = "8418244556:AAFy6h9Rdwrp2F5EttzsKChMfjMbA4fcJtM"
ADMIN_ID = "1309025996"

def send_telegram(chat_id, text):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "HTML"}
    try:
        requests.post(url, json=payload, timeout=5)
    except Exception as e:
        print("Telegram Send Error:", e)

@app.route('/')
def home():
    return "سرور بلک نت فعال است 🚀"

# دریافت اطلاعات خرید یا ثبت برنده اسپین
@app.route('/api/action', methods=['POST'])
def handle_action():
    data = request.json or {}
    action_type = data.get('action') # 'buy' یا 'spin'
    user_info = data.get('user', {})
    user_name = user_info.get('first_name', 'ناشناس')
    user_id = user_info.get('id', 'نامشخص')

    if action_type == 'buy':
        product_name = data.get('product', 'محصول نامشخص')
        # پیام برای ادمین
        msg = f"🛒 <b>سفارش جدید ثبت شد!</b>\n\n👤 کاربر: {user_name} (<code>{user_id}</code>)\n📦 محصول: {product_name}"
        send_telegram(ADMIN_ID, msg)
        return jsonify({"status": "ok", "message": "سفارش ارسال شد"})

    elif action_type == 'spin':
        prize = data.get('prize', 'نامشخص')
        msg = f"🎁 <b>برنده گردونه شانس!</b>\n\n👤 کاربر: {user_name} (<code>{user_id}</code>)\n🎉 جایزه: {prize}"
        send_telegram(ADMIN_ID, msg)
        return jsonify({"status": "ok", "message": "جایزه ثبت شد"})

    return jsonify({"status": "error"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
  
