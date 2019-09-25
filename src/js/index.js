import '../css/style.css';

ymaps.ready(init);
function init () {
    var map = new ymaps.Map('map', {
            center: [55.650625, 37.62708],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        })

    window.clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        clusterDisableClickZoom: true,
        clusterBalloonContentLayout: "cluster#balloonCarousel"
    
    });

    map.geoObjects.add(clusterer);

    // Создание макета содержимого балуна.
    // Макет создается с помощью фабрики макетов с помощью текстового шаблона.

    function createBaloon (e) {
        var coords = e.get('coords');

        
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<form class="form">' +
                '<p class="form__address"></p>' +
                '<input class="form__input" type=name placeholder="Имя">' +
                '<input class="form__input" type=name placeholder="Имя">' +
                '<a class="form__btn" id="counter-button"> добавить </a>' +
            '</form>', {
            // Переопределяем функцию build, чтобы при создании макета начинать
            // слушать событие click на кнопке-счетчике.
            build: function () {
                // Сначала вызываем метод build родительского класса.
                BalloonContentLayout.superclass.build.call(this);
                // А затем выполняем дополнительные действия.

                document.getElementById('counter-button').addEventListener('click', (e) => {
                    this.onCounterClick(e);
                })
            },
            // Аналогично переопределяем функцию clear, чтобы снять
            // прослушивание клика при удалении макета с карты.
            clear: function () {
                // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                // а потом вызываем метод clear родительского класса.
                BalloonContentLayout.superclass.clear.call(this);
            },
            onCounterClick: function (e) {
                e.preventDefault();
                var placemark = new ymaps.Placemark(coords, {
                    name: 'Считаем'
                }, {
                    balloonContentHeader: 'coords.getAddressLine()',
                    balloonContentLayout: BalloonContentLayout,
                    // Запретим замену обычного балуна на балун-панель.
                    // Если не указывать эту опцию, на картах маленького размера откроется балун-панель.
                    balloonPanelMaxMapArea: 0
                });

                placemark.events.add('balloonopen', function (e) {
                    console.log('nen')
                });

        
                window.clusterer.add(placemark);
                window.balloon.close();
            }
        });

        window.balloon = new ymaps.Balloon(map, {
            contentLayout: BalloonContentLayout
        });



        window.balloon.options.setParent(map.options);
        window.balloon.open(coords);

        function getAddress(coords) {

            ymaps.geocode(coords).then(res => {
                var firstGeoObject = res.geoObjects.get(0);
                addressLink.textContent = firstGeoObject.getAddressLine();
            });
        }

        var addressLink = document.querySelector('.form__address');
        getAddress(coords);

    }

    map.events.add('click', function (e) {

        if (window.balloon) {
            window.balloon.close();
        }
        createBaloon(e);      
    });
}