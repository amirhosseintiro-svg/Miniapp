const ADMIN_ID = 1309025996;

// ساختار پیش‌فرض تب‌ها و شناسه‌های صفحات
const defaultNavItems = [
  { pageId: "page-profile", icon: "ri-user-3-line", label: "پروفایل" },
  { pageId: "page-task", icon: "ri-task-line", label: "Task" },
  { pageId: "page-shop", icon: "ri-store-2-line", label: "فروشگاه" },
  { pageId: "page-game", icon: "ri-gamepad-line", label: "بازی" },
  { pageId: "page-wallet", icon: "ri-wallet-3-line", label: "کیف پول" }
];

let defaultConfig = {
  title: "Black Item",
  bgColor: "#121212",
  cardColor: "#1e1e1e",
  textColor: "#ffffff",
  navActiveColor: "#0088cc",
  navItems: defaultNavItems,
  products: [
    { id: 1, title: "محصول نمونه ۱", desc: "توضیحات و مشخصات آیتم اول", price: "10$", img: "https://via.placeholder.com/150" },
    { id: 2, title: "محصول نمونه ۲", desc: "توضیحات و مشخصات آیتم دوم", price: "25$", img: "https://via.placeholder.com/150" }
  ]
};

// دریافت تنظیمات
let saved = localStorage.getItem("black_item_config");
let appConfig = saved ? JSON.parse(saved) : defaultConfig;

if (!appConfig.navItems || appConfig.navItems.length < 5) {
  appConfig.navItems = defaultNavItems;
}

// دیتای کاربری، تسک‌ها و بازی
let userData = JSON.parse(localStorage.getItem("black_item_user")) || {
  coins: 0,
  energy: 100
};

const tasksList = [
  { id: 1, title: "عضویت در کانال تلگرام", reward: 50, link: "https://t.me", done: false },
  { id: 2, title: "دنبال کردن صفحه توییتر (X)", reward: 30, link: "https://x.com", done: false },
  { id: 3, title: "دعوت ۳ نفر از دوستان", reward: 100, link: "", done: false }
];

// اتصال وب‌اپ تلگرام
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

// المان‌ها
const appTitleEl = document.getElementById("app-title");
const productsContainer = document.getElementById("products-container");
const bottomNav = document.getElementById("bottom-nav");
const balanceAmountEl = document.getElementById("balance-amount");
const adminGearBtn = document.getElementById("admin-gear-btn");
const adminModal = document.getElementById("admin-modal");
const closeAdminBtn = document.getElementById("close-admin");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const addProductBtn = document.getElementById("add-product-btn");

let activeTabIndex = 2; // پیش‌فرض روی فروشگاه

function updateBalanceUI() {
  balanceAmountEl.textContent = userData.coins;
  const profBalance = document.getElementById("prof-balance");
  if (profBalance) profBalance.textContent = userData.coins;
  localStorage.setItem("black_item_user", JSON.stringify(userData));
}

function applyTheme() {
  document.documentElement.style.setProperty("--bg-color", appConfig.bgColor);
  document.documentElement.style.setProperty("--card-bg", appConfig.cardColor);
  document.documentElement.style.setProperty("--text-color", appConfig.textColor);
  document.documentElement.style.setProperty("--accent-color", appConfig.navActiveColor);
  appTitleEl.textContent = appConfig.title;
}

function renderIconHTML(iconStr) {
  if (!iconStr) return "★";
  if (iconStr.startsWith("http://") || iconStr.startsWith("https://") || iconStr.endsWith(".png") || iconStr.endsWith(".svg")) {
    return `<img src="${iconStr}" style="width: 20px; height: 20px; object-fit: contain; display: block;" alt="icon">`;
  }
  if (iconStr.startsWith("ri-")) {
    return `<i class="${iconStr}" style="font-size: 20px;"></i>`;
  }
  return `<span style="font-size: 18px;">${iconStr}</span>`;
}

// تغییر صفحات مینی‌اپ
function switchPage(pageId, index) {
  activeTabIndex = index;
  document.querySelectorAll(".app-page").forEach(page => page.classList.add("hidden"));
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.remove("hidden");
  renderBottomNav();
}

function renderBottomNav() {
  bottomNav.innerHTML = "";
  appConfig.navItems.forEach((item, index) => {
    const btn = document.createElement("button");
    btn.className = `nav-item ${index === activeTabIndex ? "active" : ""}`;
    btn.innerHTML = `${renderIconHTML(item.icon)} <span>${item.label}</span>`;
    btn.addEventListener("click", () => {
      switchPage(defaultNavItems[index].pageId, index);
    });
    bottomNav.appendChild(btn);
  });
}

// راه‌اندازی اطلاعات پروفایل
function initProfile() {
  const user = tg?.initDataUnsafe?.user;
  if (user) {
    document.getElementById("user-name").textContent = user.first_name || "کاربر";
    document.getElementById("prof-name").textContent = `${user.first_name || ""} ${user.last_name || ""}`;
    document.getElementById("prof-id").textContent = `ID: ${user.id}`;
    if (user.photo_url) {
      document.getElementById("user-avatar").innerHTML = `<img src="${user.photo_url}" style="width:100%; height:100%; border-radius:50%;">`;
      document.getElementById("prof-avatar").innerHTML = `<img src="${user.photo_url}" style="width:100%; height:100%; border-radius:50%;">`;
    }
  }
}

