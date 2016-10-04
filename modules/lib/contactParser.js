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

ContactParser._getPhotoURL = function(photo) {
  if (photo) {
      return URL.createObjectURL(photo)
  }
  return "images/1.jpg";
}

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
      var photoUrl = self._getPhotoURL(contact.photo);
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

ContactParser.updateContact = function(contact, ab) {
  var self = this;
    Addressbook.open(indexedDB).then(function(addrbook) {
      addrbook.update(contact).then(function(id) {
        ab.setState({photoUrl: self._getPhotoURL(contact.photo)});
      }); // maybe check success here?
    });
}

ContactParser._parseProperty = function(property, cFields, tFields, pField, tpField, jCardIndex) {
  var name = property.name;
  var type = property.getParameter("type");
  var content = property.getFirstValue();
  if (Array.isArray(type)) {
    type = type[0];
  }
  if (type) {
    type = type.charAt(0).toUpperCase() + type.slice(1);
  }

  switch (name) {
    case "email":
      this._addFieldProperty(0, type, content, cFields, jCardIndex, property);
      this._addFieldProperty(0, type, content, tFields, jCardIndex, property);
      break;
    case "tel":
      this._addFieldProperty(1, type, content, cFields, jCardIndex, property);
      this._addFieldProperty(1, type, content, tFields, jCardIndex, property);
      break
    case "adr":
      this._addFieldProperty(2, type, content, cFields, jCardIndex, property);
      this._addFieldProperty(2, type, content, tFields, jCardIndex, property);
      break;
    case "url":
      this._addFieldProperty(3, type, content, cFields, jCardIndex, property);
      this._addFieldProperty(3, type, content, tFields, jCardIndex, property);
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
      pField.birthday = content.toString();
      tpField.birthday = content.toJSDate().toISOString();
      break;
    default:
      break;
  }
};

ContactParser._addFieldProperty = function(index, currentOption, content, fields, jCardIndex, property) {
  var fieldID = fields[index].fields.length;
  fields[index].fields.push({
    currentOption: currentOption,
    content: content,
    fieldID: fieldID,
    property: property,
    jCardIndex: jCardIndex,
  });
};

ContactParser.removeContactDetail = function(tempContact, jCardIndex, property) {
  tempContact.jcards[jCardIndex].removeProperty(property);
};

ContactParser.addContactDetail = function(tempContact, name, content, jCardIndex) {
  return tempContact[jCardIndex].addProperyWithValue(name, content);
};
