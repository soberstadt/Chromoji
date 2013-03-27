function readCharDictionary(callback) {
  var request = new XMLHttpRequest();
  var path = "chardict.json"
  var url = chrome.extension.getURL(path);
  request.open('GET', url);
  request.onload = function(e) {
    var chars = JSON.parse(request.responseText);
    callback(chars);
  }
  request.send(null);
}

function get_replacement(image) {
  if(image.image == undefined) {
    image = {name:"", id:"", image: image}
  }
  var relative = "images/" + image.image;
  var absolute = chrome.extension.getURL(relative);
  var element = "<img src='" + absolute + "' class='emoji' title='"+image.name+"'>";
  return element;
}

function copyTextToClipboard(text) {
  var copyFrom = $('<textarea/>');
  copyFrom.text(text);
  $('body').append(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  copyFrom.remove();
}