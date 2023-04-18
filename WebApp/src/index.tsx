import ReactDOM from 'react-dom/client';
import './global-style/index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd'
import { colors } from './global-style/style-colors.module';
import { Provider } from 'react-redux'
import store from './store/store';


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
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>
);

