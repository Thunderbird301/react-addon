var DeleteModal = (props) => (
  <ReactModal
  isOpen={true}
  contentLabel="Modal"
  >
    <h1>Are you sure you want to delete {props.name}?</h1>
    <div>
      <button onClick={props.confirmDelete}>Yes</button>
      <button onClick={props.noDelete}>No</button>
    </div>
  </ReactModal>
);