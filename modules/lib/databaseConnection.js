/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function DatabaseConnection() { };

DatabaseConnection.getContactDetails = function(id, ab) {
  var contactSections = ContactParser.createEmptyContactSections(ab.props.contactSections);
  var tempContactSections = ContactParser.createEmptyContactSections(ab.props.contactSections);
  var personalSection = ContactParser.createEmptyPersonalSection(ab.props.personalDetails);
  var tempPersonalSection = ContactParser.createEmptyPersonalSection(ab.props.personalDetails);

  Addressbook.open(indexedDB).then(function(addrbook) {
    addrbook.getById(id).then(function(contact) {
        var con = new Contact(contact.toJSON())
        var tempContact = new Contact(contact.toJSON())
      // Gets contact details
      for (var j = 0; j <contact.jcards.length; j++) {
        var details = contact.jcards[j].getAllProperties();
        var cProps = con.jcards[j].getAllProperties();
        var tProps = tempContact.jcards[j].getAllProperties();
        for (var i = 0; i < details.length; i++) {
          ContactParser._parseProperty(details[i], cProps[i], tProps[i], contactSections, tempContactSections, personalSection, tempPersonalSection, j);
        }
      }
      // Gets contact profile image
      var photoUrl = Images.getPhotoURL(contact.photo);
      // Stores contact information in UI
      ab.setState({
        contact: con,
        tempContact: tempContact,
        contactSections: contactSections,
        tempContactSections: tempContactSections,
        personalSection: personalSection,
        tempPersonalSection: tempPersonalSection,
        photoUrl: photoUrl
      });
    });
  });
};

DatabaseConnection.updateContact = function(contact, ab) {
  Addressbook.open(indexedDB).then(function(addrbook) {
    addrbook.update(contact).then(function(id) {
      ab.setState({photoUrl: Images.getPhotoURL(contact.photo)});
    }); // maybe check success here?
  });
}

DatabaseConnection.loadInContacts = function(ab) {
  Addressbook.open(indexedDB).then(function(addrbook) {
    addrbook.getAllNameIdAndPhoto().then((contacts) => {
      var contactsList = [];
      for(var i = 0; i < contacts.length; i++) {
        contactsList.push({name: contacts[i].name, id: contacts[i].id, photo: contacts[i].photo});
      }
      contactsList.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase());
      ab.setState({contactsList: contactsList});
    });
  });
}

DatabaseConnection.export = function(selectedIds) {
  if (selectedIds.length > 0) {
    Addressbook.open(indexedDB).then(function(addrbook) {
      Promise.all(selectedIds.map((id) => addrbook.getById(id))).then(function(contacts) {
        AddressbookUtil.exportContact(contacts);
      })
    });
  }
}

DatabaseConnection.deleteContact = function(selectedIds, ab) {
  Addressbook.open(indexedDB).then(function(addrbook) {
    var idToDelete = selectedIds[0];
    addrbook.deleteById(idToDelete).then((contact) => {
      // deletes from sidebar
      var conList = ContactParser.deleteContact(ab.state.contactsList, idToDelete);
      ab.setState({
        selectedIds: [],
        contactsList: conList
      });
    });
  });
}