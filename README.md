# Sequelize admin panel

## TL;DR

Скачайте архив, в корне запустите

```sh
yarn install && cd demo && yarn install && yarn initdb && yarn start
```

и откройте `localhost:3000`

## Основные возможности

### Простая настройка

* Просто подключите sequelizeAdmin как middleware по требуемому пути
* В минимальной конфигурации достаточно передать экземпляр sequelize для получения рабочей админ-панели
* Исходные модели не требуют модификации. Все дополнительные данные находятся в наследниках класса ModelAdmin

### Настройка поведения полей

Возможно переопределение функций рендеринга полей моделей в списке записей и на экране редактирования записи

### Поддержка типов и отношений

Поддерживается большинство примитивных типов Sequelize и все отношения (associations)

### Пользователи и права

Встроенное управление пользователями и правами доступа на таблицы

### Локализация

Все переводы, включая сообщения, названия моделей, полей и действий передаются в едином объекте, разбитом по локалям. Система определяет нужную локаль по заголовкам браузера. В случае отсутствия перевода используется встроенный английский для сообщений или название модели или поля для моделей и полей соответственно.

## Быстрый старт

Создайте проект

```sh
mkdir sequelize-admin-demo; cd sequelize-admin-demo
yarn init
yarn add express sequelize sequelize-cli
yarn add mysql2 # или другой адаптер
node node_modules/.bin/sequelize init
```

отредактируйте `config/config.json` для подключения к вашей базе данных, рекомендуется сразу добавить
`"define": {"charset": "utf8", "collate": "utf8_general_ci"}`, создайте БД

```sh
node node_modules/.bin/sequelize db:create
```

Создайте главный файл проекта `index.js`

```js
const express = require('express')
const db = require('./models')
const { sequelizeAdmin } = require('./sequelize-admin')
const app = express()
app.use('/admin', sequelizeAdmin(express, db.sequelize))
app.listen(process.env.PORT || 3000, () => console.log('Server started'))
```

создайте файл `cli.js`

```js
const db = require('./models')
require('./sequelize-admin').cli(db.sequelize)
```

обратите внимание, такая форма запуска работает потому что созданный по умолчанию файл ./models подключает все модели. Если вы не используете `sequelize-cli`, убедитесь что нужные модели импортированы (вызван Sequelize.define).

Создайте и синхронизируйте модели с помощью `sequelize-cli`

```sh
node node_modules/.bin/sequelize model:generate --name MyModel --attributes name:STRING,count:INTEGER
node node_modules/.bin/sequelize db:migrate
node ./cli init # инициализация таблицы пользователей
```

либо, если вы не хотите пользоваться sequelize migration, вручную создайте в каталоге models файлы моделей в соответствии с шаблоном:

```js
module.exports = (sequelize, DataTypes) => {
  const MyModel = sequelize.define(
    'MyModel',
    {
      // <--- имя модели
      name: DataTypes.STRING,
      count: DataTypes.INTEGER
    },
    {}
  )
  MyModel.associate = function(models) {
    // associations can be defined here
    // like this: MyModel.belongsTo(models.OtherModel)
  }
  return MyModel
}
```

и синхронизируйте модели вызовом

```sh
node ./cli init --all # очистит все данные!
```

