import { configureStore, createSlice } from '@reduxjs/toolkit'

const dashBoardModal = createSlice({
  name : 'dashBoardModal',
  initialState : false,
  reducers:{
    open(state){
      state=true;
      return state;
    },
    close(state){
      state=false;
      return state;
    },
  }
})

export let { open, close} = dashBoardModal.actions;

export default configureStore({
  reducer: { 
      post : post.reducer,
      dashBoardModal : dashBoardModal.reducer,
  }
}) 

