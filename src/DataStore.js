'use strict';

const DataStore = function(baseUrl) {
  if (this.constructor === DataStore) {
    throw new Error("DataStore cannot be instantiated; create a subclass instead.");
  }
  if (!this.getAuthToken) {
    throw new Error("Subclasses of DataStore must implement all required methods.");
  }

  this.baseUrl = baseUrl;
};

// METHODS THAT SUBCLASSES *MUST* IMPLEMENT:
DataStore.prototype.getAuthToken = null;

// METHODS THAT SUBCLASSES *MAY* IMPLEMENT:
DataStore.prototype.getUrl = function(path) {
  return `${this.baseUrl}/${path}`;
};

DataStore.prototype.getRecords = function(langCode) {
  const url = this.getUrl(langCode);
  return this.promisifyRequest("GET", url);
};

DataStore.prototype.createRecord = function(langCode, word) {
  const url = this.getUrl(langCode);
  const record = JSON.stringify({word: word.text, how_well_known: "known"});
  const promise = this.promisifyRequest("POST", url, record);

  return promise.then(function(records) {
    if (records && records.length >= 1) {
      word.learningStatus = records[0].how_well_known;
      word.dataStoreId = records[0].id;
    }
    return records;
  });
};

DataStore.prototype.updateRecord = function(langCode, word) {
  const url = this.getUrl(langCode) + "/" + word.dataStoreId;
  const record = JSON.stringify({how_well_known: word.learningStatus});
  return this.promisifyRequest("PATCH", url, record);
};

DataStore.prototype.makeRequest = function(method, url, body, authToken, resolve, reject) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url); /* eslint security/detect-non-literal-fs-filename: "off" */
  xhr.setRequestHeader("Accept", "application/json");
  if (method === "POST") {
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  xhr.setRequestHeader("Authorization", "Basic " + authToken);
  xhr.onload = () => resolve(xhr.responseText);
  xhr.onerror = (progressEvent) => reject(progressEvent.target);
  xhr.send(body);
  return xhr;
};

DataStore.prototype.promisifyRequest = function(method, url, body) {
  const authToken = this.getAuthToken();
  if (!authToken) {
    return Promise.reject("ERROR: missing auth token");
  }

  return new Promise((resolve, reject) => {
    return this.makeRequest(method, url, body, authToken, resolve, reject);
  })
  .then(function(responseText) {
    return JSON.parse(responseText);
  })
  .catch(function(response) {
    let errorMsg = `ERROR with ${url}`;
    const status = response.statusText || response.status;
    if (status ) errorMsg += `: '${status}'`;
    console.error(errorMsg);
    console.error(response);
    return [];
  });
};

module.exports = DataStore;
