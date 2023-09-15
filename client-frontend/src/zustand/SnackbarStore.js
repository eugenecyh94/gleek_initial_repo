import {create} from 'zustand';

const useSnackbarStore = create((set) => ({
  isOpen: false,
  message: '',
  type: 'success', 
  openSnackbar: (message, type = 'success') => {
    set({ isOpen: true, message, type });
  },
  closeSnackbar: () => {
    set({ isOpen: false, message: '', type: 'success' });
  },
}));

export default useSnackbarStore;