'use strict';

const Fieldbook = function() {
};

Fieldbook.getUrl = function(langCode) {
  const fieldbookBook = localStorage.getItem(WebWords.fieldbookBookId);
  return `${WebWords.fieldbookBaseUrl}/${fieldbookBook}/${langCode}`;
};

Fieldbook.getAuthToken = function() {
  const fieldbookBook = localStorage.getItem(WebWords.fieldbookBookId);
  const fieldbookKey = localStorage.getItem(WebWords.fieldbookKeyId);
  const fieldbookSecret = localStorage.getItem(WebWords.fieldbookSecretId);

  if (fieldbookBook && fieldbookKey && fieldbookSecret) {
    return btoa(`${fieldbookKey}:${fieldbookSecret}`);
  }
  return null;
};

Fieldbook.getRecords = function(langCode) {
  const url = Fieldbook.getUrl(langCode);
  return Fieldbook._promisifyRequest("GET", url);
}

Fieldbook.createRecord = function(langCode, word) {
  const url = Fieldbook.getUrl(langCode);
  const record = JSON.stringify({word: word.text, how_well_known: "known"});
  const promise = Fieldbook._promisifyRequest("POST", url, record);

  return promise.then(function(records) {
    if (records && records.length >= 1) {
      word.learningStatus = records[0].how_well_known;
      word.fieldbookId = records[0].id;
    }
    return records;
  });
};

Fieldbook.updateRecord = function(langCode, word) {
  const url = Fieldbook.getUrl(langCode) + "/" + word.fieldbookId;
  const record = JSON.stringify({how_well_known: word.learningStatus});
  return Fieldbook._promisifyRequest("PATCH", url, record);
};

Fieldbook._makeRequest = function(method, url, body, authToken, resolve, reject) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");
  if (method === "POST") {
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  xhr.setRequestHeader("Authorization", "Basic " + authToken);
  xhr.onload = () => resolve(xhr.responseText);
  xhr.onerror = (progressEvent) => reject(progressEvent, xhr.statusText);
  xhr.send(body);
  return xhr;
};

Fieldbook._promisifyRequest = function(method, url, body) {
  const authToken = Fieldbook.getAuthToken();
  if (!authToken) {
    return Promise.reject("ERROR: missing Fieldbook book ID, key, or secret");
  }

  return new Promise((resolve, reject) => {
    return Fieldbook._makeRequest(method, url, body, authToken, resolve, reject);
  })
  .then(function(responseText) {
    return JSON.parse(responseText);
  })
  .catch(function(progressEvent, statusText) {
    let errorMsg = `ERROR with ${url}`;
    if (statusText) errorMsg += `: '${statusText}'`;
    console.error(errorMsg);
    console.error(progressEvent);
    return [];
  });
};
