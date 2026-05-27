/* ============================
   طلبات الجزائر - JavaScript
   ============================ */

// === بيانات المطاعم الجزائرية ===
const restaurants = [
    {
        id: 1,
        name: "دار البركة",
        category: "أكل جزائري تقليدي",
        type: "جزائري",
        icon: "🍲",
        rating: 4.8,
        reviews: 1240,
        deliveryTime: "25-35",
        deliveryFee: 150,
        minOrder: 500,
        discount: "خصم 20%",
        badge: "الأكثر طلبا",
        city: "الجزائر العاصمة",
        price: 800
    },
    {
        id: 2,
        name: "قصر القصبة",
        category: "كسكسي وأكلات تقليدية",
        type: "جزائري",
        icon: "🥘",
        rating: 4.9,
        reviews: 980,
        deliveryTime: "30-40",
        deliveryFee: 200,
        minOrder: 700,
        discount: null,
        badge: "ممتاز",
        city: "الجزائر العاصمة",
        price: 1200
    },
    {
        id: 3,
        name: "بيتزا الأمير",
        category: "بيتزا إيطالية",
        type: "بيتزا",
        icon: "🍕",
        rating: 4.5,
        reviews: 2100,
        deliveryTime: "20-30",
        deliveryFee: 100,
        minOrder: 400,
        discount: "اشتري 1 ادفع 2",
        badge: null,
        city: "وهران",
        price: 600
    },
    {
        id: 4,
        name: "شاورمة العاصمة",
        category: "شاورمة وفاست فود",
        type: "فاست فود",
        icon: "🌯",
        rating: 4.6,
        reviews: 3400,
        deliveryTime: "15-25",
        deliveryFee: 80,
        minOrder: 300,
        discount: "توصيل مجاني",
        badge: "سريع",
        city: "الجزائر العاصمة",
        price: 350
    },
    {
        id: 5,
        name: "محاجب لالة فاطمة",
        category: "محاجب وفطائر",
        type: "جزائري",
        icon: "🥞",
        rating: 4.9,
        reviews: 1560,
        deliveryTime: "20-30",
        deliveryFee: 120,
        minOrder: 400,
        discount: null,
        badge: "تقليدي",
        city: "قسنطينة",
        price: 250
    },
    {
        id: 6,
        name: "حلويات الجوهرة",
        category: "حلويات شرقية وغربية",
        type: "حلويات",
        icon: "🍰",
        rating: 4.7,
        reviews: 890,
        deliveryTime: "25-35",
        deliveryFee: 150,
        minOrder: 500,
        discount: "خصم 15%",
        badge: null,
        city: "الجزائر العاصمة",
        price: 700
    },
    {
        id: 7,
        name: "برغر ستار",
        category: "برغر وفاست فود",
        type: "فاست فود",
        icon: "🍔",
        rating: 4.4,
        reviews: 1780,
        deliveryTime: "20-30",
        deliveryFee: 100,
        minOrder: 400,
        discount: "عرض كومبو",
        badge: null,
        city: "الجزائر العاصمة",
        price: 550
    },
    {
        id: 8,
        name: "قهوة سيدي فرج",
        category: "قهوة ومشروبات",
        type: "قهوة",
        icon: "☕",
        rating: 4.7,
        reviews: 670,
        deliveryTime: "15-25",
        deliveryFee: 80,
        minOrder: 300,
        discount: null,
        badge: "هادئ",
        city: "الجزائر العاصمة",
        price: 200
    },
    {
        id: 9,
        name: "مطعم البحر الأبيض",
        category: "حوت ومأكولات بحرية",
        type: "جزائري",
        icon: "🐟",
        rating: 4.6,
        reviews: 540,
        deliveryTime: "35-45",
        deliveryFee: 200,
        minOrder: 1000,
        discount: null,
        badge: "طازج",
        city: "عنابة",
        price: 1500
    },
    {
        id: 10,
        name: "زلابية الحاج عمر",
        category: "زلابية ومخبوزات",
        type: "حلويات",
        icon: "🍩",
        rating: 4.8,
        reviews: 1100,
        deliveryTime: "20-30",
        deliveryFee: 100,
        minOrder: 300,
        discount: "خصم 10%",
        badge: "أصيل",
        city: "بجاية",
        price: 300
    },
    {
        id: 11,
        name: "تاج محل الجزائري",
        category: "كباب ومشاوي",
        type: "جزائري",
        icon: "🍢",
        rating: 4.5,
        reviews: 920,
        deliveryTime: "30-40",
        deliveryFee: 180,
        minOrder: 600,
        discount: null,
        badge: null,
        city: "وهران",
        price: 900
    },
    {
        id: 12,
        name: "مكلة الزاوية",
        category: "شخشوخة وكسكسي",
        type: "جزائري",
        icon: "🥘",
        rating: 4.9,
        reviews: 760,
        deliveryTime: "30-40",
        deliveryFee: 150,
        minOrder: 600,
        discount: "خصم 25%",
        badge: "بلدي",
        city: "سطيف",
        price: 850
    }
];

