import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useError } from './ErrorContext'; // Import the global error context

const useFetchData = () => {
  const dispatch = useDispatch();
  const { showError } = useError(); // Use the showError function from the context

  const fetchData = async (method, url, data, token, onSuccess, onError) => {
    try {
      const header = {
        headers: { 'Authorization': 'Bearer ' + token }
      };
      let response;

      switch (method.toLowerCase()) {
        case 'get':
          response = await axios.get(url, header);
          break;
        case 'post':
          response = await axios.post(url, data, header);
          break;
        case 'put':
          response = await axios.put(url, data, header);
          break;
        case 'delete':
          response = await axios.delete(url, header);
          break;
        default:
          console.error(`Error: Unsupported HTTP method - ${method}`);
          return;
      }

      if (response && response.data) {
        onSuccess(response.data);
      } else {
        console.error('Error: Empty or invalid response');
        toast.error('Error: Empty or invalid response');
        showError('Empty or invalid response'); // Show error modal
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400 || status === 500) {
          showError('Internal Server Error. Please try again.');
        } else if (status === 401) {
          showError('Session timed out. Please login again.');
       } else {
          showError('An unexpected error occurred.');
        }
      }
      onError(error);
    }
  };
  return { fetchData };
};
export default useFetchData;