Недостатком первого способа является необходимость ручного описания изменений схем таблиц в файлах миграции, второго -- сброс содержимого базы данных при переинициализации. Подробнее о работе с sequelizejs [по ссылке](http://docs.sequelizejs.com/).

**Примечание:** попытка использовать Sequelize.sync({alter: true}) может приводить к дубликации constraints

Запустите сервер `node .` и откройте в браузере `http://localhost:3000/admin`. Готово!

## Настройка представлений

Для настройки представления полей модели создайте наследника класса `ModelAdmin`, в функции `init` задайте требуемые значения, а затем передайте пару `[MyModel,MyModelAdmin]` в функцию `sequelizeAdmin` свойством `models` третьего аргумента.

`MyModelAdmin.js`:

```js
const { ModelAdmin } = require('./sequelize-admin')

class MyModelAdmin extends ModelAdmin {
  repr(req, entry) {
    return entry.name
  }

  init() {
    super.init()
    this.list_fields = ['id', 'name', 'count', 'nonExistedField']
    this.list_links = ['id']
    this.search_fields = ['name', 'count']
    this.ordering = ['count', '-name']
    this.list_per_page = 20
    this.editor_fields = ['id', 'name', 'count']
    this.readonly_fields = ['id']
    this.icon = '<span class="oi oi-media-play"></span>'

    this.setFieldDescription('name', {
      view: (req, entry, fieldName) => {
        return 'I love ' + entry.name + '!'
      },
      html: false
    })

    this.setFieldDescription('count', {
      // можно и Promise
      view: (req, entry, fieldName) => {
        const model = req.SA.modelAdminInstance.model,
          Sequelize = req.SA.Sequelize
        // другие модели доступны через req.SA.modelAdminManager.getModelAdminByModelName('model_name').model
        return (
          model
            .find({
              // получаем максимальное
              attributes: [
                [Sequelize.fn('max', Sequelize.col('count')), 'max_count']
              ]
            })
            // простое экранирование
            .then(entry => parseInt(entry.get('max_count'), 10))
            .then(max => `<progress value="${entry.count}" max="${max}">`)
        )
      },
      html: true // осторожно -- вывод не экранируется
    })

    // можно создать сколько угодно псевдо-полей
    this.setFieldDescription('nonExistedField', {
      view: (req, entry, fieldName) => {
        return entry.name.toUpperCase() + ' is great!'
      }
    })
  }
}
module.exports = MyModelAdmin
```

`index.js`:

```js
...
app.use('/admin', sequelizeAdmin(express, db.sequelize, {
  models: [ [db.MyModel, require('./MyModelAdmin')] ]
}))
...
```

В результате поле `name` будет признаваться в любви, `count` показывать progressbar относительно наибольшего в таблице значения, а третье поле, отсутсвующее в таблице, заниматься восхвалением.

Рассмотрим по пунктам:

* Функция `repr` создаёт представление записи модели (строки таблицы). Оно используется в таблице результатов если не заданы поля в `list_fields`, а также для создания списков отношений. Обрабатывается как plain-text, можно возвращать Promise.
* Свойства `list_fields`, `list_links`, `search_fields`, `ordering` задают соответственно какие поля будут видны в таблице результатов, какие из них являются ссылками, по каким осуществляется поиск и сортировка по умолчанию (в том числе в списках отношений). Надо отметить, что поиск и сортировка возможна только по примитивных типам, присутствующим в базе (т.е. не по associations и не по искусственным полям).
* Если нужно вывести все поля кроме указанных, перечислите их в `list_exclude`. Если нужно вывести вообще все поля, укажите в `list_exclude` несуществующее поле. `list_fields` при этом должно быть пустым.
* В `list_fields` можно указать несуществующее поле, а затем описать его представление.
* В `icon` можно указать произвольный html, рекомендуется иконочный шрифт.

Далее, вызовом `setFieldDescription` мы переопределяем функцию рендеринга представления поля строки таблицы и указываем, следует ли её вывод интерпретировать как html. Не забывайте об экранировании.

Легко заметить, что каждый вызов `view` делает одну и ту же работу по вычислению максимального значения. Правильным решением будет вынести её в специальный коллбэк `beforeListRender`. Обратите внимание, возвращаемое значение передаётся как свойство объекта req:

```js
class MyModelAdmin extends ModelAdmin {
...
  beforeListRender(req, count, entries) {
    const model = req.SA.modelAdminInstance.model,
      Sequelize = req.SA.Sequelize
    return model.find({
        // получаем максимальное
        attributes: [
          [Sequelize.fn('max', Sequelize.col('count')), 'max_count']
        ]
      })
      // простое экранирование и кэширование
      .then(entry => req.MAX = parseInt(entry.get('max_count'), 10))
  }
...
  init() {
    ...
    this.setFieldDescription('count', {
      view: (req, entry, fieldName) =>
        `<progress value="${entry.count}" max="${req.MAX}">`,
      html: true
    })
    ...
  }
```

## Настройка виджетов

Функции `setFieldDescription` можно передать свойство `widget`, в котором указать функцию рендеринга виджета с сигнатурой `(req, entry, fieldName, value, options)` и возвращающей html-код виджета.

Например, напишем виждет для поля `count` в форме ползунка

```js
    this.setFieldDescription('count', {
      ...
      widget: (req, entry, fieldName, value, options) =>
      `<input type="range" min="0" max="100" step="1"
        class="form-control"
        ${options.readOnly ? 'disabled' : ''}
        name=${fieldName}
        value=${value} />`
    })
```

Обратите внимание, нужно обязательно указать `name=fieldName`, желательно установить текущее значение `value` и флаг `readonly`. Класс `form-control` из `bootstrap` растягивает виджет по ширине и в общем случае не обязателен.

Если виджет сложнее поля ввода, следует создать скрытый `input` и помещать в него актуальное значение на клиентской стороне. Например, пусть поле `point` определено следующим образом:

```js
point: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: '55.75027920193085,37.622483042183035',
}
```

тогда виджет с яндекс-картой можно описать так:

```js
widget: (req, entry, fieldName, value) => {
  return `
      <!-- hidden form field -->
      <input type=hidden name="${fieldName}" value=${value} />
      <div style='width: 100%; height: 240px; border: solid black 1px' id="${fieldName}_mapid"></div>
      <script>
        function ${fieldName}_map() {
          var coord = '${value}'.split(',')
          var map = new ymaps.Map("${fieldName}_mapid", {
            center: coord, 
            zoom: 7
          });
          var placemark = new ymaps.Placemark(coord);
          map.events.add('click', function (e) {
            var coords = e.get('coords');
            placemark.geometry.setCoordinates(coords);
            // setup hidden form field
            document.getElementsByName("${fieldName}")[0].value=coords.join(',')
          });
          map.geoObjects.add(placemark);
        }
        ymaps.ready(${fieldName}_map);
      </script>`
}
```

Чтобы подключить библиотеку яндекс карт в методе `init` вызовите

```js
this.addExtraResource(
  '<script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>'
)
```

либо

```js
// js в конце необходим парсеру
this.addExtraResource('https://api-maps.yandex.ru/2.1/?lang=ru_RU#js')
```

Теперь при любом нажатии на карту сериализованные координаты попадают в скрытый `input`, и передаются при сохранении на сервер с корректным именем поля. Отдельно стоит отметить, что при создании любых `id` лучше генерировать его с участием имени поля (`${fieldName}_mapid`) во избежание коллизий.

## Настройка сеттеров

При сохранении записи модели каждое её поле сохраняется сеттером в соответствии с её типом. Переопределить функцию сохранения можно с помощью свойтства `setter` методов `addFieldsDescriptions` и `setFieldDescription`. В случае примитивного поля, сеттер по умолчанию выглядит так:

```js
function defaultSetter(req, entry, fieldName, transaction) {
  entry[fieldName] = req.body[fieldName]
}
```

Так же может возвращать `Promise`. В сеттере можно поместить дополнительную проверку:

```js
function setter(req, entry, fieldName, transaction) {
  if (req.body[fieldName] % 10 === 0) entry[fieldName] = req.body[fieldName]
  else throw req.SA.getSequelizeError('multiples of ten', fieldName)
}
```

## Глобальные переопределения

Можно создать промежуточного наследника класса `ModelAdmin`, в котором переопределить функции рендеринга и сеттер для различных типов, в том числе несуществующих. А затем ссылаться на имена этих типов вместо определения функций в свойствах `view`, `widget` и `setter` методов `addFieldsDescriptions` и `setFieldDescription`:

```js
class CustomTypes extends ModelAdmin {
  init() {
    super.init()
    this.overrideTypeView('X_FILEBLOB', (req, entry, fieldName) => {
      return entry[fieldName]
        ? req.SA.tr('File size:') + entry[fieldName].length
        : req.SA.tr('No file')
    })
    this.overrideTypeWidget(
      'X_FILEBLOB',
      (req, entry, fieldName, value, options) => {
        return `<input type="file" class="form-control" ${
          options.readOnly ? 'disabled' : ''
        } name="${fieldName}" />`
      }
    )
    this.overrideTypeSetter(
      'X_FILEBLOB',
      (req, entry, fieldName, transaction) => {
        return new Promise((resolve, reject) => {
          const file = req.files[fieldName]
          if (file.size > 1048576)
            reject(req.SA.getSequelizeError('file length', fieldName))
          fs.readFile(file.path, (err, buf) => {
            if (err) reject(err)
            else {
              entry[fieldName] = buf
              resolve()
            }
          })
        })
      }
    )
  }
}

class OverridedAdmin extends CustomTypes {
  init() {
    super.init()
    this.addFieldDescriptions({
      file: {
        view: 'X_FILEBLOB',
        widget: 'X_FILEBLOB',
        setter: 'X_FILEBLOB'
      }
    })
  }
}
```

## Действия (actions)

Для массовой обработки результатов в таблице записей вы можете задать action.

Для этого передайте массив действий в свойство `ModelAdmin.actions`. Допустим, мы хотим иметь возможность обнулять поле `count`

```js
this.actions = [
  {
    name: 'zerofy',
    renderer: (req, res, modelAdmin, ids, exit) => {
      let transaction
      return req.SA.sequelizeInstance
        .transaction()
        .then(_transaction => (transaction = _transaction))
        .then(() =>
          modelAdmin.model.update(
            { count: 0 },
            { where: { [modelAdmin.pkName]: ids }, transaction }
          )
        )
        .then(() => transaction.commit())
        .catch(() => transaction.rollback())
        .then(() => exit())
    }
  }
]
```

Теперь достаточно отметить чекбоксы соответствующих записей и выбрать пункт `zerofy` из выпадающего списка в заголовке колонки с чекбоксами. По умолчанию там присутствует только пункт `delete`.

Коллбэк `renderer` позволяет полностью управлять отображением и переходами между страницами, как это сделано в действии `delete`, но в данном случае явно избыточен. Вместо него можно в свойстве `changer` определить простой коллбэк, принимающий записи по одной:

```js
this.actions = [
  {
    name: 'zerofy',
    changer: entry => (entry.count = 0)
  }
]
```

Не всегда оптимально, но определённо намного проще.

`TODO`: возврат ошибок и affected rows

## Обработка параметров запроса и сквозные параметры

После редактирования записи модели желательно вернуться к просмотру списка записей в том же состоянии, включая пагинацию, поиск и т.д. Для упрощения этого, некоторые параметры должны автоматически передаваться при навигации. Реализовано это следующим образом. Есть предопределённый список параметров и функция, которая создаёт URL перехода включающего все эти параметры в сериализованном виде в свойстве `params`. Например, если мы находся на странице `/admin/model/modelName/?search=тест`, при переходе на вторую страницу результатов поиска, URL ссылки перехода будет содержать `/admin/model/modelName?params={"search":"тест","page":1}`.

Все URL переходов внутри админ-панели должны создаваться функцией `req.SA.queryExtender()`, принимающей следующие параметры:

* массив частей пути относительно корня админ-панели `['model', 'modelName']`
* объект с новыми параметрами `{page: 1}`
* массив параметров, которые не следует включать в запрос или `false` для исключния всех.

В результате вышеупомянутая ссылка пагинации выглядит так (используется `pug`):

```js
a(href=req.SA.queryExtender(["model", req.SA.modelName], {page: data.page+1}, []) >>
```

Аналогично, при использовании форм, в форму следует включить поле сгенерированное `req.SA.formExtender` с теми же аргументами кроме первого

```js
//- action формы создаётся без параметров запроса
form(action=req.SA.queryExtender(["model", req.SA.modelName], {}, false), enctype="multipart/form-data")
  //- поле формы
  input(type="text", name="search", value=req.SA.params.search)
  //- параметры кроме search и page вставлены в форму
  | !{req.SA.formExtender({}, ["search", "page"])}
```

На что следует обратить внимание:

* `action` формы не должно содержать параметров
* значение поля формы берётся из `req.SA.params.search`
* при вызове `req.SA.formExtender` необходимо явно исключить свойство `search`, иначе после очистки поле поиска будет использовано старое значение
* `page` очищается из тех соображений, что номер текущей страницы после изменения результатов вывода не имеет смысла


Подробнее о `req.SA.params.search`: в него попадают содержимое десериализованного поля `params`, параметры запроса, параметры форм в порядке перекрытия.

Список сквозных параметров: `['sort', 'page', 'search', 'subwindow', 'action', 'entryIds', 'backurl']`

## Валидация

Проверки корректности вводных данных лежат на `sequelize`, поэтому желательно описывать проверки при объявлении поля. Подробнее [по ссылке](http://docs.sequelizejs.com/)

Собственные проверки можно поместить в сеттер.

## Локализация

Запустите созданный ранее cli.js для получения объекта переводов

```sh
node cli dumptranslation [--empty] [--hints] > translations/[локаль].json
```

Отредактируйте локаль, переводы сообщений, имена моделей, полей и действий. Повторить по количеству локалей.
Так же вы можете задать подсказки для моделей и полей, в первом случае через свойство `hint`, во втором через одноименное с именем поля свойство с добавленным суффиксом `_hint`

```json
  "sequelize_admin_user": {
    "label": "",
    "plural": "",
    "hint": "подсказка модели",
    "fields": {
      "username": "",
      "username_hint": "подсказка поля",
  ...
```

Сгруппируйте переводы и передайте свойство `translation` в третий аргумент `sequelizeAdmin`:

```js
app.use(
  '/admin',
  sequelizeAdmin(express, db.sequelize, {
    translation: Object.assign(
      {},
      require('./translations/ru'),
      require('./translations/de')
    )
  })
)
```

Автоматизация импорта содержимого папки translations на ваше усмотрение.

TODO: перевод ошибок

## Управление пользователями и правами

Для создания суперпользователя выполните

```sh
node cli createsuperuser логин пароль
```

В режиме разработки (`process.env.NODE_ENV !== 'production'`) это необязательно, при отстутствии суперпользователей осуществляется автоматический вход пользователя `EMERGENCY` и выводится предупреждение.

В список моделей добавлена `sequelize_admin_users`, в которой перечислены все пользователи, а также есть возможность управления правами доступа к моделям согласно CRUD.

## Ограничения

* подразумевается что `primary key` является числовым
* работа c `paranoid option` не проверялась
* для парсинга форм используется `formidable`, желательно использовать `enctype="multipart/form-data"`. Настройки парсера можно передать в свойстве `formidableOpts` третьего параметра sequelizeAdmin