// === قائمة الأكلات في المطعم ===
const menuData = {
    starters: {
        title: "المقبلات",
        items: [
            { id: 'st1', name: "شربة فريك", desc: "شربة جزائرية تقليدية بالقمح الأخضر واللحم", price: 250, icon: "🍵" },
            { id: 'st2', name: "حريرة", desc: "شربة مغاربية بالعدس والحمص والتوابل", price: 220, icon: "🍲" },
            { id: 'st3', name: "بوراك بالحوت", desc: "ورقة محشوة بالتونة والبيض والجبن", price: 150, icon: "🥟" },
            { id: 'st4', name: "سلطة مشوية", desc: "فلفل وطماطم مشوية بزيت الزيتون والثوم", price: 180, icon: "🥗" }
        ]
    },
    main: {
        title: "الأطباق الرئيسية",
        items: [
            { id: 'm1', name: "كسكسي بالخضار", desc: "كسكسي تقليدي باللحم والخضار والمرق الحار", price: 850, icon: "🍲" },
            { id: 'm2', name: "شخشوخة قسنطينية", desc: "شخشوخة الرفيس باللحم والمرق الأحمر", price: 950, icon: "🥘" },
            { id: 'm3', name: "مْحاجب باللحم", desc: "محاجب محشية باللحم المفروم والطماطم", price: 650, icon: "🥞" },
            { id: 'm4', name: "طاجين الحوت", desc: "طاجين البحر بالطماطم والبصل والبهارات", price: 1200, icon: "🍛" },
            { id: 'm5', name: "رشتة عاصمية", desc: "معكرونة منزلية بالدجاج والحمص", price: 750, icon: "🍝" }
        ]
    },
    grill: {
        title: "المشاوي",
        items: [
            { id: 'g1', name: "مشوي مشكل", desc: "كباب وكفتة وعرق غنم مع الخبز والسلطة", price: 1500, icon: "🍢" },
            { id: 'g2', name: "كباب لحم", desc: "كباب لحم غنم مع البصل والبقدونس", price: 900, icon: "🍖" },
            { id: 'g3', name: "دجاج مشوي", desc: "نص دجاج مشوي مع البطاطا والسلطة", price: 800, icon: "🍗" }
        ]
    },
    sandwiches: {
        title: "سندويتشات",
        items: [
            { id: 's1', name: "شاورمة لحم", desc: "شاورمة لحم بالخس والطماطم والصلصة", price: 350, icon: "🌯" },
            { id: 's2', name: "كرنتيكا", desc: "كرنتيكا حارة بالحمص (وهرانية أصيلة)", price: 200, icon: "🍕" },
            { id: 's3', name: "سندويتش كفتة", desc: "كفتة لحم في خبز فرنسي بالصلصة الحارة", price: 280, icon: "🥖" }
        ]
    },
    desserts: {
        title: "حلويات",
        items: [
            { id: 'd1', name: "زلابية", desc: "زلابية بالعسل والسمسم (طبق رمضاني)", price: 250, icon: "🍩" },
            { id: 'd2', name: "قلب اللوز", desc: "حلوى جزائرية باللوز ومياه الزهر", price: 300, icon: "🍡" },
            { id: 'd3', name: "بقلاوة", desc: "بقلاوة بالفستق والعسل", price: 350, icon: "🥧" },
            { id: 'd4', name: "مقروط", desc: "مقروط التمر بالسميد والعسل", price: 280, icon: "🍪" }
        ]
    },
    drinks: {
        title: "مشروبات",
        items: [
            { id: 'dr1', name: "أتاي بالنعناع", desc: "شاي أخضر بالنعناع الطازج", price: 100, icon: "🍵" },
            { id: 'dr2', name: "قهوة عربية", desc: "قهوة بالهيل والقرنفل", price: 120, icon: "☕" },
            { id: 'dr3', name: "حمود بوعلام", desc: "مشروب غازي جزائري", price: 80, icon: "🥤" },
            { id: 'dr4', name: "عصير برتقال طبيعي", desc: "برتقال جزائري طازج 100%", price: 150, icon: "🍊" }
        ]
    }
};

