beforeEach(function() {

  jasmine.addMatchers({

    toBeEmpty: function() {
      return {
        compare: function(actualElement) {
          return {
            pass: actualElement.length == 0
          };
        }
      };
    },

    toHaveText: function() {
      return {
        compare: function(actualElement, expectedText) {
          return {
            pass: actualElement.innerText === expectedText
          };
        }
      };
    }

  });

  window.dom = (function() {
    var elements = [];

    return {
      createElement: function(tag, attrs, ...content) {
        var element = document.createElement(tag);

        for (var attr in attrs) {
          element[attr] = attrs[attr];
        }

        if (content.length == 1 && "string" === typeof content[0]) {
          element.innerText = content[0];
        } else {
          for (var i = 0; i < content.length; i++) {
            element.appendChild(content[i]);
          }
        }

        document.body.insertBefore(element, null);
        elements.push(element);

        return element;
      },

      cleanup: function() {
        for (var i in elements) {
          var element = elements[i];
          element.parentNode.removeChild(element);
          elements.pop(element);
        }
      }
    };
  })();
});
