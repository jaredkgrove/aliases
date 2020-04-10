import { useState } from 'react'

export const useInputChange = () => {
  const [input, setInput] = useState({})

  const handleInputChange = (e) => {
      let value
      if(e.currentTarget.type === 'checkbox'){
        value = e.currentTarget.checked
      }else{
        value = e.currentTarget.value
      }
      setInput({
    ...input,
    [e.currentTarget.name]: value
  })
}

  return [input, handleInputChange]
}