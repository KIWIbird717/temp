import { BorderRight } from "@mui/icons-material"
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
  padding: '0 20px',
  borderRight: `1px solid ${colors.stroke}`
}

/**
 * `React.CSSProperties` for `<Header />` component layout
*/
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#000',
  height: headerStyleHeight,
  paddingInline: 0,
  // lineHeight: '64px',
  backgroundColor: colors.background,
  display: 'flex',
  alignItems: "center",
  justifyContent: 'space-between',
  minHeight: '150px',
  // padding: '40px 0'
}

/**
 * `React.CSSProperties` for `<Content />` component layout
*/
const contentStyle: React.CSSProperties = {
  // minHeight: `calc(100vh - ${headerStyleHeight}px)`,
  minHeight: '100vh',
  lineHeight: '120px',
  color: '#000',
  backgroundColor: colors.background,
  padding: '0px 40px 40px 40px'
}

/**
 * `React.CSSProperties` for `<Card />` component layout
 */
const cardStyle: React.CSSProperties = {
  backgroundColor: colors.white,
  boxShadow: '0px 100px 80px rgba(57, 61, 85, 0.05), 0px 39.6501px 43.3635px rgba(57, 61, 85, 0.031), 0px 18.4707px 32.7874px rgba(57, 61, 85, 0.0278), 0px 8.27251px 25.7097px rgba(57, 61, 85, 0.032), 0px 3.07015px 18.4935px rgba(57, 61, 85, 0.0339), 0px 0.660402px 10.0485px rgba(57, 61, 85, 0.0218)'
}




export { siderStyle, headerStyle, contentStyle, cardStyle }
