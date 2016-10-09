function Images() { };

Images.handleURLRevoke = function() {
  URL.revokeObjectURL(this.props.image);
};