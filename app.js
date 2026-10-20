// آیدی تلگرام ادمین
const ADMIN_ID = 1309025996;

// تنظیمات پیش‌فرض با قابلیت سفارشی‌سازی کامل ناوبری
let defaultConfig = {
  title: "Black Item",
  bgColor: "#121212",
  cardColor: "#1e1e1e",
  textColor: "#ffffff",
  navActiveColor: "#0088cc",
  navItems: [
    { id: "profile", label: "پروفایل", icon: "👤", active: false },
    { id: "task", label: "Task", icon: "📋", active: false },
    { id: "shop", label: "فروشگاه", icon: "🛍️", active: true },
    { id: "game", label: "بازی", icon: "🎮", active: false },
    { id: "wallet", label: "کیف پول", icon: "💳", active: false }
  ],
  products: [
    {
      id: 1,
      title: "محصول نمونه ۱",
      desc: "توضیحات و مشخصات آیتم اول",
      price: "10$",
      img: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      title: "محصول نمونه ۲",
      desc: "توضیحات و مشخصات آیتم دوم",
      price: "25$",
      img: "https://via.placeholder.com/150"
    }
  ]
};

// دریافت دیتای ذخیره شده
let appConfig = JSON.parse(localStorage.getItem("black_item_config")) || defaultConfig;
if (!appConfig.navItems) appConfig.navItems = defaultConfig.navItems;
if (!appConfig.navActiveColor) appConfig.navActiveColor = "#0088cc";

// اتصال به وب‌اپ تلگرام
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

// المان‌ها
const appTitleEl = document.getElementById("app-title");
const productsContainer = document.getElementById("products-container");
const bottomNav = document.getElementById("bottom-nav");
const adminGearBtn = document.getElementById("admin-gear-btn");
const adminModal = document.getElementById("admin-modal");
const closeAdminBtn = document.getElementById("close-admin");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const addProductBtn = document.getElementById("add-product-btn");
const navManagerContainer = document.getElementById("nav-items-manager");

// اعمال رنگ‌ها و استایل‌ها
function applyTheme() {
  document.documentElement.style.setProperty("--bg-color", appConfig.bgColor);
  document.documentElement.style.setProperty("--card-bg", appConfig.cardColor);
  document.documentElement.style.setProperty("--text-color", appConfig.textColor);
  document.documentElement.style.setProperty("--accent-color", appConfig.navActiveColor);
  appTitleEl.textContent = appConfig.title;
}

// ساخت و نمایش منوی پایین (پویا)
function renderBottomNav() {
  bottomNav.innerHTML = "";
  appConfig.navItems.forEach(item => {
    const btn = document.createElement("button");
    btn.className = `nav-item ${item.active ? "active" : ""}`;
    btn.innerHTML = `${item.icon} <span>${item.label}</span>`;
    btn.addEventListener("click", () => {
      appConfig.navItems.forEach(i => i.active = false);
      item.active = true;
      renderBottomNav();
    });
    bottomNav.appendChild(btn);
  });
}

// ساخت کارت‌های محصولات
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

// رندر فیلدهای مدیریت نوار ناوبری داخل پنل
function renderNavManager() {
  navManagerContainer.innerHTML = "";
  appConfig.navItems.forEach((item, index) => {
    const row = document.createElement("div");
    row.style.cssText = "display: flex; gap: 8px; margin-top: 6px; align-items: center;";
    row.innerHTML = `
      <input type="text" value="${item.icon}" id="nav-icon-${index}" style="width: 45px; text-align: center;">
      <input type="text" value="${item.label}" id="nav-label-${index}" style="flex: 1;">
    `;
    navManagerContainer.appendChild(row);
  });
}

// بررسی دسترسی ادمین
function checkAdminAccess() {
  const currentUserId = tg?.initDataUnsafe?.user?.id;
  if (currentUserId === ADMIN_ID || !tg?.initDataUnsafe?.user) {
    adminGearBtn.classList.remove("hidden");
  }
}

// لود داده‌ها داخل فرم ادمین
function loadAdminInputs() {
  document.getElementById("cfg-app-title").value = appConfig.title;
  document.getElementById("cfg-bg-color").value = appConfig.bgColor;
  document.getElementById("cfg-card-color").value = appConfig.cardColor;
  document.getElementById("cfg-text-color").value = appConfig.textColor;
  document.getElementById("cfg-nav-active-color").value = appConfig.navActiveColor;
  renderNavManager();
}

// باز/بسته کردن پنل
adminGearBtn.addEventListener("click", () => {
  loadAdminInputs();
  adminModal.classList.remove("hidden");
});

closeAdminBtn.addEventListener("click", () => {
  adminModal.classList.add("hidden");
});

// افزودن محصول
addProductBtn.addEventListener("click", () => {
  const title = document.getElementById("new-prod-title").value.trim();
  const desc = document.getElementById("new-prod-desc").value.trim();
  const price = document.getElementById("new-prod-price").value.trim();
  const img = document.getElementById("new-prod-img").value.trim();

  if (!title || !price) {
    alert("لطفاً حداقل عنوان و قیمت را وارد کنید.");
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
  alert("محصول اضافه شد! حتما دکمه ذخیره تمام تغییرات را بزنید.");
  document.getElementById("new-prod-title").value = "";
  document.getElementById("new-prod-desc").value = "";
  document.getElementById("new-prod-price").value = "";
  document.getElementById("new-prod-img").value = "";
});

// ذخیره تغییرات
saveSettingsBtn.addEventListener("click", () => {
  appConfig.title = document.getElementById("cfg-app-title").value.trim() || appConfig.title;
  appConfig.bgColor = document.getElementById("cfg-bg-color").value;
  appConfig.cardColor = document.getElementById("cfg-card-color").value;
  appConfig.textColor = document.getElementById("cfg-text-color").value;
  appConfig.navActiveColor = document.getElementById("cfg-nav-active-color").value;

  // ذخیره نام و آیکون تک‌تک تب‌ها
  appConfig.navItems.forEach((item, index) => {
    const iconInput = document.getElementById(`nav-icon-${index}`);
    const labelInput = document.getElementById(`nav-label-${index}`);
    if (iconInput && labelInput) {
      item.icon = iconInput.value.trim();
      item.label = labelInput.value.trim();
    }
  });

  localStorage.setItem("black_item_config", JSON.stringify(appConfig));
  applyTheme();
  renderBottomNav();
  adminModal.classList.add("hidden");
  alert("تمام تنظیمات، رنگ‌ها و تب‌ها ذخیره شدند!");
});

// اجرای اولیه
applyTheme();
renderProducts();
renderBottomNav();
checkAdminAccess();
  
    
