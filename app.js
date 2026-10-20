const ADMIN_ID = 1309025996;

let defaultConfig = {
  title: "Black Item",
  bgColor: "#121212",
  cardColor: "#1e1e1e",
  textColor: "#ffffff",
  navActiveColor: "#0088cc",
  navItems: [
    { icon: "👤", label: "پروفایل" },
    { icon: "📋", label: "Task" },
    { icon: "🛍️", label: "فروشگاه" },
    { icon: "🎮", label: "بازی" },
    { icon: "💳", label: "کیف پول" }
  ],
  products: [
    { id: 1, title: "محصول نمونه ۱", desc: "توضیحات آیتم اول", price: "10$", img: "https://via.placeholder.com/150" },
    { id: 2, title: "محصول نمونه ۲", desc: "توضیحات آیتم دوم", price: "25$", img: "https://via.placeholder.com/150" }
  ]
};

let saved = localStorage.getItem("black_item_config");
let appConfig = saved ? JSON.parse(saved) : defaultConfig;

if (!appConfig.navItems || appConfig.navItems.length < 5) {
  appConfig.navItems = defaultConfig.navItems;
}

const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const appTitleEl = document.getElementById("app-title");
const productsContainer = document.getElementById("products-container");
const bottomNav = document.getElementById("bottom-nav");
const adminGearBtn = document.getElementById("admin-gear-btn");
const adminModal = document.getElementById("admin-modal");
const closeAdminBtn = document.getElementById("close-admin");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const addProductBtn = document.getElementById("add-product-btn");

let activeTabIndex = 2; // پیش‌فرض روی فروشگاه

function applyTheme() {
  document.documentElement.style.setProperty("--bg-color", appConfig.bgColor);
  document.documentElement.style.setProperty("--card-bg", appConfig.cardColor);
  document.documentElement.style.setProperty("--text-color", appConfig.textColor);
  document.documentElement.style.setProperty("--accent-color", appConfig.navActiveColor);
  appTitleEl.textContent = appConfig.title;
}

function renderBottomNav() {
  bottomNav.innerHTML = "";
  appConfig.navItems.forEach((item, index) => {
    const btn = document.createElement("button");
    btn.className = `nav-item ${index === activeTabIndex ? "active" : ""}`;
    btn.innerHTML = `${item.icon} <span>${item.label}</span>`;
    btn.addEventListener("click", () => {
      activeTabIndex = index;
      renderBottomNav();
    });
    bottomNav.appendChild(btn);
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
    alert("لطفاً عنوان و قیمت را بنویس.");
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
      icon: document.getElementById(`tab-icon-${i}`).value.trim() || defaultConfig.navItems[i].icon,
      label: document.getElementById(`tab-label-${i}`).value.trim() || defaultConfig.navItems[i].label
    };
  }

  localStorage.setItem("black_item_config", JSON.stringify(appConfig));
  applyTheme();
  renderBottomNav();
  adminModal.classList.add("hidden");
  alert("تمام تنظیمات و تب‌ها با موفقیت ذخیره شدند!");
});

applyTheme();
renderProducts();
renderBottomNav();
checkAdminAccess();
                             
