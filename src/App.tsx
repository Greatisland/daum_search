import { useState } from 'react'
import styled from 'styled-components'
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {margin: 0; padding: 0; color: #333;}
  a {text-decoration: none;}
  ul, ol {list-style: none;}
  html, body {font-family: 'Noto Sans KR', sans-serif;}
`

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 100px;
  gap: 20px;
  h2 {
    display: block;
    width: 100vw;
    text-align: center;
    span {
      color: #ec1c1c;
    }
  }
  form {
    input {
      width: 400px;
      height: 30px;
      border: 4px solid #3af329;
      font-size: 20px;
      font-weight: 400;
      padding: 0 10px;
      :focus {outline:none;}
    }
  }
`

const ResultList = styled.div`
  width: 400px;
`

interface WebList {
  documents: DocumentsWebType[]
}

interface ImgList {
  documents: DocumentsImgType[]
}

interface DocumentsWebType {
  contents: string
  title: string
  url: string
}

interface DocumentsImgType {
  collection: string
  display_sitename: string
  doc_url: string
  image_url: string
  thumbnail_url: string
  width: number
  height: number
}

function App() {
  let [imgResult, setImgResult] = useState<ImgList>()
  let [webResult, setWebResult] = useState<WebList>()
  let [keyword, setKeyword] = useState('')
  let [currentTab, setCurrentTab] = useState(0)

  const apiKey = 'deaa5929c02757563300c7fc32c6ed62'
  const BaseURL = 'https://dapi.kakao.com/v2/search/'

  const searchFunction = async() => {
    const webData = await fetch(`${BaseURL}web?sort=accuracy&page=1&size=5&query=${keyword}`, {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    })
    const webJson = await webData.json()
    setWebResult(webJson)

    const imgData = await fetch(`${BaseURL}image?sort=accuracy&page=1&size=5&query=${keyword}`, {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    })
    const imgJson = await imgData.json()
    setImgResult(imgJson)
  }

  const handlerFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    searchFunction()
  }

  return (
    <Wrap>
      <GlobalStyle />
      <h2><span>Daum</span> 웹페이지 검색 구현</h2>
      <form onSubmit={handlerFormSubmit}>
        <input type='text' value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="검색어 입력"></input>
      </form>
      <ResultList>

        {webResult?.documents?.map((val, i) => (
          <ul key={i}>
            <li>{val.title}</li>
            <li>{val.contents}</li>
            <li>{val.url}</li>
          </ul>
        ))}
        {imgResult?.documents?.map((val, i) => (
          <ul key={i}>
            <li>{val.collection}</li>
            <li>{val.display_sitename}</li>
            <li>{val.doc_url}</li>
            <li>{val.image_url}</li>
            <li>{val.thumbnail_url}</li>
            <li>{val.width}</li>
            <li>{val.height}</li>
          </ul>
        ))}
      </ResultList>
    </Wrap>
  )
}

export default App
