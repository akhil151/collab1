import { create } from "zustand"

export const useBoardStore = create((set) => ({
  boards: [],
  currentBoard: null,

  setBoards: (boards) => set({ boards }),
  setCurrentBoard: (board) => set({ currentBoard: board }),
  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
  removeBoard: (id) =>
    set((state) => ({
      boards: state.boards.filter((b) => b._id !== id),
    })),
}))
