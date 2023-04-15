import ReactDOM from 'react-dom/client';
import './global-style/index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd'
import { colors } from './global-style/style-colors.module';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = {
  token: {
    colorPrimary: colors.primary,
    background: colors.primary
  }
}

root.render(
  <BrowserRouter>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
);

