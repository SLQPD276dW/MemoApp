import Modal from 'react-modal';

export const customStyles: Modal.Styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  content: {
    backgroundColor: 'hsl(var(--b1))',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '500px',
    height: '270px',
    transform: 'translate(-50%, -50%)',
    color: 'base-content',
  },
};
