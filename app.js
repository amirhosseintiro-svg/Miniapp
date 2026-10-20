// تنظیمات پیش‌فرض
const ADMIN_ID = 1309025996;

let defaultConfig = {
  title: "Black Item",
  bgColor: "#121212",
  cardColor: "#1e1e1e",
  textColor: "#ffffff",
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

// دریافت تنظیمات ذخیره شده
let appConfig = JSON.parse(localStorage.getItem("black_item_config")) || defaultConfig;

// راه‌اندازی تلگرام وب‌اپ
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

// عناصر صفحه
const appTitleEl = document.getElementById("app-title");
const productsContainer = document.getElementById("products-container");
const adminGearBtn = document.getElementById("admin-gear-btn");
const adminModal = document.getElementById("admin-modal");
const closeAdminBtn = document.getElementById("close-admin");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const addProductBtn = document.getElementById("add-product-btn");

// اعمال تم و رنگ‌ها
function applyTheme() {
  document.documentElement.style.setProperty("--bg-color", appConfig.bgColor);
  document.documentElement.style.setProperty("--card-bg", appConfig.cardColor);
  document.documentElement.style.setProperty("--text-color", appConfig.textColor);
  appTitleEl.textContent = appConfig.title;
}

// نمایش کارت محصولات
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

// بررسی دسترسی ادمین
function checkAdminAccess() {
  const currentUserId = tg?.initDataUnsafe?.user?.id;
  // برای تست محلی یا وقتی با تلگرام وارد می‌شوی
  if (currentUserId === ADMIN_ID || !tg?.initDataUnsafe?.user) {
    adminGearBtn.classList.remove("hidden");
  }
}

// پر کردن فیلدهای پنل مدیریت
function loadAdminInputs() {
  document.getElementById("cfg-app-title").value = appConfig.title;
  document.getElementById("cfg-bg-color").value = appConfig.bgColor;
  document.getElementById("cfg-card-color").value = appConfig.cardColor;
  document.getElementById("cfg-text-color").value = appConfig.textColor;
}

// باز و بسته کردن مودال مدیریت
adminGearBtn.addEventListener("click", () => {
  loadAdminInputs();
  adminModal.classList.remove("hidden");
});

closeAdminBtn.addEventListener("click", () => {
  adminModal.classList.add("hidden");
});

// افزودن محصول جدید
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
  alert("محصول اضافه شد! برای ذخیره همیشگی، دکمه ذخیره تغییرات را بزنید.");
  
  // پاک کردن ورودی‌ها
  document.getElementById("new-prod-title").value = "";
  document.getElementById("new-prod-desc").value = "";
  document.getElementById("new-prod-price").value = "";
  document.getElementById("new-prod-img").value = "";
});

// ذخیره تمام تنظیمات
saveSettingsBtn.addEventListener("click", () => {
  appConfig.title = document.getElementById("cfg-app-title").value.trim() || appConfig.title;
  appConfig.bgColor = document.getElementById("cfg-bg-color").value;
  appConfig.cardColor = document.getElementById("cfg-card-color").value;
  appConfig.textColor = document.getElementById("cfg-text-color").value;

  localStorage.setItem("black_item_config", JSON.stringify(appConfig));
  applyTheme();
  adminModal.classList.add("hidden");
  alert("تغییرات با موفقیت ذخیره شد!");
});

// راه‌اندازی اولیه
applyTheme();
renderProducts();
checkAdminAccess();
    
