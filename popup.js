function showEmojies() {
  // charDictionary.items[30].image
  readCharDictionary(function (chars) {
      charDictionary = chars
      items = chars.items;
      for(var key in items) {
        var item = items[key]
        var elem = $(get_replacement(item))
        elem.attr('width', 20)
        elem.attr('height', 20)
        elem.attr('id', key)
        elem.click(emojiClick)
        $('#emojies').append(elem)
      }
    }
  )
}

function emojiClick(event) {
  var i = $(event.target).attr('id')
  copyTextToClipboard(charDictionary.items[i].chars[0]);
  $('#message').text("Copied");
}

var charDictionary;
var items;
var valid;
var pattern;
var regexp;
var ioscompat;
var hidden;

$(document).ready(
    function () {
        showEmojies();
    }
);