/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Cc = Components.classes;
const Ci = Components.interfaces;

Components.utils.import("resource://gre/modules/NetUtil.jsm");

const EXPORTED_SYMBOLS = ['AddressbookUtil'];

var AddressbookUtil = {

  /**
   * exports contacts to a file choosen by the user.
   * Shows a file picker to the user to choose where the file is exported to.
   *
   * @param {Contact|Contact[]} the contact(s) to export to the
   */
  exportContact: function(contacts) {

    var filePickerInterface = Components.interfaces.nsIFilePicker;
    var filePicker = Components.classes["@mozilla.org/filepicker;1"].createInstance(filePickerInterface);
    var windowMediator = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
    var window = windowMediator.getMostRecentWindow(null);

    filePicker.init(window, "Save contacts to", filePickerInterface.modeSave);
    filePicker.appendFilter("vCard", "*.vcf; *.vcard");
    filePicker.appendFilters(filePickerInterface.filterAll);
    filePicker.filterIndex = 0;

    // check if the contacts to export is an array or a single contact
    if (Array.isArray(contacts)) {
      filePicker.defaultString = "contacts.vcf";
    } else {
      filePicker.defaultString = contacts.name + ".vcf";
      contacts = [contacts];
    }

    var returnValue = filePicker.show();

    if (returnValue == filePickerInterface.returnOK || returnValue == filePickerInterface.returnReplace) {

      var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
        .createInstance(Components.interfaces.nsIFileOutputStream);

      foStream.init(filePicker.file, 0x02 | 0x08 | 0x20, 0666, 0); // write, create, truncate


      // iterate through all the contacts to be exported
      contacts.forEach(function(contact) {
        // iterate through the jCards (assuming they are in Component form)
        contact.jcards.map(function(jcard) {
          var vcard = jcard.toString();

          // write vcard to file
          foStream.write(vcard, vcard.length);

          // insert a new line between contacts
          foStream.write("\r\n\r\n", 4);
        });
      });

      foStream.close();
    }
  },

  /**
   * Ask the user to point to a vCard and import the contacts into the database
   *
   * @param {Addressbook} Addressbook to add the imported contacts to
   * @returns {Promise[]} Array of promises for adding the new contacts
   */
  importContacts: function(addressbook) {

    var filePickerInterface = Components.interfaces.nsIFilePicker;
    var filePicker = Components.classes["@mozilla.org/filepicker;1"].createInstance(filePickerInterface);
    var windowMediator = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
    var window = windowMediator.getMostRecentWindow(null);

    filePicker.init(window, "Load contacts from", filePickerInterface.modeOpen);
    filePicker.appendFilter("vCard", "*.vcf; *.vcard");
    filePicker.appendFilters(filePickerInterface.filterAll);
    filePicker.filterIndex = 0;
    filePicker.defaultString = "contacts.vcf";

    var returnValue = filePicker.show();

    if (returnValue == filePickerInterface.returnOK) {

      var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"]
        .createInstance(Components.interfaces.nsIFileInputStream);

      inputStream.init(filePicker.file, 0x01, 0444, 0); // readonly

      var fileContents = NetUtil.readInputStreamToString(
          inputStream,
          inputStream.available(),
          {});

      inputStream.close();

      var contacts = ICAL.parse(fileContents);
      // detect error from parsing
      if (!contacts) {
        throw "Invalid vCard";
      }

      // check if it is an array of vcards or a single vcard
      if (contacts[0] == 'vcard') {
        // make a single contact a list to work with the next section
        contacts = [contacts];
      }

      // convert jcards into Contact objects
      var contactPromises = contacts.map(function(vcard) {
        var contact =  new ICAL.Component(vcard);

        // try to get the name of the contact
        var name = contact.getFirstPropertyValue("fn");
        // fall back to the 'n' for a name
        if (!name) {
          name = contact.getFirstPropertyValue("n");
          name = Array.isArray(name) ? name.join(" ").trim() : name;
        }
        // fall back to email for a name
        if (!name) {
          name = contact.getFirstPropertyValue("email");
        }

        // get the photo
        var photo = undefined;
        var photoProperty = contact.getFirstProperty("photo");

        if (photoProperty) {
          if (photoProperty.type === "binary") {
            var imageType = "image/" + photoProperty.getParameter("type").toLowerCase();
            photo = AddressbookUtil.b64toBlob(photoProperty.getValues(), imageType);
          }
        }

        return {
          name: name.trim(),
          jcards: [vcard],
          photo: photo
        };

      // do another map of the contacts in a sperate loop so
      // if a single contact fails none of the contacts will be
      // be inserted into the database
      }).map(function(contact) {
        // TODO: check if it already exists and add it?

        // add the contact to the addressbook
        addressbook.add(contact);
      });

      return contactPromises;
    }
  },

  b64toBlob: function(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);
      
      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
}
