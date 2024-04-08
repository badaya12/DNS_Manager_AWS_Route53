// reducers.js
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  accessKeyId: "",
  secretAccessKey: "",
  region: "",
  SelectedhostedZone : null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessKeyId(state, action) {
      state.accessKeyId = action.payload;
    //   state.secretAccessKey=null
    },
    setSecretAccessKey(state, action) {
      state.secretAccessKey = action.payload;
    //   state.accessKeyId=null;
    },
    setRegion(state,action)
    {
        state.region = action.payload;
    },
    setSelectedHostedZone(state,action)
    {
      state.SelectedhostedZone = action.payload;
    }
    }
  
});

export const { setAccessKeyId, setSecretAccessKey ,setRegion,setSelectedHostedZone} = authSlice.actions;
export default authSlice.reducer;
