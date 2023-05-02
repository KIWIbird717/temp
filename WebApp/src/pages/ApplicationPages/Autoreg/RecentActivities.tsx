import { MCard } from '../../../components/Card/MCard'
import { AutoregHeader } from './AutoregHeader'
import { StaticMessage } from '../../../components/StaticMessage/StaticMessage'
import styles from "../../../global-style/scroll-bar-style.module.css"

interface IProps {
  height: number
}

export const RecentActivities = ({height}: IProps): JSX.Element => {

  return (
    <MCard className='px-2 py-2 w-full'>
      <AutoregHeader 
        title='Недавние действия' 
        dopTitle='Последняя информация об аккаунтах' 
      />
      <div style={{ height: height }} className={`flex flex-col gap-3 overflow-y-scroll overflow-x-hidden pr-[5px] ${styles.scroll_bar_style}`}>
        <StaticMessage 
          title='Добавление аккаунтов'
          dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
          type='success'
          date='12 апреля, 2023'
        />
        <StaticMessage 
          title='Добавление аккаунтов'
          dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
          type='success'
          date='12 апреля, 2023'
        />
        <StaticMessage 
          title='Добавление аккаунтов'
          dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
          type='warning'
          date='12 апреля, 2023'
        />
        <StaticMessage 
          title='Добавление аккаунтов'
          dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
          type='error'
          date='12 апреля, 2023'
        />
        <StaticMessage 
          title='Добавление аккаунтов'
          dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
          type='error'
          date='12 апреля, 2023'
        />
        <StaticMessage 
          title='Добавление аккаунтов'
          dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
          type='error'
          date='12 апреля, 2023'
        />
      </div>
    </MCard>
  )
}
