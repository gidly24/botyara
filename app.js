let tg = window.Telegram.WebApp;
tg.expand();
tg.ready(); // ← обязательно для Menu Button

const routesGrid = document.getElementById('routes-grid');
const placesGrid = document.getElementById('places-grid');

// Статические данные (потом можешь заменить на любые)
const ROUTES = [
    { id: 1, name: "Набережная Волги", description: "Классика Самары за 2–3 часа", duration: "2–3 ч", places_count: 8 },
    { id: 2, name: "Космическая Самара", description: "Ракеты, музеи, история космоса", duration: "4 ч", places_count: 6 },
    { id: 3, name: "Старый город", description: "Доходные дома XIX века и атмосфера", duration: "3 ч", places_count: 10 },
];

const ATTRACTIONS = [
    { id: 1, name: "Бункер Сталина", description: "Секретный объект на глубине 37 м", address: "ул. Фрунзе, 163", price: "600 ₽" },
    { id: 2, name: "Ракета «Союз»", description: "Настоящая ракета во дворе музея", address: "пр. Ленина, 21", price: "300 ₽" },
    { id: 3, name: "Самарская набережная", description: "Лучшее место для прогулок", address: "Набережная Волги", price: "Бесплатно" },
];

// Заглушки
function placeholder(id, type) {
    const color = type === 'route' ? '#8B5CF6' : '#3B82F6';
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="${color}"/><text x="400" y="320" font-size="72" fill="white" text-anchor="middle" font-family="sans-serif">${type === 'route' ? 'Маршрут' : 'Место'} #${id}</text></svg>`;
}

function renderRoutes() {
    routesGrid.innerHTML = ROUTES.map(r => `
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
    placesGrid.innerHTML = '';
}

function renderAttractions() {
    placesGrid.innerHTML = ATTRACTIONS.map(a => `
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
    routesGrid.innerHTML = '';
}

// Главная магия — используем MainButton (работает ВЕЗДЕ)
window.selectRoute = function(id) {
    const route = ROUTES.find(r => r.id === id);
    tg.MainButton.text = `Открыть маршрут: ${route.name}`;
    tg.MainButton.show();
    tg.MainButton.onClick(function() {
        tg.sendData(JSON.stringify({
            action: "open_route",
            route_id: id
        }));
        tg.close();
    });
};

window.selectAttraction = function(id) {
    const attr = ATTRACTIONS.find(a => a.id === id);
    tg.MainButton.text = `Открыть: ${attr.name}`;
    tg.MainButton.show();
    tg.MainButton.onClick(function() {
        tg.sendData(JSON.stringify({
            action: "open_attraction",
            attraction_id: id
        }));
        tg.close();
    });
};

// Табы
document.querySelectorAll('.tab').forEach(tab => {
    tab.onclick = () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');

        if (tab.dataset.tab === 'routes') renderRoutes();
        else renderAttractions();
    };
});

renderRoutes();
