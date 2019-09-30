import '../css/style.css';

ymaps.ready(init);
function init () {

    var mapEls = [];
    var idx = 0;

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

    window.clusterer.events.add('click', (e) => {
        var object = e.get('target');


        if (!object.getGeoObjects) {
            // клик был по метке   
            createBaloon(object.geometry._coordinates, object);
        }

    })

    document.addEventListener('click', (e) => {
        e.preventDefault();

        if(e.target.classList.contains('linkCoords')) {
            var elCoords = e.target.dataset.coords.split(',');
            var coords = [+ elCoords[0], + elCoords[1]];

            map.balloon.close();
            createBaloon(coords, 'cluster')
        }
    })


    if(localStorage.data !== undefined) {
        var pins = JSON.parse(localStorage.data);
        pins.forEach((pin) => {

            var placemark = new ymaps.Placemark(pin.coords, {
                balloonContentHeader: `<b>${pin.point}</b>`,
                balloonContentBody: `<div id="review"><a class="linkCoords" href="javascript:void(0);" data-coords="${pin.coords}"></a> <p>${pin.message}</p></div>`
                // balloonContentFooter: `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}.${d.getMinutes()}`,
            }, {
                balloonContentLayout: ymaps.templateLayoutFactory.createClass(
                    '<div class="form">' + 
                    '<form >' +
                        '<div class="header">' +'</div>' +
                        '<div class="body">' + 
                        '</div>' + 
                        '<p class="title">Ваш отзыв</p>' +
                        '<div>' + 
                        '<input id="name" type="name" placeholder="Имя">' + 
                        '</div>' + 
                        '<div>' + 
                        '<input id="point" type="text" placeholder="Укажите место">' +
                        '</div>' + 
                        '<div>' + 
                            `<textarea id="message" placeholder="Поделись впечатлениями"></textarea>` +
                        '</div>' + 
                        '<div class="button">' + 
                        '<button id="counter-button"> добавить </button>' +
                        '</div>' + 
                    '</form>' +
                    '</div>'
                    , {
                    // Переопределяем функцию build, чтобы при создании макета начинать
                    // слушать событие click на кнопке-счетчике.
                    build: function () {
                        // Сначала вызываем метод build родительского класса.
                        BalloonContentLayout.superclass.build.call(this);
                        // А затем выполняем дополнительные действия
        
                        if (data.length > 0) {
                            for (const key in data) {
                                if (data.hasOwnProperty(key)) {
                                    const body = document.querySelector('.body');
                                    const div = document.createElement('div');
                                    div.innerHTML = data[key].message;
                                    body.appendChild(div);
                                }
                            }
                        }
        
                        var form = document.querySelector('.form');  
                        document.getElementById('counter-button').addEventListener('click', (e) => {
                            e.preventDefault();
        
                            var form = document.querySelector('.form');
                            var name = form.querySelector('#name').value || pin.name;
                            var point = form.querySelector('#point').value || pin.point;
                            var message = form.querySelector('#message').value || pin.message;
                            var d = new Date();
            
                            var body = form.querySelector('.body');
        
                            var fragment = document.createElement('div');
                            fragment.innerHTML = `<div id="review"><b>${name}</b> <span>${point} </span><span class="data">${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}.${d.getMinutes()}</span><p>${message}</p></div>`;
                            body.appendChild(fragment);

                            this.addContent(coords, name, message, point, d);
                        })
                    },
                    // Аналогично переопределяем функцию clear, чтобы снять
                    // прослушивание клика при удалении макета с карты.
                    clear: function () {
                        // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                        // а потом вызываем метод clear родительского класса.
                        BalloonContentLayout.superclass.clear.call(this);
                    },
                    addContent: function (coords, name, message, point, d) {
        
                        var storage = localStorage;
                        var dataPins = [];
        
                        if(storage.data) {
                            dataPins = JSON.parse(storage.data);
                        }
        
        
                        mapEls[idx] = { coords: coords, name: name, message: `<div id="review"><b>${name}</b> <span>${point}</span><span class="data">${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}.${d.getMinutes()}</span><p>${message}</p></div>`}
                        dataPins.push(mapEls[idx])

                        storage.data = JSON.stringify(dataPins);
                        
                        console.log(storage);
                        idx++;
        
        
                        var placemark = new ymaps.Placemark(coords, {
                            balloonContentHeader: `<b>${point}</b>`,
                            balloonContentBody: `<div id="review"><a class="linkCoords" href="javascript:void(0);" data-coords="${coords}">${points}</a> <p>${message}</p></div>`,
                            balloonContentFooter: `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}.${d.getMinutes()}`,
                        }, {
                            balloonContentLayout: BalloonContentLayout,
                            // Запретим замену обычного балуна на балун-панель.
                            // Если не указывать эту опцию, на картах маленького размера откроется балун-панель.
                            balloonPanelMaxMapArea: 0,
                            hasBalloon: false
                        });
                
                        window.clusterer.add(placemark);
                        // window.balloon.close();
                    }
                }),
                // Запретим замену обычного балуна на балун-панель.
                // Если не указывать эту опцию, на картах маленького размера откроется балун-панель.
                balloonPanelMaxMapArea: 0,
                hasBalloon: false
            });
    
            window.clusterer.add(placemark);
        })
    }

    map.geoObjects.add(clusterer);

    // Создание макета содержимого балуна.
    // Макет создается с помощью фабрики макетов с помощью текстового шаблона.

    function createBaloon (coords, object) {

        var data = [];

        // добавляем новый пин в data
        if (object && object !== 'cluster') {
            for (let key in mapEls) {
                if (mapEls.hasOwnProperty(key)) {
                   var eq = JSON.stringify(mapEls[key].coords) == JSON.stringify(object.geometry._coordinates);
                    if (eq) {
                        data.push(mapEls[key]);
                    }
                }
            }
        }

        if (object === 'cluster') {

            object = coords

            for (let key in mapEls) {
                if (mapEls.hasOwnProperty(key)) {
                   var eq = JSON.stringify(mapEls[key].coords) == JSON.stringify(object) ;
                    if (eq) {
                        data.push(mapEls[key]);
                    }
                }
            }
        }


        ymaps.geocode(coords)
            .then(function (res) {
            const points = res.geoObjects.get(0).properties.get('text');
            localStorage.point = points;
        
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="form">' + 
            '<form >' +
                '<div class="header">'+ points +'</div>' +
                '<div class="body">' + 
                '</div>' + 
                '<p class="title">Ваш отзыв</p>' +
                '<div>' + 
                '<input id="name" type="name" placeholder="Имя">' +
                '</div>' + 
                '<div>' + 
                '<input id="point" type="text" placeholder="Укажите место">' +
                '</div>' + 
                '<div>' + 
                    `<textarea id="message" placeholder="Поделись впечатлениями"></textarea>` +
                '</div>' + 
                '<div class="button">' + 
                '<button id="counter-button"> добавить </button>' +
                '</div>' + 
            '</form>' +
            '</div>'
            , {
            // Переопределяем функцию build, чтобы при создании макета начинать
            // слушать событие click на кнопке-счетчике.
            build: function () {
                // Сначала вызываем метод build родительского класса.
                BalloonContentLayout.superclass.build.call(this);
                // А затем выполняем дополнительные действия


                // const point = document.getElementById('point').value;
                // var that = this;
                if (data.length > 0) {
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            const body = document.querySelector('.body');
                            const div = document.createElement('div');
                            div.innerHTML = data[key].message;
                            body.appendChild(div);
                        }
                    }
                }

                var form = document.querySelector('.form');
                
                document.getElementById('counter-button').addEventListener('click', (e) => {
                    e.preventDefault();

                    var form = document.querySelector('.form');
                    var name = form.querySelector('#name').value;
                    var point = form.querySelector('#point').value;
                    var message = form.querySelector('#message').value;
                    var d = new Date();
    
                    var body = form.querySelector('.body');

                    var fragment = document.createElement('div');
                    fragment.innerHTML = `<div id="review"><b>${name}</b> <span>${point} </span><span class="data">${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}.${d.getMinutes()}</span><p>${message}</p></div>`;
                    body.appendChild(fragment);


                    this.addContent(coords, name, message, point, d);
                })
            },
            // Аналогично переопределяем функцию clear, чтобы снять
            // прослушивание клика при удалении макета с карты.
            clear: function () {
                // Выполняем действия в обратном порядке - сначала снимаем слушателя,
                // а потом вызываем метод clear родительского класса.
                BalloonContentLayout.superclass.clear.call(this);
            },
            addContent: function (coords, name, message, point, d) {

                var storage = localStorage;
                var dataPins = [];

                if(storage.data) {
                    dataPins = JSON.parse(storage.data);
                }

                mapEls[idx] = { coords: coords, name: name, point: point, message: `<div id="review"><b>${name}</b> <span>${point}</span><span class="data">${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}.${d.getMinutes()}</span><p>${message}</p></div>`}
                dataPins.push(mapEls[idx])

                storage.data = JSON.stringify(dataPins);
                
                console.log(storage);
                idx++;


                var placemark = new ymaps.Placemark(coords, {
                    balloonContentHeader: `<b>${point}</b>`,
                    balloonContentBody: `<div id="review"><a class="linkCoords" href="javascript:void(0);" data-coords="${coords}">${points}</a> <p>${message}</p></div>`,
                    balloonContentFooter: `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}.${d.getMinutes()}`,
                }, {
                    balloonContentLayout: BalloonContentLayout,
                    // Запретим замену обычного балуна на балун-панель.
                    // Если не указывать эту опцию, на картах маленького размера откроется балун-панель.
                    balloonPanelMaxMapArea: 0,
                    hasBalloon: false
                });
        
                window.clusterer.add(placemark);
                // window.balloon.close();
            }
        });

        window.balloon = new ymaps.Balloon(map, {
            contentLayout: BalloonContentLayout
        });

        window.balloon.options.setParent(map.options);
        window.balloon.open(coords);
        });
        
    }

    map.events.add('click', function (e) {

        if (window.balloon) {
            window.balloon.close();
        }

        var coords = e.get('coords');

        createBaloon(coords);      
    });
}