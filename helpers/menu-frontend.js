const getMenuFrontEnd = (role = 'USER') => {

    const menu = [{
            title: 'Dashboard',
            icon: 'mdi mdi-gauge',
            submenu: [
                {
                    title: 'ProgressBar',
                    url: 'progress'
                },
                {
                    title: 'Graphics',
                    url: 'grafica1'
                }
            ]
        },
        {
            title: 'Mantenimiento',
            icon: 'mdi mdi-folder-lock-open',
            submenu: [
                /* {
                   title: 'Usuarios', url: 'users'
                 },
                {
                    title: 'Hospitales',
                    url: 'hospitals'
                },
                {
                    title: 'Doctores',
                    url: 'doctors'
                }*/
            ]
        }
    ];

    if (role === 'ADMIN') {
        menu[1].submenu.unshift({ title: 'Usuarios', url: 'users-maintenances' });
        menu[1].submenu.unshift({ title: 'Categorías', url: 'categories-maintenance' });
        menu[1].submenu.unshift({ title: 'Productos', url: 'products-maintenances' });
        menu[1].submenu.unshift({ title: 'banner', url: 'banner-maintenances' });
    }

    return menu;



}


module.exports = {
    getMenuFrontEnd
}
