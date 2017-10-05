# WebWords

[![Build Status](https://travis-ci.org/Arthaey/WebWords.svg?branch=master)](https://travis-ci.org/Arthaey/WebWords)
[![Coverage Status](https://coveralls.io/repos/github/Arthaey/WebWords/badge.svg?branch=master)](https://coveralls.io/github/Arthaey/WebWords?branch=master)
[![Code Climate](https://codeclimate.com/github/Arthaey/WebWords.png)](https://codeclimate.com/github/Arthaey/WebWords)
[![Bugs](https://img.shields.io/github/issues/Arthaey/WebWords/bug.svg)](https://github.com/Arthaey/WebWords/issues?q=is:open+is:issue+label:bug)

WebWords is currently under active development, but it's not really ready for users yet.
But if you like living on the bleeding, unsupported edge ;) then you're welcome to try it.


## Screenshots

<div>
  <img alt="Initial button after running bookmarklet"
       src="../assets/screenshots/MarkUpWords.jpg?raw=true"
       height="400" style="margin-right: 20px;" />
  <img alt="Highlights all unknown words"
       src="../assets/screenshots/LoadedWords.jpg?raw=true"
       height="400" style="margin-right: 20px;" />
  <img alt="After clicking words to mark them as known"
       src="../assets/screenshots/MarkedAsKnown.jpg?raw=true"
       height="400" />
</div>


## Usage

1. Create a **[Fieldbook](#fieldbook)** account and sheet to store your known words.

1. **Set up WebWords** as either a [bookmarklet](#bookmarklet) or a [user script](#userscript).

1. **Go to some web page** in the foreign language you're learning.

1. **Run WebWords**, depending on how you set it up:
     - if you're using it as a **user script**, WebWords will run **automatically**
     - if you're using it as a **bookmarklet**, **click** the bookmarklet

1. A gray **info box** with a blue button will appear in the upper right corner of the page.
   
   Before you've clicked the blue button to "mark up words", the web page won't look any different.

1. **Click the "mark up words" button**.

   WebWords will download all your known words from your Fieldbook sheet.
   Known words won't change, except that if you hover\* over them, they now have a green underline.
   **Unknown words will be highlighted in yellow**. (Unknown words that also happen to be links will
   be yellow with a blue underline.)
   
   The info box in upper right corner shows **statistics** about how many words are on the page vs
   how many you know. The background color of the info box will gradually change from red to yellow
   to green as you mark more words as known.

\* or tap, on mobile


## Setup

Due to limitations imposed by Apple, a bookmarklet is the only way to run WebWords with
the built-in Safari browser on an iPhone or iPad. Other platforms can chose whether to
use WebWords as a bookmarklet or as a user script.


### Fieldbook

Create a [Fieldbook](https://fieldbook.com) account and create a book with one sheet
per language code (eg, "ES" or "FR"). Each sheet should have two columns:
"Word" and "How Well Known".

Then, open the sidebar and go to the API section to generate your key and secret.
You will need these, plus your book's ID, to fill in the bookmarklet or user script below.


### Bookmarklet

```
javascript:function loadScript(url,callback){var head=document.getElementsByTagName("head")[0];var script=document.createElement("script");script.src=url;script.onload=callback;head.appendChild(script)};loadScript("https://www.arthaey.com/tech/programming/webwords/src.js",function(){localStorage.setItem("WebWords-FieldbookBook","<BOOK-ID>");localStorage.setItem("WebWords-FieldbookKey","<KEY>");localStorage.setItem("WebWords-FieldbookSecret","<SECRET>");WebWords.init(document.body)})
```


<a name="userscript"></a>
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

localStorage.setItem("WebWords-FieldbookBook", "<BOOK-ID>");
localStorage.setItem("WebWords-FieldbookKey", "<KEY>");
localStorage.setItem("WebWords-FieldbookSecret", "<SECRET>");
WebWords.init(document.body);
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
