import create from 'zustand';

export const useChatStore = create((set) => ({
  showFileUploader: false,
  toggleShowFileUploader: () => set((state) => ({ showFileUploader: !state.showFileUploader })),
}));