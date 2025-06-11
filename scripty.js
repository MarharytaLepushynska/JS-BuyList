document.addEventListener('DOMContentLoaded', () => {
    const addItemInput = document.querySelector('.add-item input');
    const addButton = document.querySelector('.add-item .add');
    const itemsCont = document.querySelector('.items');
    const leftItems = document.querySelector('.left');
    const boughtItems = document.querySelector('.bought');

    let listOfItems = [
        { id: Date.now(), name: 'Помідори', quantity: 2, bought: true },
        { id: Date.now() + 1, name: 'Печиво', quantity: 2, bought: false },
        { id: Date.now() + 2, name: 'Сир', quantity: 1, bought: false }
    ];

    showList();

    addButton.addEventListener('click', addItem);
    addItemInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            addItem();
        }
    });

    function addItem() {
        const name = addItemInput.value.trim();
        if (name) {
            const newItem = {
                id: Date.now(),
                name: name,
                quantity: 1,
                bought: false
            };
            listOfItems.push(newItem);
            showList();
            addItemInput.value = '';
            addItemInput.focus();
        }
    }

    function showList() {
        itemsCont.innerHTML = '';
        listOfItems.forEach(item => {
            const element = document.createElement('div');
            element.classList.add('row');

            let elementName;
            let elementCount;
            let elementStatus;

            if (item.bought) {
                elementName = `<span class="name crossed-name">${item.name}</span>`;
                elementCount = `<div class="count">
                        <button class="minus-n" data-tooltip="Мінус">-</button>
                        <span class="counter">${item.quantity}</span>
                        <button class="plus-n" data-tooltip="Плюс">+</button>
                    </div>`;

                elementStatus = `<div class="end">
                        <button class="status" data-tooltip="Не куплено" data-id="${item.id}">Куплено</button>
                        <button class="cross-n" data-tooltip="Видалити" data-id="${item.id}">x</button>
                    </div>`;
            } else {
                elementName = `<span class="name" data-id="${item.id}">${item.name}</span>`;
                elementCount = `<div class="count">
                        <button class="minus" data-tooltip="Мінус" data-id="${item.id}" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
                        <span class="counter">${item.quantity}</span>
                        <button class="plus" data-tooltip="Плюс" data-id="${item.id}">+</button>
                    </div>`;

                elementStatus = `<div class="end">
                        <button class="status" data-tooltip="Куплено" data-id="${item.id}">Не куплено</button>
                        <button class="cross" data-tooltip="Видалити" data-id="${item.id}">x</button>
                    </div>`;
            }

            element.innerHTML = `${elementName} ${elementCount} ${elementStatus}`;

            itemsCont.appendChild(element);
        });

        activateButtons();
        redoStatistics();
    }

    function repaintRow(item, button){
            const row = button.closest('.row');
            const element = document.createElement('div');
            element.classList.add('row');

            let elementName;
            let elementCount;
            let elementStatus;

            if (item.bought) {
                elementName = `<span class="name crossed-name">${item.name}</span>`;
                elementCount = `<div class="count">
                        <button class="minus-n" data-tooltip="Мінус">-</button>
                        <span class="counter">${item.quantity}</span>
                        <button class="plus-n" data-tooltip="Плюс">+</button>
                    </div>`;

                elementStatus = `<div class="end">
                        <button class="status" data-tooltip="Не куплено" data-id="${item.id}">Куплено</button>
                        <button class="cross-n" data-tooltip="Видалити" data-id="${item.id}">x</button>
                    </div>`;
            } else {
                elementName = `<span class="name" data-id="${item.id}">${item.name}</span>`;
                elementCount = `<div class="count">
                        <button class="minus" data-tooltip="Мінус" data-id="${item.id}" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
                        <span class="counter">${item.quantity}</span>
                        <button class="plus" data-tooltip="Плюс" data-id="${item.id}">+</button>
                    </div>`;

                elementStatus = `<div class="end">
                        <button class="status" data-tooltip="Куплено" data-id="${item.id}">Не куплено</button>
                        <button class="cross" data-tooltip="Видалити" data-id="${item.id}">x</button>
                    </div>`;
            }

            element.innerHTML = `${elementName} ${elementCount} ${elementStatus}`;

            row.replaceWith(element);
            activateButtons();
            redoStatistics();
    }

    function activateButtons() {
        document.querySelectorAll('.status').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.dataset.id);
                const item = listOfItems.find(i => i.id === id);
                if (item) {
                    item.bought = !item.bought;
                    repaintRow(item, button);
                }
            });
        });

        document.querySelectorAll('.cross').forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.dataset.id);
                listOfItems = listOfItems.filter(i => i.id !== id);
                showList();
            });
        });

        document.querySelectorAll('.plus').forEach(button => {
            if (!button.classList.contains('events-attached')) {
            button.addEventListener('click', () => {
                const id = parseInt(button.dataset.id);
                const item = listOfItems.find(i => i.id === id);
                if (item) {
                    item.quantity++;

                    const row = button.closest('.row');
                    const counter = row.querySelector('.counter');
                    counter.textContent = item.quantity;

                    redoStatistics();
                    const minusButton = row.querySelector('.minus');
                    if (minusButton && item.quantity > 1) {
                        minusButton.disabled = false;
                    }
                    //repaintRow(item, button);
                }
            });
            button.classList.add('events-attached');
            }
        });

        document.querySelectorAll('.minus').forEach(button => {
            if (!button.classList.contains('events-attached')) {
            button.addEventListener('click', () => {
                const id = parseInt(button.dataset.id);
                const item = listOfItems.find(i => i.id === id);
                if (item && item.quantity > 1) {
                    item.quantity--;
                    //showList();

                    const row = button.closest('.row');
                    const counter = row.querySelector('.counter');
                    counter.textContent = item.quantity;

                    redoStatistics();
                    if (item.quantity === 1) {
                        button.disabled = true;
                    }
                }
            });
            button.classList.add('events-attached');
            }
        });

        document.querySelectorAll('.name:not(.crossed-name)').forEach(span => {
            span.addEventListener('click', () => {
                const id = parseInt(span.dataset.id);
                const item = listOfItems.find(i => i.id === id);
                if (!item) return;

                const input = document.createElement('input');
                input.type = 'text';
                input.value = item.name;
                input.classList.add('name-change');
                span.replaceWith(input);
                input.focus();

                function saveEditedName() {
                    item.name = input.value.trim() || item.name;
                    repaintRow(item, input);
                }

                input.addEventListener('blur', saveEditedName);
                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') saveEditedName();
                });
            });
        });
    }

    function redoStatistics() {
        leftItems.innerHTML = '';
        boughtItems.innerHTML = '';

        const toBuy = listOfItems.filter(i => !i.bought);
        const bought = listOfItems.filter(i => i.bought);

        if (toBuy.length > 0) {
            toBuy.forEach(item => {
                const span = document.createElement('span');
                span.classList.add('product');
                span.innerHTML = `${item.name}<span class="amount">${item.quantity}</span>`;
                leftItems.appendChild(span);
            });
        } else {
            leftItems.innerHTML = '<p>Ще немає товарів</p>';
        }

        if (bought.length > 0) {
            bought.forEach(item => {
                const span = document.createElement('span');
                span.classList.add('product-crossed');
                span.innerHTML = `${item.name}<span class="amount">${item.quantity}</span>`;
                boughtItems.appendChild(span);
            });
        } else {
            boughtItems.innerHTML = '<p>Ще немає товарів</p>';
        }
    }
});
