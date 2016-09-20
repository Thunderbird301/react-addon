/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Cu = Components.utils;

Cu.import("resource://react/lib/ical.1.2.2.js");

const description = "IndexedDB based Addressbook";
const UUID = "{7FBFCC76-48B6-11E6-9353-C50CE7BF5E87}";
const contractID = "@maddrbook/Addressbook;1";

const DB_NAME = 'addrbook';
const CONTACTS_STORE_NAME = 'contacts';
const DB_VERSION = 2;

const DB_ERR_NOT_CONN = "Connection to the database has not been opened, make sure you called Addressbook.open()";

function Addressbook(idb) {
  // FIXME: passes in IndexedDB factory
  this.indexedDB = idb;
};

Addressbook.open = function(idb) {
  // FIXME: passes in IndexedDB factory
  return new Addressbook(idb).open();
}

Addressbook.prototype = {
  // properties required for XPCOM registration:
  classDescription: description,
  classID:          Components.ID(UUID),
  contractID:       contractID,

  open: function() {
    let addrbook = this;
    // FIXME: passes in IndexedDB factory
    let indexedDB = this.indexedDB;

    return new Promise(function(resolve, reject) {
      var request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onsuccess = function(event) {
        addrbook._onsuccess(event);
        resolve(addrbook);
      };

      request.onerror = function(event) {
        addrbook._onerror(event);
        reject(event.target.error);
      };

      request.onupgradeneeded = function(event) {
        addrbook._onupgradeneeded(event);
      };
    });
  },

  _onsuccess: function(event) {
    // FIXME: debug
    // console.log("Success");
    // console.log(event);

    this._db = event.target.result;

    if (this.onsuccess !== undefined) {
      this.onsuccess(event);
    }
  },
  _onerror: function(event) {
    // FIXME: debug
    // console.log("Error");
    // console.log(event);

    if (this.onerror !== undefined) {
      this.onerror(event);
    }
  },
  _onupgradeneeded: function(event) {
    // console.log("Upgrade Change");
    // console.log(event);
    var db = event.target.result;

    // setup our object stores
    var contactsStore = db.createObjectStore(CONTACTS_STORE_NAME,
        { keyPath: "uuid", autoIncrement: true });

    // set up our indexes
    contactsStore.createIndex("name", "name", { unique: false });

    // seed data
    contactsStore.add({name: "Simon Perreault", email: "simon.perreault@viagenie.ca" , jcards: [
      ["vcard", [
        ["version", {}, "text", "4.0"],
        ["fn", {}, "text", "Simon Perreault"],
        ["n", {}, "text", ["Perreault", "Simon", "", "", ["ing. jr", "M.Sc."]] ],
        ["bday", {}, "date-and-or-time", "--02-03"],
        ["anniversary", {}, "date-and-or-time", "2009-08-08T14:30:00-05:00" ],
        ["gender", {}, "text", "M"],
        ["lang", { "pref": "1" }, "language-tag", "fr"],
        ["lang", { "pref": "2" }, "language-tag", "en"],
        ["org", { "type": "work" }, "text", "Viagenie"],
        ["adr", { "type": "work" }, "text", [ "", "Suite D2-630", "2875 Laurier", "Quebec", "QC", "G1V 2M2", "Canada" ] ],
        ["tel", { "type": ["work", "voice"], "pref": "1" }, "uri", "tel:+1-418-656-9254;ext=102" ],
        ["tel", { "type": ["work", "cell", "voice", "video", "text"] }, "uri", "tel:+1-418-262-6501" ],
        ["email", { "type": "work" }, "text", "simon.perreault@viagenie.ca" ],
        ["geo", { "type": "work" }, "uri", "geo:46.772673,-71.282945"],
        ["key", { "type": "work" }, "uri", "http://www.viagenie.ca/simon.perreault/simon.asc" ],
        ["tz", {}, "utc-offset", "-05:00"],
        ["url", { "type": "home" }, "uri", "http://nomis80.org"]
      ]]
    ]});

    contactsStore.add({name: "Bob Perreault", email: "bob.perreault@viagenie.ca" , jcards: [
      ["vcard", [
        ["version", {}, "text", "4.0"],
        ["fn", {}, "text", "Simon Perreault"],
        ["n", {}, "text", ["Perreault", "Simon", "", "", ["ing. jr", "M.Sc."]] ],
        ["bday", {}, "date-and-or-time", "--02-03"],
        ["anniversary", {}, "date-and-or-time", "2009-08-08T14:30:00-05:00" ],
        ["gender", {}, "text", "M"],
        ["lang", { "pref": "1" }, "language-tag", "fr"],
        ["lang", { "pref": "2" }, "language-tag", "en"],
        ["org", { "type": "work" }, "text", "Viagenie"],
        ["adr", { "type": "work" }, "text", [ "", "Suite D2-630", "2875 Laurier", "Quebec", "QC", "G1V 2M2", "Canada" ] ],
        ["tel", { "type": ["work", "voice"], "pref": "1" }, "uri", "tel:+1-418-656-9254;ext=102" ],
        ["tel", { "type": ["work", "cell", "voice", "video", "text"] }, "uri", "tel:+1-418-262-6501" ],
        ["email", { "type": "work" }, "text", "simon.perreault@viagenie.ca" ],
        ["geo", { "type": "work" }, "uri", "geo:46.772673,-71.282945"],
        ["key", { "type": "work" }, "uri", "http://www.viagenie.ca/simon.perreault/simon.asc" ],
        ["tz", {}, "utc-offset", "-05:00"],
        ["url", { "type": "home" }, "uri", "http://nomis80.org"]
      ]]
    ]});
  },

  add: function(contactObj) {
    let ab = this;

    return this._contactRequest("readwrite", function(transaction) {
      contactObj = ab._convertFromICALComponent(contactObj);
      return transaction.add(contactObj);
    });
  },

  update: function(contactObj) {
    let ab = this;

    return this._contactRequest("readwrite",function(transaction) {
      contactObj = this._convertFromICALComponent(contactObj);
      return  transaction.put(contactObj);
    } );
  },

  getAll: function() {
    let ab = this;

    return this._contactRequest("readonly",
        function(transaction) {
          return  transaction.getAll();
        })
    .then(function(contacts) {
      return contacts.map(function(contact) {
        return ab._convertToICALComponent(contact);
      });
    });
  },

  getById: function(id) {
    let ab = this;

    return this._contactRequest("readonly",
        function(transaction) { return  transaction.get(id); } )
      .then(function(contact) { return ab._convertToICALComponent(contact);  } );
  },

  deleteById: function(id) {
    return this._contactRequest("readwrite",function(transaction) { return  transaction.delete(id); } );
  },

  getNameAndId: function() {

    let db = this._db;

    return new Promise(function(resolve, reject) {

      // check to see if db exists
      if (db === undefined) {
        reject(DB_ERR_NOT_CONN);
        return;
      }

      // setup transaction
      var transaction = db.transaction([CONTACTS_STORE_NAME], "readonly")
        .objectStore(CONTACTS_STORE_NAME)
        .index("name");

      // create request
      var request = transaction.openKeyCursor();

      // initalise results
      var results = [];

      // setup response functions
      request.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          results.push({ uuid: cursor.primaryKey, name: cursor.key });
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = function(event) {
        reject(event.target.error);
      };
    });
  },

  _convertToICALComponent: function(contactObj) {
    var result = contactObj;

    result.jcards = result.jcards.map(function(jcard) {
      return new ICAL.Component(jcard);
    });
    return result;
  },

  _convertFromICALComponent: function(contactObj) {
    var result = contactObj;

    result.jcards = result.jcards.map(function(jcard) {
      // check if the jcard is in the array format
      if (Array.isArray(jcard)) {
        // is presumably a in array jCard format
        // validate it by parsing it as a Component then convert it back into jCard
        return new ICAL.Component(jcard).toJSON();
      } else {
        // jcard is an ICAL.Component, so convert it to jCard
        return jcard.toJSON();
      }
    });
    return result;
  },

  _contactRequest: function(access, requestFn) {

    let db = this._db;

    return new Promise(function(resolve, reject) {

      // check to see if db exists
      if (db === undefined) {
        reject(DB_ERR_NOT_CONN);
        return;
      }

      // setup transaction
      var transaction = db.transaction([CONTACTS_STORE_NAME], access)
        .objectStore(CONTACTS_STORE_NAME);

      // create request
      var request = requestFn(transaction);

      // setup response functions
      request.onerror = function(event) {
        reject(event.target.error);
      };
      request.onsuccess = function(event) {
        resolve(event.target.result);
      };
    });
  }

};

// vim: set sw=2 ts=2 expandtab ft=javascript:
