'use strict';

const Fieldbook = function() {
};

Fieldbook.getUrl = function(langCode) {
  return WebWords.fieldbookUrl + langCode;
};

Fieldbook.getAuthToken = function() {
  const fieldbookKey = localStorage.getItem(WebWords.fieldbookKeyId);
  const fieldbookSecret = localStorage.getItem(WebWords.fieldbookSecretId);

  if (fieldbookKey && fieldbookSecret) {
    return btoa(`${fieldbookKey}:${fieldbookSecret}`);
  }
  return null;
};

Fieldbook.makeRequest = function(method, url, body, authToken, resolve, reject) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");
  if (method == "POST") {
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  xhr.setRequestHeader("Authorization", "Basic " + authToken);
  xhr.onload = () => resolve(xhr.responseText);
  xhr.onerror = (progressEvent) => reject(progressEvent, xhr.statusText);
  xhr.send(body);
  return xhr;
};

Fieldbook.promisifyRequest = function(method, url, body) {
  const authToken = Fieldbook.getAuthToken();
  if (!authToken) {
    return Promise.reject("ERROR: missing Fieldbook key and/or secret");
  }

  const promise = new Promise((resolve, reject) => {
    Fieldbook.makeRequest(method, url, body, authToken, resolve, reject);
  });

  promise.catch(function(progressEvent, statusText) {
    console.error(`ERROR with ${url}: '${statusText}'`);
    console.error(progressEvent);
  });

  return promise;
};

Fieldbook.loadSavedData = function(langCode) {
  const url = Fieldbook.getUrl(langCode);
  return Fieldbook.promisifyRequest("GET", url);
}

Fieldbook.createRecord = function(langCode, word) {
  const url = Fieldbook.getUrl(langCode);
  const record = JSON.stringify({word: word.text, how_well_known: "known"});
  const promise = Fieldbook.promisifyRequest("POST", url, record);

  promise.then(function(records) {
    word.fieldbookId = records[0].id;
  });

  return promise;
};

Fieldbook.updateData = function(langCode, wordId) {
  const url = Fieldbook.getUrl(langCode) + "/" + wordId;
  const record = JSON.stringify({how_well_known: "known"});
  return Fieldbook.promisifyRequest("PATCH", url, record);
};
