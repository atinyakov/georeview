ymaps.ready(init);
function init () {
    var map = new ymaps.Map('map', {
            center: [55.650625, 37.62708],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 32,
            clusterDisableClickZoom: true
        });

       // Создание макета содержимого балуна.
       // Макет создается с помощью фабрики макетов с помощью текстового шаблона.


        function createBaloon (e) {
        var coords = e.get('coords');
        
        BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<form style="margin: 10px;">' +
                '<b>{{properties.name}}</b><br />' +
                '<i id="count"></i> ' +
                '<a id="counter-button"> добавить </a>' +
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
                    balloonContentLayout: BalloonContentLayout,
                    // Запретим замену обычного балуна на балун-панель.
                    // Если не указывать эту опцию, на картах маленького размера откроется балун-панель.
                    balloonPanelMaxMapArea: 0
                });
        
                map.geoObjects.add(placemark);
                balloon.close();
            }
        });

        var balloon = new ymaps.Balloon(map, {
            contentLayout: BalloonContentLayout
        });

        balloon.options.setParent(map.options);
        balloon.open(coords);

       }

        map.events.add('click', function (e) {

        console.log(map.balloon.isOpen());     
            createBaloon(e);      
        });
}