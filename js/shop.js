// دریافت شناسه کاربر تلگرام
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

// لیست محصولات مجازی فروشگاه
const products = [
  { id: 1, name: "فیلترشکن مستر ادیشن (۱ ماهه)", price: "۱۵۰,۰۰۰ تومان" },
  { id: 2, name: "اشتراک گوگل جیمینای پرو", price: "۲۸۰,۰۰۰ تومان" },
  { id: 3, name: "اشتراک اختصاصی پرسرعت", price: "۲۰۰,۰۰۰ تومان" }
];

// نمایش محصولات در صفحه
function loadProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = "";
  products.forEach(item => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>قیمت: ${item.price}</p>
      <button onclick="buyProduct(${item.id})">خرید محصول</button>
    `;
    container.appendChild(card);
  });
}

// عملیات کلیک روی دکمه خرید
function buyProduct(productId) {
  const selected = products.find(p => p.id === productId);
  if (!selected) return;

  if (tg) {
    tg.sendData(JSON.stringify({ action: "buy", product: selected }));
    tg.close();
  } else {
    alert("محصول انتخاب شد: " + selected.name);
  }
}

// اجرای تابع پس از لود شدن صفحه
document.addEventListener("DOMContentLoaded", loadProducts);
                                 
