import React, { createContext, useState, useContext } from 'react';
import { Modal, Button } from 'reactstrap';
import { LOGOUT } from 'store/actions';
import { useDispatch } from 'react-redux';

const ErrorContext = createContext();

export const useError = () => {
  return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showOkButton,setShowOkButton] = useState(true);
  const showError = (message) => {
    if(message==="Session timed out. Please login again."){
      setErrorMessage(message);
      setIsErrorModalOpen(true);
      setShowOkButton(false)
      setTimeout(()=>{
        handleOkClick()
      },1500)
    }
    setErrorMessage(message);
    setIsErrorModalOpen(true);
  };
  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage('');
  };
  const handleOkClick = () => {
    setIsErrorModalOpen(false);
    dispatch({ type: LOGOUT });
    setErrorMessage('');
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}

      <Modal
        className="modal-dialog-centered custom-modal"
        contentClassName="bg-gradient-white"
        isOpen={isErrorModalOpen}
        toggle={closeErrorModal}
        style={{ maxWidth: '400px' }}
        fade={true} // Enable fade animation
      >
        <div className="modal-header border-0">
          {/* <h3 className="modal-title d-flex align-items-center">
            <i className="fas fa-exclamation-circle mr-2 text-danger" style={{ fontSize: '24px' }}></i>
            Error
          </h3> */}
          <button type="button" className="close" onClick={closeErrorModal}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <h3 className="" style={{ color: '#343a40' }}>
            <b>{errorMessage}</b>
          </h3>
        </div>
        <div className="modal-footer">
         {showOkButton? <Button
            className="bg-gradient-default btn-lg text-white"
            onClick={handleOkClick}
          >
            OK
          </Button>:null}
        </div>
      </Modal>


    </ErrorContext.Provider>
  );
};
