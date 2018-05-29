const db = require('./models')
let workers, managers, projects

let transaction

db.sequelize
  .transaction()
  .then(_t => (transaction = _t))
  .then(() =>
    db.Worker.bulkCreate(
      [
        { name: 'Елышев Михей Аполлинариевич' },
        { name: 'Выгузов Дементий Даниилович' },
        { name: 'Распопов Аристарх Чеславович' },
        { name: 'Щедрин Святослав Данилевич' },
        { name: 'Куклев Ефрем Моисеевич' },
        { name: 'Тюлепов Викентий Адрианович' },
        { name: 'Махмудов Авдей Захарович' },
        { name: 'Жеффре Артём Вадимович' },
        { name: 'Коржаков Лукьян Артемович' },
        { name: 'Клюшников Даниил Иннокентиевич' },
        { name: 'Тычинин Илья Викентиевич' },
        { name: 'Афонин Максим Демьянович' },
        { name: 'Шамило Эдуард Самсонович' },
        { name: 'Козаков Лавр Ипполитович' },
        { name: 'Седов Олег Касьянович' },
        { name: 'Нямин Агафон Кириллович' },
        { name: 'Лебедков Федот Онуфриевич' },
        { name: 'Приходько Прохор Никитевич' },
        { name: 'Цвиленев Бронислав Левович' },
        { name: 'Павленко Филимон Эдуардович' },
        { name: 'Кац Семен Трофимович' },
        { name: 'Колдаев Андрей Прохорович' },
        { name: 'Сильвестров Всеволод Дмитриевич' },
        { name: 'Нечаев Григорий Титович' },
        { name: 'Протасов Юлий Филиппович' },
        { name: 'Остапчук Ян Глебович' },
        { name: 'Славаков Федор Анатолиевич' },
        { name: 'Гольц Валентин Климентович' },
        { name: 'Пустов Лука Евгениевич' },
        { name: 'Форопонов Серафим Самуилович' },
        { name: 'Журов Константин Измаилович' },
        { name: 'Логвинов Степан Федорович' },
        { name: 'Юрков Артур Потапович' },
        { name: 'Яшкин Мирон Евстафиевич' },
        { name: 'Витвинин Тарас Маркович' },
        { name: 'Маркелов Кондрат Сократович' },
        { name: 'Капустин Алексей Гаврилевич' },
        { name: 'Мельник Радислав Михаилович' },
        { name: 'Смешной Наум Сидорович' },
        { name: 'Кярбер Евгений Давыдович' },
        { name: 'Яфаров Мартын Владиславович' },
        { name: 'Гагарин Никон Егорович' },
        { name: 'Ругов Модест Яковович' },
        { name: 'Жаров Сидор Ульянович' },
        { name: 'Лысов Эрнест Афанасиевич' },
        { name: 'Клепахов Никита Игоревич' },
        { name: 'Шаталов Осип Ильевич' },
        { name: 'Туров Захар Елисеевич' },
        { name: 'Карапетян Мирослав Ираклиевич' },
        { name: 'Кондаков Мефодий Валерьянович' },
        { name: 'Мармазов Кир Эрнестович' },
        { name: 'Явленский Игнат Федотович' },
        { name: 'Серпионов Севастьян Агапович' },
        { name: 'Чичеринов Семён Пахомович' },
        { name: 'Трошкин Якуб Иванович' },
        { name: 'Шуста Мартьян Сигизмундович' },
        { name: 'Голубчиков Казимир Панкратиевич' },
        { name: 'Лощилов Лаврентий Михеевич' },
        { name: 'Ягужинский Фока Гордеевич' },
        { name: 'Бойков Венедикт Эмилевич' },
        { name: 'Набойченко Лев Онисимович' },
        { name: 'Купревич Ульян Алексеевич' },
        { name: 'Давыдкин Вацлав Евграфович' },
        { name: 'Кружков Порфирий Семенович' },
        { name: 'Зыльков Изяслав Герасимович' },
        { name: 'Бабинов Савелий Адамович' },
        { name: 'Чупров Карп Прокофиевич' },
        { name: 'Пушменков Родион Григориевич' },
        { name: 'Ядренкин Владислав Тарасович' },
        { name: 'Ященко Борислав Леонидович' },
        { name: 'Характеров Матвей Кондратович' },
        { name: 'Аниканов Сократ Святославович' },
        { name: 'Заславский Андриян Сергеевич' },
        { name: 'Колиух Эммануил Фомевич' },
        { name: 'Аристов Юлиан Наумович' },
        { name: 'Шерешевский Клавдий Севастьянович' },
        { name: 'Саракаев Георгий Давидович' },
        { name: 'Справцев Руслан Венедиктович' },
        { name: 'Царегородцев Мстислав Проклович' },
        { name: 'Мерзлов Самуил Феликсович' },
        { name: 'Николин Василий Александрович' },
        { name: 'Кулатов Рубен Мартьянович' },
        { name: 'Яшков Прокофий Саввевич' },
        { name: 'Нюхтилин Вадим Брониславович' },
        { name: 'Молодцов Егор Остапович' },
        { name: 'Толкачёв Роман Якубович' },
        { name: 'Пушкин Евстигней Епифанович' },
        { name: 'Францев Мечислав Евлампиевич' },
        { name: 'Тамахин Чеслав Леонтиевич' },
        { name: 'Иванов Денис Ростиславович' },
        { name: 'Посохов Александр Куприянович' },
        { name: 'Эпингер Яков Эрнстович' },
        { name: 'Ткач Леонид Платонович' },
        { name: 'Тамило Касьян Андреевич' },
        { name: 'Богомазов Тимур Несторович' },
        { name: 'Ефремович Терентий Архипович' },
        { name: 'Яйцов Петр Капитонович' },
        { name: 'Богоносцев Адам Филимонович' },
        { name: 'Якобсон Игнатий Федосиевич' },
        { name: 'Балинский Сергей Зиновиевич' }
      ],
      { transaction }
    )
  )
  .then(() =>
    db.Manager.bulkCreate(
      [
        { name: 'Мурогов Харитон Мирославович' },
        { name: 'Яцковский Викентий Валериевич' },
        { name: 'Полынов Виктор Андронович' },
        { name: 'Руских Руслан Маркович' },
        { name: 'Крымов Капитон Онуфриевич' },
        { name: 'Беликов Мечислав Проклович' },
        { name: 'Весовой Демьян Онисимович' },
        { name: 'Зубков Захар Елисеевич' }
      ],
      { transaction }
    )
  )
  .then(() =>
    db.Project.bulkCreate(
      [
        { name: 'контент' },
        { name: 'PHP' },
        { name: 'лингвистика' },
        { name: 'Bootstrap' },
        { name: 'SEO' },
        { name: 'веб-дизайн' },
        { name: 'RESTFull' },
        { name: 'Photoshop' },
        { name: 'iOS' },
        { name: 'личный кабинет' },
        { name: 'тестирование' },
        { name: 'React' },
        { name: 'NodeJS' },
        { name: 'базы данных' },
        { name: 'таргет-группа' },
        { name: 'отладка' }
      ],
      { transaction }
    )
  )
  .then(() =>
    db.customViews.bulkCreate(
      [
        {
          position: '55.76382220168617,37.621624735298276',
          color: 'rgba(255,0,0,0.76)',
          smile: '128553'
        },
        {
          position: '59.95089442480071,30.318358248999793',
          color: 'rgba(0,85,255,0.71)',
          smile: '128541'
        },
        {
          position: '55.172817785025586,61.40419022362274',
          color: 'rgba(0,255,12,0.78)',
          smile: '128544'
        }
      ],
      { transaction }
    )
  )
  .then(() =>
    db.globalOverrides.bulkCreate(
      [
        { name: 'file1', file: '   ' },
        { name: 'file2', file: '           ' },
        { name: 'file3', file: '                     ' },
        { name: 'file4', file: '                                  ' },
        { name: 'file5', file: '                                             ' }
      ],
      { transaction }
    )
  )

  .then(() =>
    db.Worker.findAll({ transaction }).then(entries => (workers = entries))
  )
  .then(() =>
    db.Manager.findAll({ transaction }).then(entries => (managers = entries))
  )
  .then(() =>
    db.Project.findAll({ transaction }).then(entries => (projects = entries))
  )
  .then(() => {
    return Promise.all(
      workers.map(worker => {
        return worker
          .setManager(managers[ri(0, managers.length)], { transaction })
          .then(
            () =>
              Math.random() > 0.7
                ? worker.addProject(projects[ri(0, projects.length)], {
                    transaction
                  })
                : ''
          )
          .then(
            () =>
              Math.random() > 0.7
                ? worker.addProject(projects[ri(0, projects.length)], {
                    transaction
                  })
                : ''
          )
          .then(
            () =>
              Math.random() > 0.7
                ? worker.addProject(projects[ri(0, projects.length)], {
                    transaction
                  })
                : ''
          )
          .then(
            () =>
              Math.random() > 0.7
                ? worker.addProject(projects[ri(0, projects.length)], {
                    transaction
                  })
                : ''
          )
          .then(
            () =>
              Math.random() > 0.7
                ? worker.addProject(projects[ri(0, projects.length)], {
                    transaction
                  })
                : ''
          )
          .then(
            () =>
              Math.random() > 0.7
                ? worker.addProject(projects[ri(0, projects.length)], {
                    transaction
                  })
                : ''
          )
      })
    )
  })
  .then(() => {
    return Promise.all(
      projects.map((project, i) => {
        return project.setManager(managers[i], { transaction })
      })
    )
  })
  .then(() =>
    db.actions.bulkCreate(
      [
        { name: 'Due', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Leonardo', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Yun', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Micro', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Uno', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Arduino Ethernet', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Duemilanove', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Diecimila', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Nano', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Mega ADK', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Mega2560', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Mega', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'LilyPad', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Fio', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Mini', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Pro', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Pro Mini', count: ri(0, 500), state: !!ri(0, 2) },
        {
          name: 'USB Serial Light Адаптер',
          count: ri(0, 500),
          state: !!ri(0, 2)
        },
        { name: 'Arduino Mini', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'WiFi', count: ri(0, 500), state: !!ri(0, 2) },
        { name: 'Motor Shield', count: ri(0, 500), state: !!ri(0, 2) }
      ],
      { transaction }
    )
  )
  .then(() => transaction.commit())

function ri(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min)
  rand = Math.round(rand)
  return rand
}
