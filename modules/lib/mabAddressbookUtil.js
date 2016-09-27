const Cc = Components.classes;
const Ci = Components.interfaces;

const EXPORTED_SYMBOLS = ['AddressbookUtil'];

function ohplz() {
  return AddressbookUtil;
}

var AddressbookUtil = {

  exportContact: function(contact) {

    var ifp = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(ifp);
    var wm = Cc["@mozilla.org/appshell/window-mediator;1"].
      getService(Ci.nsIWindowMediator);
    var window = wm.getMostRecentWindow(null);

    fp.init(window, "Save contact to", ifp.modeSave);
    fp.appendFilters(ifp.filterAll | ifp.filterText);
    fp.filterIndex = 1;
    fp.defaultString = contact.name + ".vcf";

    try{

      var rv = fp.show();

      if (rv == ifp.returnOK || rv == ifp.returnReplace) {

        var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
          .createInstance(Components.interfaces.nsIFileOutputStream);

        foStream.init(fp.file, 0x02 | 0x08 | 0x20, 0666, 0); // write, create, truncate

        // iterate through the jCards (assuming they are in Component form)
        contact.jcards.map(function(jcard) {
          var vcard = jcard.toString();

          foStream.write(vcard, vcard.length);
        });

        foStream.close();
      }
    } catch(err) {
      alert(err.toString()); 
    }
  }
}
