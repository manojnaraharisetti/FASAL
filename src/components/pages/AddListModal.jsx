import React, { useState } from 'react';

export default function AddListModal({ isOpen, onClose, addList }) {
  const [newListName, setNewListName] = useState('');
  const [isPublic, setIsPublic] = useState(true); // Default to public

  const handleSave = () => {
    if (newListName) {
      addList(newListName, isPublic);
      setNewListName('');
      setIsPublic(true);
      console.log(isPublic);
      // Inside your addList function 
      console.log('Adding new list:', newListName, 'Is Public:', isPublic);

      // Inside your addList function
      console.log('Adding new list:', newListName, 'Is Public:', isPublic);
      // This will confirm that the function is being called with the correct values


    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content glass-effect">
          <div className="modal-header">
            <h5 className="modal-title">Create a new list</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              placeholder="New List Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="form-control mt-1"
              required
            />
            <div className="formcheckinpur">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="listPrivacyOption"
                  id="publicList"
                  value="public"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                />
                <label className="form-check-label" htmlFor="publicList">
                  Public
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="listPrivacyOption"
                  id="privateList"
                  value="private"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                />
                <label className="form-check-label" htmlFor="privateList">
                  Private
                </label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            {newListName.trim() ? (
              <button type="button" className="btn btn-primary" onClick={handleSave}><i class="fa-solid fa-check"></i>&nbsp;Save</button>
            ) : null}
            <button type="button" className="btn-secondary" data-dismiss="modal" onClick={onClose}><i class="fa-solid fa-circle-xmark"></i>&nbsp;Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
