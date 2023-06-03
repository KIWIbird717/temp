import Layout, { Content } from "antd/es/layout/layout"
import { HeaderComponent } from "../../../components/HeaderComponent/HeaderComponent"
import { contentStyle } from "../../../global-style/layoutStyle"
import { AccordionStiled } from "./Accordion/AccordionStiled"
import { useState } from "react"


export const ParsingPage = () => {
  const [accordionState, setAccordionState] = useState<string | boolean>(`panel${1}`)

  const accordionHandler = (panel: string) => {
    setAccordionState(panel)
  }
  return (
    <Layout style={contentStyle}>
      <HeaderComponent title='Парсинг'/>

      <Content>
        <div className="flex flex-col gap-3 max-w-[700px]">
          <AccordionStiled id={1} expanded={accordionState} onChange={() => accordionHandler(`panel${1}`)} />
          <AccordionStiled id={2} expanded={accordionState} onChange={() => accordionHandler(`panel${2}`)} />
          <AccordionStiled id={3} expanded={accordionState} onChange={() => accordionHandler(`panel${3}`)} />
        </div>
      </Content>
    </Layout>
  )
}
