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

export const handleSubmit = (sourceDataExtensionName, targetDataExtensionName, queryDescription) => {
  
  
  return (dispatch) => {
    dispatch({
      type: 'HANDLE_SUBMIT',
      payload: {sourceDataExtensionName, targetDataExtensionName, queryDescription}
    })
  }
}