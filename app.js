let tg = window.Telegram.WebApp;
tg.expand();

// Данные (пока статические — потом заменишь на fetch, если надо)
const ROUTES = [
    { id: 1, name: "Набережная Волги", description: "Лучший маршрут вдоль реки", duration: "2–3 часа", places_count: 8 },
    { id: 2, name: "Космическая Самара", description: "Ракеты, музеи, космос", duration: "4 часа", places_count: 6 },
    { id: 3, name: "Старый город", description: "Исторический центр и архитектура", duration: "3 часа", places_count: 10 }
];

const ATTRACTIONS = [
    { id: 1, name: "Бункер Сталина", description: "Секретный объект 37 метров под землёй", address: "ул. Фрунзе, 163", price: "600 ₽" },
    { id: 2, name: "Ракета Союз", description: "Настоящая ракета во дворе музея", address: "пр. Ленина, 21", price: "300 ₽" },
    { id: 3, name: "Самарская набережная", description: "Самое красивое место города", address: "Набережная Волги", price: "Бесплатно" }
];

// Заглушка
function placeholder(id, type) {
    const color = type === 'route' ? '#8B5CF6' : '#3B82F6';
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="${color}"/><text x="400" y="320" font-size="80" fill="white" text-anchor="middle" font-family="sans-serif">${type === 'route' ? 'Маршрут' : 'Место'} #${id}</text></svg>`;
}

// === РЕНДЕР ===
function renderRoutes() {
    document.getElementById('routes-grid').innerHTML = ROUTES.map(r => `
        <div class="card" onclick="selectRoute(${r.id})">
            <img src="${placeholder(r.id, 'route')}" alt="${r.name}">
            <div class="card-content">
                <div class="card-title">${r.name}</div>
                <div class="card-desc">${r.description}</div>
                <div class="card-meta">
                    <span>${r.duration}</span>
                    <span class="badge">${r.places_count} мест</span>
                </div>
            </div>
        </div>
    `).join('');
    document.getElementById('places-grid').innerHTML = '';
}

function renderAttractions() {
    document.getElementById('places-grid').innerHTML = ATTRACTIONS.map(a => `
        <div class="card" onclick="selectAttraction(${a.id})">
            <img src="${placeholder(a.id, 'place')}" alt="${a.name}">
            <div class="card-content">
                <div class="card-title">${a.name}</div>
                <div class="card-desc">${a.description}</div>
                <div class="card-meta">
                    <span>${a.address}</span>
                    <span class="badge">${a.price}</span>
                </div>
            </div>
        </div>
    `).join('');
    document.getElementById('routes-grid').innerHTML = '';
}

// === ОТПРАВКА В БОТ ===
window.selectRoute = function(id) {
    const route = ROUTES.find(r => r.id === id);
    tg.sendData(JSON.stringify({
        action: "open_route",
        route_id: id,
        name: route.name
    }));
    tg.close();
};

window.selectAttraction = function(id) {
    const attr = ATTRACTIONS.find(a => a.id === id);
    tg.sendData(JSON.stringify({
        action: "open_attraction",
        attraction_id: id,
        name: attr.name
    }));
    tg.close();
};

// === ТАБЫ ===
document.querySelectorAll('.tab').forEach(tab => {
    tab.onclick = () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');

        if (tab.dataset.tab === 'routes') {
            renderRoutes();
        } else {
            renderAttractions();
        }
    };
});

// Старт
renderRoutes();
