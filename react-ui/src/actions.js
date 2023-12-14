import axios from 'axios'

export const setInputValue = (name, value) => {
  return (dispatch) => {
    dispatch(
      {
        type: 'SET_INPUT_VALUE',
        payload: { name, value }
      }
    )
  }
}  

export const submitQueryGPTRequest = (sourceDataExtensionName, targetDataExtensionName, queryDescription) => {
  return async (dispatch) => {
    dispatch({
      type: 'SUBMIT_QUERYGPT_REQUEST_TRIGGERED',
      payload: {queryGPTJobResult: '', dataExtensionsNotFound: []}
    })

    let endpoint = '/api/queryGPT/' 
    let data = { sourceDataExtensionName, targetDataExtensionName, queryDescription}
    try {
      const response = await axios.post(`${endpoint}`, data)
      let queryGPTJobId = response.data.job.id
      let queryGPTJobState = response.data.jobState
  
      dispatch({
        type: 'SUBMIT_QUERYGPT_REQUEST_JOB_ADDED',
        payload: {queryGPTJobId, queryGPTJobState}
      })
    } catch (err) {
      console.error(`Error: ${err}`)
    }
  } 
}

export const retrieveResult = (id) => {
  return async (dispatch) => {
    dispatch({ 
      type: 'SUBMIT_QUERY_GPT_REQUEST_RETRIEVE_RESULT'
    })
    let endpoint = `/api/queryGPT/${id}`
    
    try {
      const response = await axios.get(`${endpoint}`)
      console.log(response.data)
      let queryGPTJobId = response.data.job.id
      let queryGPTJobState = response.data.jobState
      let queryGPTJobResult = response.data.job.returnvalue

      switch (queryGPTJobResult?.status) {
        case 'success':
          dispatch({
            type: 'SUBMIT_QUERYGPT_REQUEST_RETRIEVE_RESULT_SUCCESS',
            payload: {
              queryGPTJobId, 
              queryGPTJobState, 
              queryGPTJobResult: queryGPTJobResult.result
            }
          })
          break;

        case 'failed': 
          dispatch({
            type: 'SUBMIT_QUERYGPT_REQUEST_RETRIEVE_RESULT_FAILED',
            payload: {
              queryGPTJobId,
              queryGPTJobState: 'failed',
              dataExtensionsNotFound: queryGPTJobResult.dataExtensionsNotFound
            }
          })
          break;

        default:
          dispatch({
            type: 'SUBMIT_QUERYGPT_REQUEST_RETRIEVE_RESULT_IN_PROGRESS',
            payload: {
              queryGPTJobId,
              queryGPTJobState
            }
          })
      }

 
    } catch (err) {
      console.error(`Error: ${err}`)
    }
  }
}

export const resetState = () => {
  return (dispatch) => {
    dispatch({
      type: "RESET_STATE",
      payload: {
        queryGPTJobId: 0, 
        queryGPTJobState: "",
        dataExtensionsNotFound: [],
        sfmc_authUrl: '',
        sfmc_authCode: '',
        runQueryJobId: 0,
        runQueryJobState: '',
        runQueryJobResult: []
      }
    })

  }
}

/**
 * 
 * @returns Authorization URL used to redirect user to login. If user is already logged in, they will redirect to the app url with `?code=` parameter appended (i.e. authcode). Use `getAuthCode()` to retrieve the value of `code` parameter 
 */
export const getAuthUrl = () => {
  return async (dispatch) => {
    dispatch({
      type: "GET_AUTH_URL_TRIGGERED",
    })

    try {
      let authUrl = await axios({
        method: 'GET',
        url: '/authorization'
      })

      dispatch({
        type: 'GET_AUTH_URL_SUCCESS',
        payload: {
          sfmc_authUrl: authUrl.data,
        }
      })

    } catch(e) {console.log(e)}
     
  }
}

export const getAuthCode = (sfmc_authCode) => {
  return async (dispatch) => {
    dispatch({
      type: "INITIALIZE_SDK_TRIGGERED",
      payload: { sfmc_authCode }
    })

    try {
      let response = await axios({
        url: '/authorization',
        method: 'POST',
        data: { sfmc_authCode } 
      })

      if (response.status == 200) {
        dispatch({
          type: 'INITIALIZE_SDK_SUCCESS',
          payload: { sdkInitialized: true }
        })
      }
      
    } catch(e) {
      console.log(e)
    }
  }
}

export const getAccessAndRefreshTokens = (authCode) => {
  return async (dispatch) => {
    dispatch({
      type: 'GET_ACCESS_AND_REFRESH_TOKENS_TRIGGERED'
    })


    try {

    } catch(e) {
      console.log(e)
    }
  }
}

export const getServerAppFlag = () => {
  return async (dispatch) => {
    dispatch({
      type: 'GET_SERVER_APP_FLAG_TRIGGERED'
    })

    try {
      let response = await axios({
        method: 'GET',
        url: '/api/serverflag'
      })

      dispatch({
        type: 'GET_SERVER_APP_FLAG_SUCCESS',
        payload: {
          serverAppFlag: response.data
        }
      })
    } catch(e) {
      console.log(e)
    }
  }
}

export const addRunQueryJob = (query) => {
  return async (dispatch) => {
    dispatch({
      type: 'ADD_RUN_QUERY_JOB_TRIGGERED',
      payload: {
        query: query, 
        runQueryJobResult: []
      }
    })


    try {
      let response = await axios({
        method: 'POST',
        url: '/api/runquery',
        data: {query}
      })
      console.log(response)
      let runQueryJobId = response.data.job.id
      let runQueryJobState = response.data.jobState
      let runQueryJobResult = response.data.job.returnvalue

      dispatch({
        type: 'ADD_RUN_QUERY_JOB_SUCCESS',
        payload: {
          runQueryJobId, runQueryJobState, runQueryJobResult
        }
      })
    } catch(e) {
      console.log(e)
    }
  }
}

export const retrieveRunQueryResult = (id) => {
  return async (dispatch) => {
    let endpoint = `/api/runquery/${id}`
    
    try {
      const response = await axios.get(endpoint)
      console.log(response.data)
      let runQueryJobId = response.data.job.id
      let runQueryJobState = response.data.jobState
      let runQueryJobResult = response.data.job.returnvalue

      switch (runQueryJobState) {
        case 'completed':
          dispatch({
            type: 'RETRIEVE_RUN_QUERY_JOB_RESULT_SUCCESS',
            payload: {
              runQueryJobId, 
              runQueryJobState, 
              runQueryJobResult
            }
          })
          break;

        case 'active': 
          dispatch({
            type: 'RETRIEVE_RUN_QUERY_JOB_RESULT_IN_PROGRESS',
            payload: {
              runQueryJobId,
              runQueryJobState
            }
          })
          break;

        default:
          dispatch({
            type: 'RETRIEVE_RUN_QUERY_JOB_RESULT_FAILED',
            payload: {
              runQueryJobId,
              runQueryJobState,
            }
          })

      }

 
    } catch (err) {
      console.error(`Error: ${err}`)
    }
  }
}