// فعال‌سازی وب‌اپ تلگرام
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

let balance = 100;
let currentMode = "free";
let isRolling = false;

// لیست محصولات فروشگاه
const products = [
  { id: 1, name: "فیلترشکن مستر ادیشن (۱ ماهه)", price: "۱۵۰,۰۰۰ تومان" },
  { id: 2, name: "اکانت گوگل جیمینای پرو", price: "۲۸۰,۰۰۰ تومان" },
  { id: 3, name: "اشتراک VIP اختصاصی", price: "۲۰۰,۰۰۰ تومان" }
];

// لیست آیتم‌های گردونه
const spinPrizes = [
  { name: "کانفیگ ۱ ماهه", icon: "🚀" },
  { name: "اکانت پرو", icon: "✨" },
  { name: "پوچ", icon: "💩" },
  { name: "تخفیف ۵۰٪", icon: "🏷️" },
  { name: "۵۰ الماس", icon: "💎" },
  { name: "کانفیگ VIP", icon: "⚡" },
  { name: "شانس مجدد", icon: "🔄" }
];

// لود محصولات در فروشگاه
function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";
  
  products.forEach(p => {
    const item = document.createElement("div");
    item.className = "product-card";
    item.innerHTML = `
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.price}</p>
      </div>
      <button class="buy-btn" onclick="onBuyClick(${p.id})">خرید</button>
    `;
    container.appendChild(item);
  });
}

function onBuyClick(id) {
  const p = products.find(x => x.id === id);
  if (tg?.showPopup) {
    tg.showPopup({
      title: "ثبت سفارش",
      message: `آیا مایل به خرید ${p.name} هستید؟`,
      buttons: [{ type: "ok", text: "تایید" }, { type: "cancel" }]
    });
  } else {
    alert(`درخواست خرید برای ${p.name} ثبت شد.`);
  }
}

// سوئیچ تب‌ها از منوی پایین
function switchTab(tab) {
  const shopTab = document.getElementById("tab-shop");
  const spinTab = document.getElementById("tab-spin");
  const btnShop = document.getElementById("btn-tab-shop");
  const btnSpin = document.getElementById("btn-tab-spin");

  if (tab === "shop") {
    shopTab.style.display = "block";
    spinTab.style.display = "none";
    btnShop.classList.add("active");
    btnSpin.classList.remove("active");
  } else {
    shopTab.style.display = "none";
    spinTab.style.display = "block";
    btnSpin.classList.add("active");
    btnShop.classList.remove("active");
  }
}

// باز کردن بخش رول
function openBox(mode) {
  currentMode = mode;
  document.getElementById("spin-lobby").style.display = "none";
  document.getElementById("spin-screen").style.display = "flex";
  
  document.getElementById("box-title").innerText = mode === "free" ? "اسپین رایگان روزانه" : "اسپین VIP اختصاصی";
  generateTrack();
}

function backToLobby() {
  if (isRolling) return;
  document.getElementById("spin-screen").style.display = "none";
  document.getElementById("spin-lobby").style.display = "block";
}

// چیدن آیتم‌ها داخل نوار
function generateTrack() {
  const track = document.getElementById("roulette-track");
  track.style.transition = "none";
  track.style.transform = "translateX(0px)";
  track.innerHTML = "";

  for (let i = 0; i < 50; i++) {
    const prize = spinPrizes[Math.floor(Math.random() * spinPrizes.length)];
    const el = document.createElement("div");
    el.className = "roulette-item";
    el.innerHTML = `<span>${prize.icon}</span><p>${prize.name}</p>`;
    track.appendChild(el);
  }
}

// اجرای حرکت رول افقی
function startRoll() {
  if (isRolling) return;

  if (currentMode === "vip" && balance < 10) {
    alert("موجودی الماس شما برای این جعبه کافی نیست!");
    return;
  }

  if (currentMode === "vip") {
    balance -= 10;
    document.getElementById("user-balance").innerText = balance;
  }

  isRolling = true;
  const btn = document.getElementById("roll-button");
  btn.disabled = true;

  const track = document.getElementById("roulette-track");
  track.style.transition = "none";
  track.style.transform = "translateX(0px)";

  const targetIndex = Math.floor(Math.random() * 8) + 35;
  const itemWidth = 100;
  const containerWidth = document.querySelector(".roulette-container").offsetWidth;
  const stopAt = (targetIndex * itemWidth) - (containerWidth / 2) + (itemWidth / 2);

  setTimeout(() => {
    track.style.transition = "transform 5s cubic-bezier(0.1, 0.85, 0.25, 1)";
    track.style.transform = `translateX(${stopAt}px)`;
  }, 50);

  setTimeout(() => {
    isRolling = false;
    btn.disabled = false;
    const winner = track.children[targetIndex];
    const prizeName = winner.querySelector("p").innerText;

    if (tg?.showAlert) {
      tg.showAlert(`🎉 تبریک! شما برنده «${prizeName}» شدید!`);
    } else {
      alert(`🎉 تبریک! شما برنده «${prizeName}» شدید!`);
    }
  }, 5300);
}

// اجرای اولیه
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});
