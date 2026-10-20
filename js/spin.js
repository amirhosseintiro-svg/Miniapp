const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

// لیست آیتم‌های گردونه
const itemsList = [
  { name: "کانفیگ ۱ ماهه", icon: "🚀" },
  { name: "اکانت پرو", icon: "✨" },
  { name: "پوچ", icon: "💩" },
  { name: "تخفیف ۵۰٪", icon: "🏷️" },
  { name: "۵۰ سکه", icon: "⭐" },
  { name: "کانفیگ VIP", icon: "⚡" },
  { name: "شانس دوباره", icon: "🔄" }
];

let isSpinning = false;
let currentMode = "free";

// باز کردن نمای جعبه انتخابی
function openBoxView(mode) {
  currentMode = mode;
  document.getElementById("lobby-screen").style.display = "none";
  document.getElementById("spin-screen").style.display = "flex";
  
  const title = mode === "free" ? "جعبه رایگان روزانه" : "جعبه VIP ویژه";
  document.getElementById("current-box-title").innerText = title;
  
  setupRouletteTrack();
}

// دکمه بازگشت به صفحه انتخاب اسپین‌ها
function backToLobby() {
  if (isSpinning) return;
  document.getElementById("spin-screen").style.display = "none";
  document.getElementById("lobby-screen").style.display = "block";
}

// چینش کارت‌ها روی ریل افقی
function setupRouletteTrack() {
  const track = document.getElementById("roulette-track");
  track.style.transition = "none";
  track.style.transform = "translateX(0px)";
  track.innerHTML = "";

  for (let i = 0; i < 60; i++) {
    const item = itemsList[Math.floor(Math.random() * itemsList.length)];
    const el = document.createElement("div");
    el.className = "item-card";
    el.innerHTML = `<span>${item.icon}</span><p>${item.name}</p>`;
    track.appendChild(el);
  }
}

// چرخش رول افقی
function startHorizontalSpin() {
  if (isSpinning) return;
  isSpinning = true;

  const spinBtn = document.getElementById("spin-btn");
  spinBtn.disabled = true;

  const track = document.getElementById("roulette-track");
  track.style.transition = "none";
  track.style.transform = "translateX(0px)";

  const targetIndex = Math.floor(Math.random() * 10) + 40;
  const itemWidth = 100;
  const wrapperWidth = document.querySelector(".roulette-wrapper").offsetWidth;
  const stopPosition = (targetIndex * itemWidth) - (wrapperWidth / 2) + (itemWidth / 2);

  setTimeout(() => {
    track.style.transition = "transform 5.5s cubic-bezier(0.12, 0.8, 0.15, 1)";
    track.style.transform = `translateX(${stopPosition}px)`;
  }, 50);

  setTimeout(() => {
    isSpinning = false;
    spinBtn.disabled = false;
    
    const winningCard = track.children[targetIndex];
    const prizeName = winningCard.querySelector("p").innerText;
    
    if (tg?.showAlert) {
      tg.showAlert(`تبریک! برنده شدید: ${prizeName} 🎉`);
    } else {
      alert(`تبریک! برنده شدید: ${prizeName} 🎉`);
    }
  }, 5800);
      }
