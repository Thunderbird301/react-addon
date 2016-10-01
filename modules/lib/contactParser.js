function ContactParser() { };

ContactParser.createEmptyContactSections = function(contactSections) {
  var sections = [];
  for (var i = 0; i < contactSections.length; i++) {
      sections.push({
        name: contactSections[i].name,
        options: contactSections[i].options,
        fields: [],
        index: i
      });
  }
  return sections;
};

ContactParser.createEmptyPersonalSection = function() {
  return {name: "", nickname: "", displayName: "", birthday: ""};
};

ContactParser.getContactDetails = function(id, ab) {
  var self = this;
  var contactSections = this.createEmptyContactSections(ab.props.contactSections);
  var tempContactSections = this.createEmptyContactSections(ab.props.contactSections);
  var personalSection = this.createEmptyPersonalSection();
  var tempPersonalSection = this.createEmptyPersonalSection();

  Addressbook.open(indexedDB).then(function(addrbook) {
    addrbook.getById(id).then(function(contact) {
      // Gets contact details
      for (var j = 0; j <contact.jcards.length; j++) {
        var details = contact.jcards[j].getAllProperties();
        for (var i = 0; i < details.length; i++) {
          self._parseProperty(details[i], contactSections, tempContactSections, personalSection, tempPersonalSection, j, i);
        }
      }
      // Gets contact profile image
      var photoUrl = "images/1.jpg";
      if (contact.photo) {
        photoUrl = URL.createObjectURL(contact.photo);
      }
      // Stores contact information in UI
      ab.setState({
        contact: new Contact(contact.toJSON()),
        tempContact: new Contact(contact.toJSON()),
        contactSections: contactSections,
        tempContactSections: tempContactSections,
        personalSection: personalSection,
        tempPersonalSection: tempPersonalSection,
        photoUrl: photoUrl
      });
    });
  });
};

ContactParser.updateContact = function(contact) {
    Addressbook.open(indexedDB).then(function(addrbook) {
      addrbook.update(contact); // maybe check success here?
    });
}

ContactParser.prepareContactForUpdate = function(contact) {
  for (var j = 0; j <contact.jcards.length; j++) {
    var details = contact.jcards[j].getAllProperties();
    for (var i = 0; i < details.length; i++) {
      if(!details[i]) {
        details.splice(i, 1);
      }
    }
  }
};

ContactParser._parseProperty = function(property, cFields, tFields, pField, tpField, jCardIndex, jCardFieldIndex) {
  var name = property.jCal[0];
  var content = property.jCal[3];
  switch (name) {
    case "email":
      this._addFieldProperty(0, "Work", content, cFields, jCardIndex, jCardFieldIndex);
      this._addFieldProperty(0, "Work", content, tFields, jCardIndex, jCardFieldIndex);
      break;
    case "tel":
      this._addFieldProperty(1, "Work", content, cFields, jCardIndex, jCardFieldIndex);
      this._addFieldProperty(1, "Work", content, tFields, jCardIndex, jCardFieldIndex);
      break;
    case "adr":
      this._addFieldProperty(2, "", content, cFields, jCardIndex, jCardFieldIndex);
      this._addFieldProperty(2, "", content, tFields, jCardIndex, jCardFieldIndex);
      break;
    case "url":
      this._addFieldProperty(3, "Work", content, cFields, jCardIndex, jCardFieldIndex);
      this._addFieldProperty(3, "Work", content, tFields, jCardIndex, jCardFieldIndex);
      break;
    case "fn":
      pField.name = content;
      tpField.name = content;
      break;
    case "nn":
      pField.nickName = content;
      tpField.nickName = content;
      break;
    case "dn":
      pField.displayName = content;
      tpField.displayName = content;
      break;
    case "bday":
      pField.birthday = content;
      tpField.birthday = content;
      break;
    default:
      break;
  }
};

ContactParser._addFieldProperty = function(index, currentOption, content, fields, jCardIndex, jCardFieldIndex) {
  var fieldID = fields[index].fields.length;
  fields[index].fields.push({
    currentOption: currentOption,
    content: content,
    fieldID: fieldID,
    jCardIndex: jCardIndex,
    jCardFieldIndex: jCardFieldIndex
  });
};

ContactParser.removeContactDetail = function(tempContact, jCardIndex, jCardFieldIndex) {
  var details = tempContact.jcards[jCardIndex].getAllProperties();
  details[jCardFieldIndex] = null;
};
