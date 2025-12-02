let tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.hide();

const routesGrid = document.getElementById('routes-grid');
const placesGrid = document.getElementById('places-grid');

// Твои статические данные — просто вставь сюда сколько угодно маршрутов и мест
const ROUTES = [
    { id: 1, name: "Набережная Волги", description: "Классика Самары за 2 часа", duration: "2–3 часа", places_count: 8 },
    { id: 2, name: "Космическая Самара", description: "Ракеты, музеи, история полётов", duration: "4 часа", places_count: 6 },
    { id: 3, name: "Старый город", description: "Доходные дома, особняки, атмосфера", duration: "3 часа", places_count: 10 },
];

const ATTRACTIONS = [
    { id: 1, name: "Бункер Сталина", description: "Секретный объект на глубине 37 метров", address: "ул. Фрунзе, 163", price: "600 ₽" },
    { id: 2, name: "Музей Ракета «Союз»", description: "Настоящая ракета во дворе!", address: "пр. Ленина, 21", price: "300 ₽" },
    { id: 3, name: "Самарская набережная", description: "Лучшее место для прогулок и фоток", address: "Набережная реки Волги", price: "Бесплатно" },
    { id: 4, name: "Площадь Куйбышева", description: "Самая большая площадь в Европе", address: "пл. Куйбышева", price: "Бесплатно" },
    // добавляй сколько влезет
];

// Заглушки (те же красивые)
function placeholderImage(id, type = 'route') {
    const colors = type === 'route' ? '#8B5CF6' : '#3B82F6';
    return `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='800' height='600' fill='${colors}'/><text x='400' y='320' font-family='Arial' font-size='72' fill='white' text-anchor='middle'>${type === 'route' ? 'Маршрут' : 'Место'} #${id}</text></svg>`;
}

// Показываем маршруты
function showRoutes() {
    routesGrid.innerHTML = ROUTES.map(r => `
        <div class="card" onclick="openRoute(${r.id})">
            <img src="${placeholderImage(r.id, 'route')}" alt="${r.name}">
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
}

function showAttractions() {
    placesGrid.innerHTML = ATTRACTIONS.map(a => `
        <div class="card" onclick="openAttraction(${a.id})">
            <img src="${placeholderImage(a.id, 'place')}" alt="${a.name}">
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
}

// Вот эта магия — отправляет данные ПРЯМО В ТВОЙ БОТ
window.openRoute = function(routeId) {
    const route = ROUTES.find(r => r.id === routeId);
    tg.sendData(JSON.stringify({
        action: "open_route",
        route_id: routeId,
        name: route.name
    }));
    tg.close();
};

window.openAttraction = function(attrId) {
    const attr = ATTRACTIONS.find(a => a.id === attrId);
    tg.sendData(JSON.stringify({
        action: "open_attraction",
        attraction_id: attrId,
        name: attr.name
    }));
    tg.close();
};

// Табы
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
        if (tab.dataset.tab === 'routes') showRoutes();
        else showAttractions();
    });
});

showRoutes();
