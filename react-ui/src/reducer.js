import axios from "axios";

const initialState = {
  sourceDataExtensionName: '',
  targetDataExtensionName: '',
  queryDescription: '',
  queryGPTJobId: 0,
  queryGPTJobState: '',
  queryGPTJobResult: '',
  dataExtensionsNotFound: [],
  sfmc_authUrl: '',
  sfmc_authCode: '',
  sdkInitialized: false,
  accessTokenDateTime: '',
  serverAppFlag: false, // Used to indicate whether app is using server-to-server or public integration
  runQueryJobId: 0,
  runQueryJobState: '',
  runQueryJobResult: []
}


const authMiddleware = store => next => action => {

  // Continue processing this action
  return next(action);
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_STATE':
      return {
        ...state,
        queryGPTJobId: action.payload.queryGPTJobId,
        queryGPTJobState: action.payload.queryGPTJobState,
        dataExtensionsNotFound: action.payload.dataExtensionsNotFound,
        sfmc_authUrl: action.payload.sfmc_authUrl,
        sfmc_authCode: action.payload.sfmc_authCode,
        sdkInitialized: false,
        accessTokenDateTime: action.payload.accessTokenDateTime,
        serverAppFlag: action.payload.serverAppFlag,
        runQueryJobId: action.payload.runQueryJobId,
        runQueryJobState: action.payload.runQueryJobState,
        runQueryJobResult: action.payload.runQueryJobResult
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

    case 'INITIALIZE_SDK_TRIGGERED': 
      return {
        ...state,
        sfmc_authCode: action.payload.sfmc_authCode
      }

    case 'INITIALIZE_SDK_SUCCESS': 
      return {
        ...state,
        sdkInitialized: true
      }

    case 'GET_AUTH_URL_SUCCESS':
      return {
        ...state,
        sfmc_authUrl: action.payload.sfmc_authUrl
      }

    case 'GET_SERVER_APP_FLAG_TRIGGERED': 
      return {
        ...state
      }

    case 'GET_SERVER_APP_FLAG_SUCCESS':
      return {
        ...state,
        serverAppFlag: action.payload.serverAppFlag
      }

    case 'ADD_RUN_QUERY_JOB_TRIGGERED': 
      return {
        ...state, 
        runQueryJobResult:[] 
      }

    case 'ADD_RUN_QUERY_JOB_SUCCESS': 
      return {
        ...state,
        runQueryJobId: action.payload.runQueryJobId,
        runQueryJobState: action.payload.runQueryJobState,
      }

    case 'RETRIEVE_RUN_QUERY_JOB_RESULT_TRIGGERED':
      return {
        ...state,
      }

    case 'RETRIEVE_RUN_QUERY_JOB_RESULT_IN_PROGRESS':
      return {
        ...state,
        runQueryJobId: action.payload.runQueryJobId,
        runQueryJobState: action.payload.runQueryJobState
      }
    
    case 'RETRIEVE_RUN_QUERY_JOB_RESULT_SUCCESS':
      return {
        ...state,
        runQueryJobId: action.payload.runQueryJobId,
        runQueryJobState: action.payload.runQueryJobState,
        runQueryJobResult: action.payload.runQueryJobResult
      }
    
    case 'RETRIEVE_RUN_QUERY_JOB_RESULT_FAILED':
      return {
        ...state,
        runQueryJobId: action.payload.runQueryJobId,
        runQueryJobState: action.payload.runQueryJobState
      }

    default:
      return state;
  }

};

export {authMiddleware, reducer}