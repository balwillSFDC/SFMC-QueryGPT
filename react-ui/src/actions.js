import axios from 'axios'
const baseURL = process.env.NODE_ENV === 'production' ? process.env.HEROKU_URL : 'http://localhost:5000'

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
      payload: {queryGPTJobResult: ''}
    })

    let endpoint = '/api/queryGPT/' 
    let data = { sourceDataExtensionName, targetDataExtensionName, queryDescription}
    try {
      const response = await axios.post(`${baseURL + endpoint}`, data)
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
      const response = await axios.get(`${baseURL + endpoint}`)
      let queryGPTJobId = response.data.job.id
      let queryGPTJobState = response.data.jobState
      let queryGPTJobResult = response.data.job.returnvalue

      dispatch({
        type: 'SUBMIT_QUERYGPT_REQUEST_RETRIEVE_RESULT_SUCCESS',
        payload: {queryGPTJobId, queryGPTJobState, queryGPTJobResult}
      })
    } catch (err) {
      console.error(`Error: ${err}`)
    }
  }
}