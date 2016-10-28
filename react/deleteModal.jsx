var DeleteModal = (props) => (
  <ReactModal
  isOpen={true}
  contentLabel="Modal"
  className="modal"
  >
    <h2>Are you sure you want to delete <b>{props.name}</b>?</h2>
    <div>
      <button className="buttons" onClick={props.confirmDelete}>Yes</button>
      <button className="buttons" onClick={props.noDelete}>No</button>
    </div>
  </ReactModal>
);
