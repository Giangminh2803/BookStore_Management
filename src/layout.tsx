import { Outlet } from "react-router-dom";
import AppHeader from "components/layout/app.header";


function Layout() {
  return (
    <div style={{backgroundColor: '#eaeaea'}}>
      <AppHeader />
      <Outlet/>
    </div>
  )
}

export default Layout