// راه‌اندازی تسک‌ها
function initTasks() {
  const tasksContainer = document.getElementById("tasks-container");
  if (!tasksContainer) return;
  tasksContainer.innerHTML = "";

  tasksList.forEach(t => {
    const item = document.createElement("div");
    item.className = "task-item";
    item.innerHTML = `
      <div class="task-info">
        <h4>${t.title}</h4>
        <span>+${t.reward} سکه 💰</span>
      </div>
      <button class="task-btn ${t.done ? 'completed' : ''}" id="task-btn-${t.id}">
        ${t.done ? 'انجام شد' : 'انجام'}
      </button>
    `;
    item.querySelector("button").addEventListener("click", () => {
      if (t.done) return;
      if (t.link) window.open(t.link, "_blank");
      t.done = true;
      userData.coins += t.reward;
      updateBalanceUI();
      initTasks();
    });
    tasksContainer.appendChild(item);
  });
}

// راه‌اندازی بازی ضربه‌ای
function initGame() {
  const coinTap = document.getElementById("coin-tap");
  const energyEl = document.getElementById("game-energy");
  if (!coinTap) return;

  coinTap.addEventListener("click", () => {
    if (userData.energy > 0) {
      userData.coins += 1;
      userData.energy -= 1;
      energyEl.textContent = userData.energy;
      updateBalanceUI();
    } else {
      alert("انرژی شما به پایان رسید! کمی صبر کنید.");
    }
  });

  // پر شدن خودکار انرژی هر ۳ ثانیه
  setInterval(() => {
    if (userData.energy < 100) {
      userData.energy += 1;
      if (energyEl) energyEl.textContent = userData.energy;
    }
  }, 3000);
}

// راه‌اندازی کیف پول
function initWallet() {
  const connectBtn = document.getElementById("btn-connect-wallet");
  const statusEl = document.getElementById("wallet-status");
  if (!connectBtn) return;

  connectBtn.addEventListener("click", () => {
    statusEl.textContent = "در حال اتصال به کیف پول...";
    setTimeout(() => {
      statusEl.textContent = "آدرس متصل: UQD...9xK (شبکه TON)";
      connectBtn.textContent = "قطع اتصال";
      connectBtn.style.background = "#e74c3c";
    }, 1000);
  });
}

function renderProducts() {
  productsContainer.innerHTML = "";
  appConfig.products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img || 'https://via.placeholder.com/150'}" class="product-img" alt="${p.title}">
      <div class="product-info">
        <div class="product-title">${p.title}</div>
        <div class="product-desc">${p.desc}</div>
      </div>
      <div class="product-bottom">
        <span class="product-price">${p.price}</span>
        <button class="buy-btn">خرید</button>
      </div>
    `;
    productsContainer.appendChild(card);
  });
}

function checkAdminAccess() {
  const currentUserId = tg?.initDataUnsafe?.user?.id;
  if (currentUserId === ADMIN_ID || !tg?.initDataUnsafe?.user) {
    adminGearBtn.classList.remove("hidden");
  }
}

function loadAdminInputs() {
  document.getElementById("cfg-app-title").value = appConfig.title;
  document.getElementById("cfg-bg-color").value = appConfig.bgColor;
  document.getElementById("cfg-card-color").value = appConfig.cardColor;
  document.getElementById("cfg-text-color").value = appConfig.textColor;
  document.getElementById("cfg-nav-active-color").value = appConfig.navActiveColor;

  for (let i = 0; i < 5; i++) {
    document.getElementById(`tab-icon-${i}`).value = appConfig.navItems[i].icon;
    document.getElementById(`tab-label-${i}`).value = appConfig.navItems[i].label;
  }
}

adminGearBtn.addEventListener("click", () => {
  loadAdminInputs();
  adminModal.classList.remove("hidden");
});

closeAdminBtn.addEventListener("click", () => {
  adminModal.classList.add("hidden");
});

addProductBtn.addEventListener("click", () => {
  const title = document.getElementById("new-prod-title").value.trim();
  const desc = document.getElementById("new-prod-desc").value.trim();
  const price = document.getElementById("new-prod-price").value.trim();
  const img = document.getElementById("new-prod-img").value.trim();

  if (!title || !price) {
    alert("لطفاً حداقل عنوان و قیمت را بنویسید.");
    return;
  }

  appConfig.products.push({
    id: Date.now(),
    title,
    desc,
    price,
    img: img || "https://via.placeholder.com/150"
  });

  renderProducts();
  alert("محصول اضافه شد! در پایان ذخیره تغییرات را بزنید.");
  document.getElementById("new-prod-title").value = "";
  document.getElementById("new-prod-desc").value = "";
  document.getElementById("new-prod-price").value = "";
  document.getElementById("new-prod-img").value = "";
});

saveSettingsBtn.addEventListener("click", () => {
  appConfig.title = document.getElementById("cfg-app-title").value.trim() || appConfig.title;
  appConfig.bgColor = document.getElementById("cfg-bg-color").value;
  appConfig.cardColor = document.getElementById("cfg-card-color").value;
  appConfig.textColor = document.getElementById("cfg-text-color").value;
  appConfig.navActiveColor = document.getElementById("cfg-nav-active-color").value;

  for (let i = 0; i < 5; i++) {
    appConfig.navItems[i] = {
      icon: document.getElementById(`tab-icon-${i}`).value.trim() || defaultNavItems[i].icon,
      label: document.getElementById(`tab-label-${i}`).value.trim() || defaultNavItems[i].label
    };
  }

  localStorage.setItem("black_item_config", JSON.stringify(appConfig));
  applyTheme();
  renderBottomNav();
  adminModal.classList.add("hidden");
  alert("تمام تنظیمات و تب‌ها ذخیره شدند!");
});

// راه‌اندازی کل سیستم
applyTheme();
updateBalanceUI();
renderProducts();
renderBottomNav();
initProfile();
initTasks();
initGame();
initWallet();
checkAdminAccess();
