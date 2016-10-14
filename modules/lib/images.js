function Images() { };

Images.handleURLRevoke = function() {
  URL.revokeObjectURL(this.props.image);
};

Images.getImageForContact = function(addrbook, contact, uuid) {
  return addrbook.getPhotoById(uuid).then(function(photo) {
    contact.photo = ContactParser.getPhotoURL(photo);
  });
}