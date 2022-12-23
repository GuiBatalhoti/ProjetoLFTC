function contextMenu(data) {
    let contextMenu = $('#custom-context-menu');
    // if #custom-context-menu element not exists, create it
    if (contextMenu === null) {
        const ul = document.createElement('ul');
        ul.id = 'custom-context-menu';
        document.body.appendChild(ul);

        // prevent opening default context menu on custom context menu
        ul.oncontextmenu = e => e.preventDefault();

        contextMenu = ul;
    }

    const { style } = contextMenu;
    // if data not passed to function, hide context menu
    if (!data) {
        style.display = 'none';
        return;
    }

    let { items, x, y } = data;
    let itemsDom = [];

    for (let item of items) {
        if ('children' in item) {
            itemsDom.push(
                `<li>${item.text}<ul>${item.children
                    .map(subItem => {
                        const subItemData = 'data' in subItem ? `'${subItem.data}'` : '';
                        return `<li onclick="(${subItem.onclick})(${subItemData})">${subItem.text}</li>`;
                    })
                    .join('')}</ul><span>›</span></li>`
            );
        } else {
            const itemData = 'data' in item ? ` data-data="${item.data}"` : '';

            itemsDom.push(`<li onclick="(${item.onclick})(${itemData})">${item.text}</li>`);
        }
    }
    contextMenu.innerHTML = itemsDom.join('');

    style.display = 'block';
    const rect = contextMenu.getBoundingClientRect();

    if (x + rect.width <= canvasDesing.width) {
        style.left = x + 'px';
    } else {
        style.left = canvasDesing.width - rect.width + 'px';
    }

    if (y + rect.height <= canvasDesing.height) {
        style.top = y + 'px';
    } else {
        style.top = canvasDesing.height - rect.height + 'px';
    }
}
