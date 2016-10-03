const Cc = Components.classes;
const Ci = Components.interfaces;

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
    filePicker.appendFilters(filePickerInterface.filterAll | filePickerInterface.filterText);
    filePicker.filterIndex = 1;

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
  }
}
