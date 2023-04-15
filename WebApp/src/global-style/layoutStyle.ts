import { colors } from "./style-colors.module"

/**
 * Here will be `React.CSSProperties` for `App.tsx` component layout
*/

// Local preferences
const headerStyleHeight: number = 64

// Styles
/**
 * `React.CSSProperties` for `<Sider />` component layout
*/
const siderStyle: React.CSSProperties = {
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: colors.white,
  padding: '0 20px'
}

/**
 * `React.CSSProperties` for `<Header />` component layout
*/
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#000',
  height: headerStyleHeight,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: colors.background,
}

/**
 * `React.CSSProperties` for `<Content />` component layout
*/
const contentStyle: React.CSSProperties = {
  minHeight: `calc(100vh - ${headerStyleHeight}px)`,
  lineHeight: '120px',
  color: '#000',
  backgroundColor: colors.background,
  padding: '50px 50px'
}

export { siderStyle, headerStyle, contentStyle }
