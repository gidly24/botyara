let tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.hide();

const routesGrid = document.getElementById('routes-grid');
const placesGrid = document.getElementById('places-grid');

function placeholderImage(id, type = 'route') {
    const palettes = {
        route: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
        place: ['#3B82F6', '#60A5FA', '#93BBFC']
    };
    const [bg, mid, light] = palettes[type];
    const title = type === 'route' ? 'Маршрут' : 'Место';

    return `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${mid}'/><stop offset='100%' stop-color='${bg}'/></defs><rect width='800' height='600' fill='url(%23g)'/><path d='M100 100 Q400 20 700 100 T700 500 Q400 580 100 500 Z' fill='rgba(255,255,255,0.1)'/><text x='400' y='290' font-family='Arial,sans-serif' font-size='64' fill='white' text-anchor='middle'>${title}</text><text x='400' y='380' font-family='Arial,sans-serif' font-size='48' fill='${light}' text-anchor='middle'>#${id}</text></svg>`;
}

async function showRoutes() {
    routesGrid.innerHTML = '<div class="loader">Загрузка маршрутов...</div>';
    placesGrid.innerHTML = '';

    try {
        const res = await fetch('/api/routes');
        const routes = await res.json();

        routesGrid.innerHTML = routes.length ? routes.map(r => `
            <div class="card" onclick="selectRoute(${r.id})">
                <img src="${placeholderImage(r.id, 'route')}" alt="${r.name}">
                <div class="card-content">
                    <div class="card-title">${r.name}</div>
                    <div class="card-desc">${r.description}</div>
                    <div class="card-meta">
                        <span>${r.duration || '—'}</span>
                        <span class="badge">${r.places_count} мест</span>
                    </div>
                </div>
            </div>
        `).join('') : '<div class="empty">Маршруты пока не добавлены</div>';
    } catch (e) {
        routesGrid.innerHTML = '<div class="error">Ошибка загрузки маршрутов</div>';
    }
}

async function showAttractions() {
    placesGrid.innerHTML = '<div class="loader">Загрузка мест...</div>';
    routesGrid.innerHTML = '';

    try {
        const res = await fetch('/api/attractions');
        const attractions = await res.json();

        placesGrid.innerHTML = attractions.length ? attractions.map(a => `
            <div class="card" onclick="selectAttraction(${a.id})">
                <img src="${placeholderImage(a.id, 'place')}" alt="${a.name}">
                <div class="card-content">
                    <div class="card-title">${a.name}</div>
                    <div class="card-desc">${a.description.split('.')[0]}...</div>
                    <div class="card-meta">
                        <span>${a.address}</span>
                        <span class="badge">${a.price || 'Бесплатно'}</span>
                    </div>
                </div>
            </div>
        `).join('') : '<div class="empty">Места не найдены</div>';
    } catch (e) {
        placesGrid.innerHTML = '<div class="error">Ошибка загрузки мест</div>';
    }
}

window.selectRoute = (id) => {
    const name = event.currentTarget.querySelector('.card-title').textContent;
    tg.MainButton.setText(`Пройти маршрут: ${name}`).show();
    tg.MainButton.once('click', () => {
        tg.sendData(JSON.stringify({ action: "open_route", route_id: id }));
        tg.close();
    });
};

window.selectAttraction = (id => {
    const name = event.currentTarget.querySelector('.card-title').textContent;
    tg.MainButton.setText(`Открыть: ${name}`).show();
    tg.MainButton.once('click', () => {
        tg.sendData(JSON.stringify({ action: "open_attraction", attraction_id: id }));
        tg.close();
    });
};

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