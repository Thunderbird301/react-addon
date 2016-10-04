function ContactParser() { };

ContactParser.createEmptyContactSections = function(contactSections) {
  var sections = [];
  for (var i = 0; i < contactSections.length; i++) {
      sections.push({
        name: contactSections[i].name,
        options: contactSections[i].options,
        fields: [],
        index: i,
        key: contactSections[i].key
      });
  }
  return sections;
};

ContactParser.createEmptyPersonalSection = function(details) {
  var pDetails = {};
  for(var i = 0; i < details.length; i++) {
    pDetails[details[i]] = {content: "", property: null, jCardIndex: null};
  }
  return pDetails;
};

ContactParser.getContactDetails = function(id, ab) {
  var self = this;
  var contactSections = this.createEmptyContactSections(ab.props.contactSections);
  var tempContactSections = this.createEmptyContactSections(ab.props.contactSections);
  var personalSection = this.createEmptyPersonalSection(ab.props.personalDetails);
  var tempPersonalSection = this.createEmptyPersonalSection(ab.props.personalDetails);

  Addressbook.open(indexedDB).then(function(addrbook) {
    addrbook.getById(id).then(function(contact) {
      // Gets contact details
      for (var j = 0; j <contact.jcards.length; j++) {
        var details = contact.jcards[j].getAllProperties();
        for (var i = 0; i < details.length; i++) {
          self._parseProperty(details[i], contactSections, tempContactSections, personalSection, tempPersonalSection, j);
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
      break;
    case "adr":
      this._addFieldProperty(2, type, content, cFields, jCardIndex, property);
      this._addFieldProperty(2, type, content, tFields, jCardIndex, property);
      break;
    case "url":
      this._addFieldProperty(3, type, content, cFields, jCardIndex, property);
      this._addFieldProperty(3, type, content, tFields, jCardIndex, property);
      break;
    case "fn":
      this._addPersonalDetail(pField, tpField, "name", jCardIndex, property, content);
      break;
    case "nn":
      this._addPersonalDetail(pField, tpField, "nickName", jCardIndex, property, content);
      break;
    case "dn":
      this._addPersonalDetail(pField, tpField, "displayName", jCardIndex, property, content);
      break;
    case "bday":
      this._addPersonalDetail(pField, tpField, "birthday", jCardIndex, property, content.toString());
      break;
    default:
      break;
  }
};

ContactParser._addPersonalDetail = function(pField, tField, type, jCardIndex, property, content) {
  pField[type].content = content;
  pField[type].property = property;
  pField[type].jCardIndex = jCardIndex;
  tField[type].content = content;
  tField[type].property = property;
  tField[type].jCardIndex = jCardIndex;
}

ContactParser._addFieldProperty = function(index, currentOption, content, fields, jCardIndex, property) {
  var fieldID = fields[index].fields.length;
  fields[index].fields.push({
    currentOption: currentOption,
    content: content,
    fieldID: fieldID,
    jCardIndex: jCardIndex,
    property: property
  });
};

ContactParser.updateValue = function(tempContact, property, jCardIndex, content) {
    property.setValue(content);
};

ContactParser.removeContactDetail = function(tempContact, property, jCardIndex) {
  tempContact.jcards[jCardIndex].removeProperty(property);
};

ContactParser.addContactDetail = function(tempContact, name, content, type) {
  var property = tempContact.jcards[0].addPropertyWithValue(name, content);
  return property.setParameter("type", type);
};

ContactParser.updateOption = function(tempContact, property, jCardIndex, option) {
  property.setParameter("type", option);
}

ContactParser.rename = function(id, name, contactsList) {
  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].id == id) {
      contactsList[i].name = name;
      return;
    }
  }
};