// === Cart Management ===
let cart = JSON.parse(localStorage.getItem('dz_cart') || '[]');
let currentRestaurant = null;

function saveCart() {
    localStorage.setItem('dz_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

function addToCart(item, restaurant) {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            ...item,
            qty: 1,
            restaurantId: restaurant?.id,
            restaurantName: restaurant?.name,
            deliveryFee: restaurant?.deliveryFee || 150
        });
    }
    saveCart();
    showToast(`✓ تزادت "${item.name}" للسلة`);
    if (typeof updateCartSidebar === 'function') updateCartSidebar();
}

function removeFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    saveCart();
    if (typeof renderCartPage === 'function') renderCartPage();
    if (typeof updateCartSidebar === 'function') updateCartSidebar();
}

function changeQty(itemId, delta) {
    const item = cart.find(c => c.id === itemId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(itemId);
        return;
    }
    saveCart();
    if (typeof renderCartPage === 'function') renderCartPage();
    if (typeof updateCartSidebar === 'function') updateCartSidebar();
}

// === Render Restaurants ===
function renderRestaurants(containerId, list) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (list.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:40px;color:#6b7280;">ما لقيناش مطاعم بهاد الفلتر 😔</p>';
        return;
    }
    container.innerHTML = list.map(r => `
        <a href="restaurant.html?id=${r.id}" class="restaurant-card">
            <div class="restaurant-image">
                ${r.icon}
                ${r.badge ? `<span class="restaurant-badge">${r.badge}</span>` : ''}
                ${r.discount ? `<span class="restaurant-discount">${r.discount}</span>` : ''}
            </div>
            <div class="restaurant-body">
                <h3>${r.name}</h3>
                <p class="restaurant-category">${r.category}</p>
                <div class="restaurant-stats">
                    <span class="rating"><i class="fas fa-star"></i> ${r.rating}</span>
                    <span><i class="fas fa-clock"></i> ${r.deliveryTime} د</span>
                    <span><i class="fas fa-motorcycle"></i> ${r.deliveryFee} دج</span>
                </div>
            </div>
        </a>
    `).join('');
}

function filterRestaurants() {
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const city = document.getElementById('citySelect')?.value;
    const sortBy = document.getElementById('sortSelect')?.value || 'popular';

    const checkedCategories = Array.from(document.querySelectorAll('[data-filter="category"]:checked'))
        .map(el => el.value).filter(v => v !== 'all');

    let filtered = restaurants.filter(r => {
        if (city && r.city !== city) return false;
        if (search && !r.name.toLowerCase().includes(search) && !r.category.toLowerCase().includes(search)) return false;
        if (checkedCategories.length > 0 && !checkedCategories.includes(r.type)) return false;
        return true;
    });

    // sort
    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'delivery') filtered.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
    else if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else filtered.sort((a, b) => b.reviews - a.reviews);

    renderRestaurants('restaurantsList', filtered);
    document.getElementById('resultsCount').textContent = filtered.length;
    if (city) document.getElementById('currentCity').textContent = city;
}

function resetFilters() {
    document.querySelectorAll('[data-filter="category"]').forEach(el => {
        el.checked = el.value === 'all';
    });
    if (document.getElementById('searchInput')) document.getElementById('searchInput').value = '';
    filterRestaurants();
}

// === Restaurant Page ===
function loadRestaurant(id) {
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) return;
    currentRestaurant = restaurant;

    document.getElementById('restaurantName').textContent = restaurant.name;
    document.getElementById('restaurantCategory').textContent = restaurant.category;
    document.getElementById('restaurantRating').textContent = restaurant.rating;
    document.getElementById('restaurantTime').textContent = restaurant.deliveryTime;
    document.getElementById('restaurantDelivery').textContent = restaurant.deliveryFee;
    document.getElementById('restaurantLogo').textContent = restaurant.icon;
    document.title = `${restaurant.name} - طلبات الجزائر`;

    renderMenu();
    updateCartSidebar();
}

