import { Outlet } from "react-router-dom";
import AppHeader from "components/layout/app.header";
import { useEffect } from "react";
import { fetchAccountAPI } from "services/api";
import { useCurrentApp } from "components/context/app.context";
import { ClockLoader } from "react-spinners";

function Layout() {
  const { setUser, setIsAuthenticated, setIsAppLoading, isAppLoading } = useCurrentApp();
  useEffect(() => {
    const fetchAccount = async () => {
      const res = await fetchAccountAPI()
      if (res.data?.user) {
        setUser(res.data.user)
        setIsAuthenticated(true)
      }
      setIsAppLoading(false)
      console.log(res)
    }
    fetchAccount()
  }, [])
  return (
    <>
      {isAppLoading === false ?
        <div>
          <AppHeader />
          <Outlet />
        </div> :
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <ClockLoader
            size={80}
            color="#0088ff"
          />
        </div>
      }
    </>

  )
}

export default Layout
