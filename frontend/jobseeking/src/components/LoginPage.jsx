// import { useState } from 'react';
// import PropTypes from 'prop-types';

// export const LoginPage = ({ onClose }) => {
//   const [loginType, setLoginType] = useState('seeker'); // 'seeker' or 'company'

//   const toggleLoginType = (type) => setLoginType(type);

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative">
//       <button onClick={onClose} className="absolute top-2 right-8 text-gray-500 hover:text-gray-700">
//         &times;
//       </button>
//       <h2 className="text-2xl font-bold mb-4">
//         Login as {loginType === 'seeker' ? 'Job Seeker' : 'Company'}
//       </h2>

//       {/* Toggle between seeker and company */}
//       <div className="flex justify-center mb-4">
//         <button
//           onClick={() => toggleLoginType('seeker')}
//           className={`px-4 py-2 mr-2 rounded ${
//             loginType === 'seeker' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
//           }`}
//         >
//           Job Seeker
//         </button>
//         <button
//           onClick={() => toggleLoginType('company')}
//           className={`px-4 py-2 rounded ${
//             loginType === 'company' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
//           }`}
//         >
//           Company
//         </button>
//       </div>

//       {/* Common Form Structure */}
//       <form>
//         <div className="mb-4">
//           <label className="block text-gray-700">Email</label>
//           <input type="email" className="mt-1 p-2 w-full border rounded" />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Password</label>
//           <input type="password" className="mt-1 p-2 w-full border rounded" />
//         </div>

//         {/* Conditional Field for Companies */}
//         {loginType === 'company' && (
//           <div className="mb-4">
//             <label className="block text-gray-700">Company Code</label>
//             <input type="text" className="mt-1 p-2 w-full border rounded" placeholder="Enter your company code" />
//           </div>
//         )}

//         <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
//           Login as {loginType === 'seeker' ? 'Job Seeker' : 'Company'}
//         </button>
//       </form>
//     </div>
//   );
// };

// LoginPage.propTypes = {
//   onClose: PropTypes.func.isRequired,
// };


import PropTypes from 'prop-types';

export const LoginPage = ({ onClose, type }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative">
      <button onClick={onClose} className="absolute top-2 right-8 text-gray-500 hover:text-gray-700">
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4">
        {type === 'company' ? 'Company Login' : 'Job Seeker Login'}
      </h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input type="email" className="mt-1 p-2 w-full border rounded" />
        </div>
        
        {/* Conditional fields for Company vs Seeker */}
        {type === 'company' && (
          <div className="mb-4">
            <label className="block text-gray-700">Company Name</label>
            <input type="text" className="mt-1 p-2 w-full border rounded" />
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input type="password" className="mt-1 p-2 w-full border rounded" />
        </div>
        
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          {type === 'company' ? 'Login as Company' : 'Login as Job Seeker'}
        </button>
      </form>
    </div>
  );
};

LoginPage.propTypes = {
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};