function renderMenu() {
    const container = document.getElementById('menuItems');
    if (!container) return;

    container.innerHTML = Object.entries(menuData).map(([key, cat]) => `
        <div class="menu-category" id="${key}">
            <h3>${cat.title}</h3>
            <div class="menu-items-grid">
                ${cat.items.map(item => `
                    <div class="menu-item">
                        <div style="display:flex;gap:15px;align-items:center;">
                            <div class="menu-item-icon">${item.icon}</div>
                            <div class="menu-item-content">
                                <h4>${item.name}</h4>
                                <p>${item.desc}</p>
                                <span class="menu-item-price">${item.price} دج</span>
                            </div>
                        </div>
                        <button class="add-btn" onclick='addToCart(${JSON.stringify(item)}, ${JSON.stringify(currentRestaurant)})' title="زيد للسلة">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Active link on scroll
    document.querySelectorAll('.menu-nav a').forEach(a => {
        a.addEventListener('click', e => {
            document.querySelectorAll('.menu-nav a').forEach(x => x.classList.remove('active'));
            a.classList.add('active');
        });
    });
}

function updateCartSidebar() {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <p>سلتك فارغة</p>
                <small>زيد أكلات للسلة باش تطلب</small>
            </div>
        `;
        if (summary) summary.style.display = 'none';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <strong>${item.icon} ${item.name}</strong>
                <small>${item.price} دج × ${item.qty}</small>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
                <span class="qty">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = cart[0]?.deliveryFee || 150;
    const total = subtotal + delivery;

    if (summary) {
        summary.style.display = 'block';
        document.getElementById('subtotal').textContent = subtotal + ' دج';
        document.getElementById('deliveryFee').textContent = delivery + ' دج';
        document.getElementById('total').textContent = total + ' دج';
    }
}

// === Cart Page ===
function renderCartPage() {
    const container = document.getElementById('cartItemsList');
    const deliveryCard = document.getElementById('deliveryCard');
    const paymentCard = document.getElementById('paymentCard');
    const summary = document.getElementById('checkoutSummary');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <p>سلتك فارغة</p>
                <small>روح زيد بعض الأكلات الزينة</small>
                <a href="restaurants.html" class="btn-primary" style="margin-top:15px;">شوف المطاعم</a>
            </div>
        `;
        if (deliveryCard) deliveryCard.style.display = 'none';
        if (paymentCard) paymentCard.style.display = 'none';
        if (summary) summary.style.display = 'none';
        return;
    }

    if (deliveryCard) deliveryCard.style.display = 'block';
    if (paymentCard) paymentCard.style.display = 'block';
    if (summary) summary.style.display = 'block';

    container.innerHTML = cart.map(item => `
        <div class="cart-list-item">
            <div class="item-icon">${item.icon}</div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <small>من ${item.restaurantName || 'المطعم'}</small>
                <div style="margin-top:8px;display:flex;align-items:center;gap:10px;">
                    <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
                    <span class="qty">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                </div>
            </div>
            <div style="text-align:left;">
                <div class="item-price">${item.price * item.qty} دج</div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')" style="margin-top:8px;" title="احذف">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = cart[0]?.deliveryFee || 200;
    const fees = 50;
    const total = subtotal + delivery + fees;

    document.getElementById('cartSubtotal').textContent = subtotal + ' دج';
    document.getElementById('cartDelivery').textContent = delivery + ' دج';
    document.getElementById('cartFees').textContent = fees + ' دج';
    document.getElementById('cartTotal').textContent = total + ' دج';
}

function placeOrder() {
    if (cart.length === 0) {
        showToast('سلتك فارغة !');
        return;
    }
    const orderNum = 'DZ-2026-' + Math.floor(Math.random() * 9000 + 1000);
    document.getElementById('orderNumber').textContent = '#' + orderNum;
    document.getElementById('successModal').classList.add('active');
    cart = [];
    saveCart();
}

// === Toast ===
function showToast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// === Init ===
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Render restaurants on homepage
    const homeGrid = document.getElementById('restaurantsGrid');
    if (homeGrid) {
        renderRestaurants('restaurantsGrid', restaurants.slice(0, 8));
    }

    // Close modal on click outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });
});
