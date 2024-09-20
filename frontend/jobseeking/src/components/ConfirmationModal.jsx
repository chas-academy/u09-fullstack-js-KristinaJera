import PropTypes from 'prop-types';
import Modal from 'react-modal';

const ConfirmationModal = ({ isOpen, onRequestClose, jobTitle, onConfirm, actionType }) => {
    Modal.setAppElement('#root');

    // Fallback values
    const safeJobTitle = jobTitle || 'the job'; // Default if jobTitle is null
    const safeActionType = actionType || 'create'; // Default if actionType is null

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-white p-6 rounded-lg max-w-md mx-auto relative top-1/4 shadow-lg transition-transform transform-gpu"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <h2 className="text-lg font-bold text-center mb-3">
                Confirm {safeActionType.charAt(0).toUpperCase() + safeActionType.slice(1)} 
            </h2>
            <p className="text-center mb-5">
                Are you sure you want to {safeActionType === 'delete' ? 'delete' : safeActionType === 'update' ? 'update' : 'create'} the job: <strong>{safeJobTitle}</strong>?
            </p>
            <div className="flex justify-center space-x-3">
                <button 
                    onClick={onRequestClose} 
                    className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400 transition transform hover:scale-105"
                >
                    No
                </button>
                <button 
                    onClick={onConfirm} 
                    className={`py-2 px-4 rounded transition transform hover:scale-105 ${
                        safeActionType === 'delete' ? 'bg-red-500 text-white hover:bg-red-600' :
                        safeActionType === 'update' ? 'bg-blue-500 text-white hover:bg-blue-600' :
                        'bg-green-500 text-white hover:bg-green-600'
                    }`}
                >
                    Yes
                </button>
            </div>
        </Modal>
    );
};

// Prop Types
ConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    jobTitle: PropTypes.string, // Changed to not required
    onConfirm: PropTypes.func.isRequired,
    actionType: PropTypes.oneOf(['create', 'update', 'delete']), // Changed to not required
};

export default ConfirmationModal;


