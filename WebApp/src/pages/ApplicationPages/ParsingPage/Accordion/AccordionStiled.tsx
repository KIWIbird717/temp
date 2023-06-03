import { DownOutlined } from '@ant-design/icons'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { Typography } from "antd"
import { colors } from '../../../../global-style/style-colors.module'
import { FC, SyntheticEvent } from 'react'

const { Title } = Typography

interface IProps {
  id: number,
  expanded: string | boolean,
  onChange: (event: SyntheticEvent<Element, Event>, expanded: boolean) => void
}

export const AccordionStiled = ({id, expanded, onChange}: IProps) => {
  return (
    <Accordion
      style={{ borderRadius: 20 }}
      expanded={expanded === `panel${id}`}
      onChange={onChange}
    >
      <AccordionSummary
        expandIcon={<DownOutlined />}
      >
        <div className="flex flex-col gap-1 m-2">
          <Title level={4} style={{ margin: '0 0', color: colors.font }}>Парсинг участников в чате</Title>
          <Title level={5} style={{ margin: '0 0', fontWeight: 'normal', color: colors.dopFont }}>Парсинг всех доступных участников из телеграм чата</Title>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}
