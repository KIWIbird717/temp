import { Typography } from "antd"
import { colors } from "../../global-style/style-colors.module"

const { Title } = Typography

type propsType = {
  title: string,
  dopTitle: string,
}

export const AutoregHeader = ({title, dopTitle}: propsType) => {
  return (
    <div className="flex w-full justify-between mb-7">
      <div className="flex flex-col gap-1">
        <Title level={3} style={{ margin: '0 0', fontWeight: 'bold' }}>{title}</Title>
        <Title level={5} style={{ margin: '0 0', fontWeight: 'normal', color: colors.dopFont }}>{dopTitle}</Title>
      </div>
    </div>
  )
}
