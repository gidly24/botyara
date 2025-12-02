let tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.hide();

const routesGrid = document.getElementById('routes-grid');
const placesGrid = document.getElementById('places-grid');

// Загрузка маршрутов
async function showRoutes() {
    routesGrid.innerHTML = '<div class="loader">Загрузка маршрутов...</div>';
    placesGrid.innerHTML = '';

    try {
        const res = await fetch('/api/routes');
        const routes = await res.json();

        routesGrid.innerHTML = routes.length ? routes.map(r => `
            <div class="card" onclick="selectRoute(${r.id})">
                <img src="https://picsum.photos/seed/route_${r.id}/800/600" alt="${r.name}">
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

// Загрузка достопримечательностей
async function showAttractions() {
    placesGrid.innerHTML = '<div class="loader">Загрузка мест...</div>';
    routesGrid.innerHTML = '';

    try {
        const res = await fetch('/api/attractions');
        const attractions = await res.json();

        placesGrid.innerHTML = attractions.length ? attractions.map(a => `
            <div class="card" onclick="selectAttraction(${a.id})">
                <img src="https://picsum.photos/seed/place_${a.id}/800/600" alt="${a.name}">
                <div class="card-content">
                    <div class="card-title">${a.name}</div>
                    <div class="card-desc">${a.description.split('.')[0]}...</div>
                    <div class="card-meta">
                        <span>${a.address}</span>
                        <span class="badge">${a.price}</span>
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
        tg.sendData(JSON.stringify({
            action: "open_route",
            route_id: id
        }));
        tg.close();
    });
};

window.selectAttraction = (id) => {
    const name = event.currentTarget.querySelector('.card-title').textContent;
    tg.MainButton.setText(`Открыть: ${name}`).show();
    tg.MainButton.once('click', () => {
        tg.sendData(JSON.stringify({
            action: "open_attraction",
            attraction_id: id
        }));
        tg.close();
    });
};

// Переключение вкладок
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');

        if (tab.dataset.tab === 'routes') {
            showRoutes();
        } else {
            showAttractions();
        }
    });
});

// Стартовая загрузка
showRoutes();
