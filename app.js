let tg = window.Telegram.WebApp;
tg.expand();
tg.ready(); // ← критически важно для Menu Button

const routesGrid = document.getElementById('routes-grid');
const placesGrid = document.getElementById('places-grid');

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

function generatePlaceholder(id, type) {
    const color = type === 'route' ? '#8B5CF6' : '#3B82F6';
    const title = type === 'route' ? 'Маршрут' : 'Место';
    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" class="card-svg">
            <rect width="800" height="600" fill="${color}"/>
            <text x="400" y="300" font-size="72" fill="white" text-anchor="middle" font-family="sans-serif">${title}</text>
            <text x="400" y="380" font-size="56" fill="#ddd" text-anchor="middle" font-family="sans-serif">#${id}</text>
        </svg>
    `;
}

function renderRoutes() {
    routesGrid.innerHTML = ROUTES.map(r => `
        <div class="card" onclick="selectRoute(${r.id})">
            <div class="card-image">${generatePlaceholder(r.id, 'route')}</div>
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
            <div class="card-image">${generatePlaceholder(a.id, 'place')}</div>
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

// ←←←←← ВОТ ГЛАВНОЕ ИСПРАВЛЕНИЕ ДЛЯ MENU BUTTON
function setupMainButton(text, data) {
    tg.MainButton.offClick(); // чистим старый обработчик (это было причиной!)
    tg.MainButton.setText(text);
    tg.MainButton.onClick(() => {
        tg.sendData(JSON.stringify(data));
        tg.close();
    });
    tg.MainButton.show();
}

window.selectRoute = function(id) {
    const name = event.currentTarget.querySelector('h3').textContent;
    tg.MainButton.setText(`Пройти: ${name}`).show();
    tg.MainButton.once('click', () => {
        tg.sendData(JSON.stringify({
            action: "open_route",
            route_id: id
        }));
        tg.close();
    });
};

window.selectAttraction = function(id) {
    const name = event.currentTarget.querySelector('h3').textContent;
    tg.MainButton.setText(`Подробнее: ${name}`).show();
    tg.MainButton.once('click', () => {
        tg.sendData(JSON.stringify({
            action: "open_attraction",
            attraction_id: id
        }));
        tg.close();
    });
};

// Табы без изменений
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

