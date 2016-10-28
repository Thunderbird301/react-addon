var DeleteModal = (props) => (
  <ReactModal
  isOpen={true}
  contentLabel="Modal"
  className="modal"
  >
    <h3>Are you sure you want to delete <b>{props.name}</b>?</h3>
    <div>
      <button className="buttons" onClick={props.confirmDelete}>Yes</button>
      <button className="buttons" onClick={props.noDelete}>No</button>
    </div>
  </ReactModal>
);
