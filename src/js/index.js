let myMap;

ymaps.ready(init);
function init(){ 
    // Создание карты.    
    var myPlacemark;
    myMap = new ymaps.Map("map", {
        // Координаты центра карты.
        // Порядок по умолчанию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: [55.76, 37.64],
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 7
    },{
        searchControlProvider: 'yandex#search'
    });

    objectManager = new ymaps.ObjectManager({
        // Чтобы метки начали кластеризоваться, выставляем опцию.
        clusterize: true
        // geoObjectOpenBalloonOnClick: false,
        // clusterOpenBalloonOnClick: false
    });


    myMap.geoObjects.add(objectManager);

       // Слушаем клик на карте.
       myMap.events.add('click', function (e) {
        var coords = e.get('coords');

        // Если метка уже создана – просто передвигаем ее.
        // if (myPlacemark) {
        //     myPlacemark.geometry.setCoordinates(coords);
        // }
        // Если нет – создаем.
        // else {
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            myPlacemark.balloon.open();
            // Слушаем событие окончания перетаскивания на метке.
            myPlacemark.events.add('dragend', function () {
                getAddress(myPlacemark.geometry.getCoordinates());
            });
        // }
        getAddress(coords);
    });

    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: false
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        // myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                    // Формируем строку с данными об объекте.
                    iconCaption: [
                        // Название населенного пункта или вышестоящее административно-территориальное образование.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: firstGeoObject.getAddressLine(),
                    balloonContentBody: 
                    '<form>' +
                        '<input type="name" placeholder="имя"></input>' +
                        '<input type="place" placeholder="место"></input>' +
                        '<textarea placeholder="Поделитесь впечатлениями"></textarea>' +
                        '<button type="submit">Добавить</button>' + 
                    '</form>'

                });
        });
    }
}

// var placemark = new ymaps.Placemark(myMap.getCenter(), {
//     // Зададим содержимое заголовка балуна.
//     balloonContentHeader: '<a href = "#">Рога и копыта</a><br>' +
//         '<span class="description">Сеть кинотеатров</span>',
//     // Зададим содержимое основной части балуна.
//     balloonContentBody: '<img src="img/cinema.jpg" height="150" width="200"> <br/> ' +
//         '<a href="tel:+7-123-456-78-90">+7 (123) 456-78-90</a><br/>' +
//         '<b>Ближайшие сеансы</b> <br/> Сеансов нет.',
//     // Зададим содержимое нижней части балуна.
//     balloonContentFooter: 'Информация предоставлена:<br/>OOO "Рога и копыта"',
//     // Зададим содержимое всплывающей подсказки.
//     hintContent: 'Рога и копыта'
// });