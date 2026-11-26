
const foods = [
    {
        id: 1, name: "Classic Burger", category: "burger",
        price: 35000, image: "photo-1568901346375-23c9450c58cd",
        desc: "Mazali go'sht, pishloq va yangi sabzavotlar."
    },
    {
        id: 2, name: "Cheese Burger", category: "burger",
        price: 42000, image: "photo-1550547660-d9450f859349",
        desc: "Ikki qavatli pishloqli burger."
    },
    {
        id: 3, name: "Pepperoni Pizza", category: "pizza",
        price: 85000, image: "photo-1628840042765-356cda07504e",
        desc: "Maxsus sous va pepperoni."
    },
    {
        id: 4, name: "Italian Pizza", category: "pizza",
        price: 95000, image: "photo-1579751626657-72bc17010498",
        desc: "Italyancha mazali pitsa."
    },
    {
        id: 5, name: "Max Lavash", category: "lavash",
        price: 38000, image: "photo-1529006557810-274b9b2fc783",
        desc: "Go'sht, sabzavot va maxsus sous."
    },
    {
        id: 6, name: "Tovuq Lavash", category: "lavash",
        price: 32000, image: "photo-1565299624946-b28f40a0ae38",
        desc: "Yumshoq tovuq go'shti bilan."
    },
    {
        id: 7, name: "Osh", category: "milliy",
        price: 35000, image: "photo-1512058564366-18510be2db19",
        desc: "An'anaviy o'zbek palovi."
    },
    {
        id: 8, name: "Manti", category: "milliy",
        price: 30000, image: "photo-1563245372-f21724e3856d",
        desc: "Mazali va yumshoq manti."
    },
    {
        id: 9, name: "Cola", category: "drink",
        price: 12000, image: "photo-1544145945-f90425340c7e",
        desc: "Sovuq va tetiklashtiruvchi ichimlik."
    },
    {
        id: 10, name: "Fresh Juice", category: "drink",
        price: 18000, image: "photo-1600271886742-f049cd451bba",
        desc: "Tabiiy meva sharbatlari."
    },
    {
        id: 11, name: "Chocolate Cake", category: "dessert",
        price: 28000, image: "photo-1578985545062-69928b1d9587",
        desc: "Shokoladli mazali tort."
    },
    {
        id: 12, name: "Ice Cream", category: "dessert",
        price: 20000, image: "photo-1563805042-7684c019e1cb",
        desc: "Turli xil muzqaymoqlar."
    }
];

let cart = [];
let favorites = [];

const formatPrice = n => n.toLocaleString("uz-UZ");

function renderFoods(list = foods) {
    const grid = document.getElementById("food-grid");

    grid.innerHTML = list.length ? list.map(food => `
        <article class="food-card">
            <img src="https://images.unsplash.com/${food.image}?w=700"
                 alt="${food.name}" loading="lazy">
            <div class="food-info">
                <div class="food-bottom">
                    <h3>${food.name}</h3>
                    <button class="favorite"
                        onclick="toggleFavorite(${food.id})">
                        ${favorites.includes(food.id) ? "❤️" : "🤍"}
                    </button>
                </div>
                <p>${food.desc}</p>
                <div class="food-bottom">
                    <span class="price">${formatPrice(food.price)} so'm</span>
                    <button class="add-btn"
                        onclick="addToCart(${food.id})">
                        + Savatga
                    </button>
                </div>
            </div>
        </article>
    `).join("") : "<p>Taom topilmadi 😔</p>";
}

function filterFood(category, button) {
    document.querySelectorAll(".category").forEach(btn =>
        btn.classList.remove("active")
    );

    button.classList.add("active");

    const result = category === "all"
        ? foods
        : foods.filter(food => food.category === category);

    renderFoods(result);
}

function searchFood() {
    const value = document.getElementById("search").value.toLowerCase();

    renderFoods(foods.filter(food =>
        food.name.toLowerCase().includes(value) ||
        food.desc.toLowerCase().includes(value)
    ));

    document.querySelectorAll(".category").forEach(btn =>
        btn.classList.remove("active")
    );
}

function addToCart(id) {
    const food = foods.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...food, quantity: 1});
    }

    updateCart();
    showMessage("Taom savatga qo'shildi!");
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        updateCart();
    }
}

function updateCart() {
    const container = document.getElementById("cart-items");

    container.innerHTML = cart.length
        ? cart.map(item => `
            <div class="cart-item">
                <div>
                    <b>${item.name}</b>
                    <p>${formatPrice(item.price)} so'm</p>
                    <button onclick="changeQuantity(${item.id},-1)">−</button>
                    ${item.quantity}
                    <button onclick="changeQuantity(${item.id},1)">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})">🗑</button>
            </div>
        `).join("")
        : "<p>Savatingiz hozircha bo'sh.</p>";

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("cart-count").textContent =
        cart.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById("total-price").textContent =
        formatPrice(total);
}

function toggleCart() {
    document.getElementById("cart-panel").classList.toggle("open");
    document.getElementById("cart-overlay").classList.toggle("show");
}

function toggleFavorite(id) {
    favorites = favorites.includes(id)
        ? favorites.filter(item => item !== id)
        : [...favorites, id];

    const active = document.querySelector(".category.active");

    if (active) active.click();
    else renderFoods();
}

function toggleNav() {
    document.querySelector("nav").classList.toggle("show");
}

function checkout() {
    if (!cart.length) {
        showMessage("Avval savatga taom qo'shing!");
        return;
    }

    showMessage("Buyurtma qabul qilish uchun aloqa tizimini ulash kerak.");
}

function showMessage(message) {
    const toast = document.createElement("div");
    toast.textContent = message;

    Object.assign(toast.style, {
        position: "fixed",
        bottom: "25px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#171717",
        color: "white",
        padding: "15px 25px",
        borderRadius: "12px",
        zIndex: "999",
        textAlign: "center"
    });

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

renderFoods();
updateCart();
