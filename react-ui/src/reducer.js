const initialState = {
  sourceDataExtensionName: '',
  targetDataExtensionName: '',
  queryDescription: '',
  queryBuilderJobId: 0,
  queryBuilderJobState: '',
  queryBuilderJobResult: '',
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
    
    case 'EXECUTE_QUERY_BUILDER':
      break;
      

    default:
      return state;
  }

};

export {customMiddleWare, reducer}