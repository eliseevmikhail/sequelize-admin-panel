const { ModelAdmin } = require('../../')

class CustomViewAdmin extends ModelAdmin {
  repr(req, entry) {
    return entry.position
  }

  init() {
    super.init()
    this.list_fields = ['position']
    this.list_links = ['position']
    this.editor_fields = ['position', 'color', 'smile']
    this.icon = '<span class="oi oi-target"></span>'

    this.addExtraResource(
      '<script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>'
    )
    this.addExtraResource(
      'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.5.2/css/bootstrap-colorpicker.min.css'
    )
    this.addExtraResource(
      'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.5.2/js/bootstrap-colorpicker.min.js'
    )
    this.addFieldDescriptions({
      position: {
        view(req, entry, fieldName) {
          const pos = entry.position.split(',').reverse().join(','),
          smile = String.fromCodePoint(entry.smile)
          return `
          <div style="position: relative; display: inline-block;">
          <img src="https://static-maps.yandex.ru/1.x/?ll=${pos}&size=600,240&z=12&l=map&pt=${pos},org">
          <span style="position: absolute; top: 50%; left: 50%;
          font-size: 100px;
          margin-top: -75px;
          margin-left: -64px;
          border: ${entry.color} solid 8px;
          border-radius: 50%;
          color: ${entry.color}">${smile}</span>
          </div>`
        },
        html: true,
        widget: (req, entry, fieldName, value, options) => {
          return `
            <!-- hidden form field -->
            <input type=hidden name="${fieldName}" value=${value}></input>
            <div style='width: 100%; height: 240px; border: solid black 1px' id="${fieldName}_mapid"></div>
            <script>
              function ${fieldName}_map() {
                var coord = '${value}'.split(',')
                var map = new ymaps.Map("${fieldName}_mapid", {
                  center: coord, 
                  zoom: 12
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
      },
      color: {
        widget: (req, entry, fieldName, value, options) => {
          return `
          <div id="${fieldName}_pickerId" style="display: table" class="form-control">
            <input id="${fieldName}_inputId" name="${fieldName}" type="text" readonly=readonly
            class="form-control"></input>
          </div>
          <script>
          $(function () {
            var cp = $('#${fieldName}_pickerId').colorpicker({
              color: '${value}',
              inline: true,
              container: true
            });
            cp.colorpicker(${!!options.readOnly} ? 'hide':'show')
          });
          </script>
          `
        }
      },
      smile: {
        widget: (req, entry, fieldName, value, options) => {
          let ret = `
          <style>
          button.select-smile {
            font-size: 28pt;
          }
          button.select-smile[name] {
            background-color: yellow;
          }
          </style>
          <script>
          function toggleSmile(elem) {
            document.getElementsByName("${fieldName}")[0].value=elem.value
            $("button.select-smile").removeClass("btn-primary");
            $(elem).addClass("btn-primary")
          }
          </script>
          <input type=hidden name="${fieldName}" value=${value}></input>
          `
          const codes = [...Array(50).keys()].map(val => 128513 + val)
          ret += codes.map(code => {
            return `<button class='btn m-1 select-smile ${code == value ? 'btn-primary' :''}'
            type="button"
            onclick="toggleSmile(this)"
            ${options.readOnly ? 'disabled="disabled"' : ''}
            value='${code}'>&#${code};</button>`
          }).join('')
          return ret
        }
      }
    })
  }
}

module.exports = CustomViewAdmin
