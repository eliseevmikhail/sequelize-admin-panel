function browserLocale() {
  var lang

  if (navigator.languages && navigator.languages.length) {
    // latest versions of Chrome and Firefox set this correctly
    lang = navigator.languages[0]
  }
  else if (navigator.userLanguage) {
    // IE only
    lang = navigator.userLanguage
  }
  else {
    // latest versions of Chrome, Firefox, and Safari set this correctly
    lang = navigator.language
  }
  return lang
}

function togglePassword(selector) {
  var elem = document.querySelector(selector);
  var type = elem.getAttribute('type') === 'password' ? 'text' : 'password';
  elem.setAttribute('type', type);
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

$(function () {
  $('td.button-cell')
  .on('click', function () {
    if ($(this)
      .data('href')) window.location = $(this)
    .data('href')
  })

  // table-responsive crops dropdown
  $('.table-responsive')
  .on('show.bs.dropdown', function () {
    $('.table-responsive')
    .css('overflow', 'inherit')
  })

  $('.table-responsive')
  .on('hide.bs.dropdown', function () {
    $('.table-responsive')
    .css('overflow', 'auto')
  })
})
