const initialState = {
  sourceDataExtensionName: '',
  targetDataExtensionName: '',
  queryDescription: '',
  queryGPTJobId: 0,
  queryGPTJobState: '',
  queryGPTJobResult: '',
}

const customMiddleWare = store => next => action => {
  // Custom Middleware
  // ...

  return next(action)
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    
    case 'HANDLE_SUBMIT': 
      
      
      return {
        
      }
    
    case 'EXECUTE_QUERYGPT':
      return {
        ...state,
        queryGPTJobId: action.payload.id,
        queryGPTJobState: action.payload.jobState
      }
      break;
      

    default:
      return state;
  }

};

export {customMiddleWare, reducer}