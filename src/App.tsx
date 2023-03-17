import { useState } from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  width: 400px;
  height: 200px;
  form {
    input {
      width: 300px;
      height: 50px;
      border: 2px solid #f2f2f2;
    }
  }

`

function App() {
  let [result, setResult] = useState()
  let [keyword, setKeyword] = useState('')

  const apiKey = 'deaa5929c02757563300c7fc32c6ed62'
  const BaseURL = 'https://dapi.kakao.com/v2/search/'

  const searchFunction = async() => {
    const data = await fetch(`${BaseURL}image?sort=accuracy&page=1&size=5&query=${keyword}`, {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    })
    const json = await data.json()
    setResult(json)
    console.log(json)
  }

  const handlerFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    searchFunction()
  }

  return (
    <Wrap>
      <form onSubmit={handlerFormSubmit}>
        <input type='text' value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="검색어 입력"></input>
      </form>
    </Wrap>
  )
}

export default App
