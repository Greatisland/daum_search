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
    width: 100%;
    display: flex;
    justify-content: center;
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

const TabContaner = styled.div`
  width: 400px;
`

const TabButtonContainer = styled.div`
  width: 400px;
  display: flex;
  justify-content: center;
`

const TabButton = styled.div`
  flex: 1;
  text-align: center;
  border: 1px solid #333;
  :hover {
    cursor: pointer;
    background: #333;
    color: #f2f2f2;
    }
`

const ShowContents = styled.div`
  width: 400px;
`
const WebTab = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 10px 0;
  li {
    font-size: 12px;
    margin: 0 0 5px 0;
  }
`
const ImgTab = styled.div`
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  a {
    margin: 10px 0;
  }
`





////////////////////////////// styled_components 영역

interface WebList {
  documents: DocumentsWebType[]
}

interface ImgList {
  documents: DocumentsImgType[]
}

interface DocumentsWebType {
  contents: string
  title: HTMLElement
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

interface TabProps {
  tabs: string[]
  initialIndex?: number
  children: Element[]
}


//Tab Component
const Tab: React.FC<TabProps> = ({tabs, initialIndex=0, children}) => {
  let [activeIndex, setActiveIndex] = useState(initialIndex)
  return (
    <TabContaner>
      <TabButtonContainer>
        {tabs.map((tab, i) => (
          <TabButton key={i} onClick={() => setActiveIndex(i)}>{tab}</TabButton>
        ))}
      </TabButtonContainer>
      <ShowContents>
        {children[activeIndex]}
      </ShowContents>
    </TabContaner>
  )
}

function App() {
  let [imgResult, setImgResult] = useState<ImgList>()
  let [webResult, setWebResult] = useState<WebList>()
  let [keyword, setKeyword] = useState('')

  const apiKey = 'deaa5929c02757563300c7fc32c6ed62'
  const BaseURL = 'https://dapi.kakao.com/v2/search/'

  const searchFunction = async() => {
    const webData = await fetch(`${BaseURL}web?sort=accuracy&page=1&size=10&query=${keyword}`, {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    })
    const webJson = await webData.json()
    setWebResult(webJson)

    const imgData = await fetch(`${BaseURL}image?sort=accuracy&page=1&size=15&query=${keyword}`, {
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
      <h2><span>Daum</span> 검색</h2>
      <form onSubmit={handlerFormSubmit}>
        <input type='text' value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="검색어 입력"></input>
      </form>
      <Tab tabs={['웹', '이미지']}>
        <WebTab>
          {webResult?.documents?.map((val, i) => {
            const titleName = val.title.replace(/<(\/b|b)([^>]*)>/gi,'')
            const contents = val.contents.replace(/<(\/b|b)([^>]*)>/gi,'')
            return (
            <a href={val.url} key={i}>
              <ul>
                <li style={{fontSize: '18px', textAlign: 'center', fontWeight: '700'}}>{titleName}</li>
                <li>{contents}</li>
              </ul>
            </a>
          )})}
        </WebTab>
        <ImgTab>
          {imgResult?.documents?.map((val, i) => (
            <a href={val.doc_url} key={i}>
              <ul>
                <li><img src={val.thumbnail_url}></img></li>
                <li>{val.display_sitename}</li>
              </ul>
            </a>
          ))}
        </ImgTab>
      </Tab>
    </Wrap>
  )
}

export default App
