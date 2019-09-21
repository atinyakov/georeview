ymaps.ready(init);
function init () {
   var map = new ymaps.Map('map', {
           center: [55.650625, 37.62708],
           zoom: 10
       }, {
           searchControlProvider: 'yandex#search'
       })
    //    counter = 0,
       // Создание макета содержимого балуна.
       // Макет создается с помощью фабрики макетов с помощью текстового шаблона.


       function createBaloon (coords) {

        BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<form style="margin: 10px;">' +
                '<b>{{properties.name}}</b><br />' +
                '<i id="count"></i> ' +
                '<button id="counter-button"> добавить </button>' +
            '</form>', {
            // Переопределяем функцию build, чтобы при создании макета начинать
            // слушать событие click на кнопке-счетчике.
            build: function () {
                // Сначала вызываем метод build родительского класса.
                BalloonContentLayout.superclass.build.call(this);
                // А затем выполняем дополнительные действия.
 
                document.getElementById('counter-button').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.onCounterClick();
                 })
            },
            // Аналогично переопределяем функцию clear, чтобы снять
            // прослушивание клика при удалении макета с карты.
            clear: function () {
                // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                // а потом вызываем метод clear родительского класса.
                BalloonContentLayout.superclass.clear.call(this);
            },
            onCounterClick: function () {
                console.log('here')
            }
        });

        var balloon = new ymaps.Balloon(map, {
            contentLayout: BalloonContentLayout
        });
           
        //    if (balloon.isOpen()) {
        //        console.log(coords);
        //        balloon.open(coords);
        //    }
        //    else {
        //        balloon.close();
        //    }

        balloon.options.setParent(map.options);
        balloon.open(coords);

        // console.log(balloon.isOpen());

        // if (!balloon.isOpen()) {
        //     //    console.log(coords);
        //     balloon.open(coords);
        // }   
        //            else {
        //        balloon.close();
        //    }

       }

       map.events.add('click', function (e) {
        var coords = e.get('coords');
        // console.log('before', map.balloon.isOpen());

        // if (!map.balloon.isOpen()) {
            //    console.log(coords);
            createBaloon(coords);
        // }   else {
        //     map.balloon.close();
        // }
        
       });
}