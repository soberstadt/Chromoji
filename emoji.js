﻿jQuery.fn.just_text = function() {
    return $(this).clone()
        .children()
        .remove()
        .end()
        .text();
}

function filter_nodes(nodes, regexp) {
    return $(nodes).find('[contenteditable!="true"][contenteditable!="plaintext-only"]').filter(
        function(index) {
			var result = false;
			var text = $(this).just_text();
            var found = (text.search(regexp) != -1)
			if(found) {
				var index = $(this).html().indexOf("document.write");
				result = (index == -1);
			}
            return result;
		}
    );
}

function on_mutation(mutations) {
    for(var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        var added = mutation.addedNodes;
        
        if(added.length > 0) {
            var nodes = filter_nodes(added, regexp);
            run(nodes);
        }
    }
}

function run(nodes) {
    $.each(nodes,
        function() {
            $(this).html($(this).html().replace(regexp,
                function(c) {
                    var matched = valid.filter(
                        function(element, index, array) {
                            if(element.chars.indexOf(c) != -1) {
                                return element.image;
                            }
                        }
                    );
                    
                    if(matched.length > 0) {
                        var image = matched[0].image
                        return get_replacement(image);
                    }
                    
                    return c;
                }
            ));
        }
    );
}

function start_observer() {
    var target = document.body;
    var config = { childList: true, characterData: true, subtree: true };
    var observer = new WebKitMutationObserver(on_mutation);
    observer.observe(target, config);
}

function create_pattern(items) {
    pattern = "";
    items.forEach(
        function (element, index, array) {
            var chars = element.chars;
            chars.forEach(
                function (element, index, array) {
                    if(hidden.indexOf(element) == -1) {
                        pattern += (element + "|");
                    }
                }
            );
        }
    );

    if (pattern != "") {
        pattern = pattern.substr(0, pattern.length - 1);
    }
}

function init() {
    chrome.extension.sendMessage({setting: "ioscompat"},
        function (response) {
            ioscompat = (response.result == "true");
            readCharDictionary(
                function (chars) {
                    charDictionary = chars
                    items = chars.items;
                    if(ioscompat) {
                        hidden = chars.ioshidden;
                    } else {
                        hidden = [];
                    }

                    // Don't render OS X font chars on OS X
                    if(window.navigator.appVersion.indexOf("Mac") != -1) {
                        hidden = hidden.concat(chars.machidden);
                    }

                    valid = items.filter(
                        function (element, index, array) {
                            return (element.image != "");
                        }
                    );

                    create_pattern(valid);
                    regexp = new RegExp(pattern, 'g');
                    var nodes = filter_nodes($('body'), regexp);
                    run(nodes);
                    start_observer();
                }
            );
        }
    );
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
        init();
    }
);
