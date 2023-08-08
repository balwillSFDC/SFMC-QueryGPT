const initialState = {
  sourceDataExtensionName: '',
  targetDataExtensionName: '',
  queryDescription: '',
  queryGPTJobId: 0,
  queryGPTJobState: '',
  queryGPTJobResult: '',
  dataExtensionsNotFound: []
}

const customMiddleWare = store => next => action => {
  // Custom Middleware
  // ...

  return next(action)
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_STATE':
      return {
        ...state,
        queryGPTJobId: action.payload.queryGPTJobId,
        dataExtensionsNotFound: action.payload.dataExtensionsNotFound,
        queryGPTJobState: action.payload.queryGPTJobState
      }
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        [action.payload.name]: action.payload.value
      }
    
    case 'SUBMIT_QUERYGPT_REQUEST_TRIGGERED':
      return {
        ...state,
        queryGPTJobResult: action.payload.queryGPTJobResult,
        dataExtensionsNotFound: action.payload.dataExtensionsNotFound
      }

    case 'SUBMIT_QUERYGPT_REQUEST_JOB_ADDED': 
      return {
        ...state,
        queryGPTJobId: action.payload.queryGPTJobId,
        queryGPTJobState: action.payload.queryGPTJobState
      }
    
    case 'SUBMIT_QUERYGPT_REQUEST_RETRIEVE_RESULT': 
      return {
        ...state
      }

    case 'SUBMIT_QUERYGPT_REQUEST_RETRIEVE_RESULT_IN_PROGRESS':
      return {
        ...state,
        queryGPTJobId: action.payload.queryGPTJobId,
        queryGPTJobState: action.payload.queryGPTJobState
      }

    case 'SUBMIT_QUERYGPT_REQUEST_RETRIEVE_RESULT_SUCCESS':
      return {
        ...state,
        queryGPTJobId: action.payload.queryGPTJobId,
        queryGPTJobState: action.payload.queryGPTJobState,
        queryGPTJobResult: action.payload.queryGPTJobResult
      }      

    case 'SUBMIT_QUERYGPT_REQUEST_RETRIEVE_RESULT_FAILED':
      return {
        ...state,
        queryGPTJobId: action.payload.queryGPTJobId,
        queryGPTJobState: action.payload.queryGPTJobState,
        dataExtensionsNotFound: action.payload.dataExtensionsNotFound
      }      

    default:
      return state;
  }

};

export {customMiddleWare, reducer}