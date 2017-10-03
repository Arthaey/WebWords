# WebWords

[![Build Status](https://travis-ci.org/Arthaey/WebWords.svg?branch=master)](https://travis-ci.org/Arthaey/WebWords)
[![Coverage Status](https://coveralls.io/repos/github/Arthaey/WebWords/badge.svg?branch=master)](https://coveralls.io/github/Arthaey/WebWords?branch=master)
[![Code Climate](https://codeclimate.com/github/Arthaey/WebWords.png)](https://codeclimate.com/github/Arthaey/WebWords)

WebWords is currently under active development, but it's not really ready for users yet.
But if you like living on the bleeding, unsupported edge ;) then you're welcome to try it.

## Usage

### Fieldbook

Create a [Fieldbook](https://fieldbook.com) account and create a book with one sheet
per language code (eg, "ES" or "FR"). Each sheet should have two columns:
"Word" and "How Well Known".

Then, open the sidebar and go to the API section to generate your key and secret.

For now, you have to set 3 values in localStorage for each domain you want to run WebWords on:

```
localStorage.setItem("WebWords-FieldbookBook", "<book id>");
localStorage.setItem("WebWords-FieldbookKey", "<book key>");
localStorage.setItem("WebWords-FieldbookSecret", "<book secret>");
```

This is a pain, but that's how alpha software is. :)

### Bookmarklet

```
javascript:function loadScript(url,callback){var head=document.getElementsByTagName("head")[0];var script=document.createElement("script");script.src=url;script.onload=callback;head.appendChild(script)};loadScript("https://www.arthaey.com/tech/programming/webwords/src.js",function(){localStorage.setItem("WebWords-FieldbookBook","<book-id>");localStorage.setItem("WebWords-FieldbookKey","key>");localStorage.setItem("WebWords-FieldbookSecret","<secret>");WebWords.init(document.body)})
```

### Greasemonkey / Tampermonkey user script

```
// ==UserScript==
// @name         WebWords
// @namespace    http://arthaey.com
// @version      0.1.0
// @description  https://github.com/Arthaey/WebWords
// @author       Arthaey Angosii <arthaey@gmail.com>
// @match        http://*/*
// @match        https://*/*
// @require      http://www.arthaey.com/tech/programming/webwords/src.js
// ==/UserScript==

(function() {
  WebWords.init(document.body);
})();
```

Note that this will <strong>not</strong> auto-update. Sorry. Alpha software, etc etc.


## Tests

From the command-line: `grunt test`

From the browser: open `spec/SpecRunner.html`

To see Javascript errors/warnings: `eslint src spec`

To validate Travis config:

```
gem install travis --no-rdoc --no-ri
travis list .travis.yml
```

If the Github status badges are stale, run `camo-purge` and force-reload.


## Development

For local development, change the user script's `@require` to point to
`file:///<repo-dir>/dist/src.js` . It will then update after each `grunt build`.

To upload a new version for the bookmarklet to use:

`grunt release --release-username=<username> --release-password=$WEBWORDS_RELEASE_PASSWORD`
