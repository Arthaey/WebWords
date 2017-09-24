const FIELDBOOK_URL = "https://api.fieldbook.com/v1/sheetId/";

beforeEach(function() {
  const wordEqualityTester = function(first, second) {
    if (first instanceof Word && second instanceof Word) {
      return first.text === second.text &&
             first.learningStatus === second.learningStatus &&
             first.occurrences.length === second.occurrences.length &&
             first.occurrences.every(function(el, i) {
               return Word.normalizeText(el) === Word.normalizeText(second.occurrences[i])
             })
             ;
    }
  };

  WebWords.init();
  WebWords.fieldbookUrl = FIELDBOOK_URL;
  jasmine.addCustomEqualityTester(wordEqualityTester);

  Word.forgetAll();

  const stylesheet = document.getElementById(WebWords.stylesheetId);
  if (stylesheet && stylesheet.parentNode) {
    stylesheet.parentNode.removeChild(stylesheet);
  }

  jasmine.Ajax.install();

  jasmine.addMatchers({

    toBeEmpty: function() {
      return {
        compare: function(actualElement) {
          return {
            pass: actualElement.length === 0
          };
        }
      };
    },

    toHaveText: function() {
      return {
        compare: function(actualElement, expectedText) {
          return {
            pass: actualElement.innerText.includes(expectedText),
            message: `Expected '${expectedText}' but was '${actualElement.innerText}'`
          };
        }
      };
    },

    toHaveClass: function() {
      return {
        compare: function(actualElement, expectedClass) {
          return {
            pass: actualElement.classList.contains(expectedClass)
          };
        }
      };
    },

    toHaveStyle: function() {
      return {
        compare: function(actualElement, attribute, expectedValue) {
          const styles = window.getComputedStyle(actualElement);
          const actualValue = styles.getPropertyValue(attribute) ;
          return {
            pass: actualValue === expectedValue,
            message: `Expected ${attribute} = '${expectedValue}' but was '${actualValue}'`
          };
        }
      };
    }

  });
});

afterEach(function() {
  jasmine.Ajax.uninstall();
  dom.cleanup();
});

const dom = (function() {
  const elements = [];

  return {
    createElement: function(tag, attrs, ...content) {
      const element = document.createElement(tag);

      for (let attr in attrs) {
        element[attr] = attrs[attr];
      }

      if (content.length === 1 && "string" === typeof content[0]) {
        element.innerText = content[0];
      } else {
        for (let i = 0; i < content.length; i++) {
          element.appendChild(content[i]);
        }
      }

      document.body.insertBefore(element, null);
      elements.push(element);

      return element;
    },

    cleanup: function() {
      for (let i in elements) {
        const element = elements[i];
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
        elements.pop(element);
      }
    }
  };
}());

const mockAjaxRequest = function(expectedUrl, expectedResponse) {
    const request = jasmine.Ajax.requests.mostRecent();

    request.respondWith({
      status: 200,
      responseText: expectedResponse,
    });

    expect(request.url).toEqual(expectedUrl);
    expect(request.method).toEqual("GET");
    expect(request.responseText).toEqual(expectedResponse);
};
