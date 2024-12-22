import React from "react"
import { useCurrentApp } from "components/context/app.context"
import { Button, Result } from "antd"
import { useLocation } from "react-router-dom"

interface IProps {
    children: React.ReactNode
}

export const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp()
    const location = useLocation()
    if (isAuthenticated === false) {
        return (
            <div>
                <Result
                    status="404"
                    title="401"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Button type="primary">Back Home</Button>}
                />
            </div>
        )
    }
    const isAdminRoute = location.pathname.includes('admin')
    if (isAuthenticated && isAdminRoute) {
        const role = user?.role
        if (role === "USER") {
            return (
                <div>
                    <Result
                        status="403"
                        title="403"
                        subTitle="Sorry, you are not authorized to access this page."
                        extra={<Button type="primary">Back Home</Button>}
                    />
                </div>
            )
        }
    }
    return (
        <>
            {props.children}
        </>
    )
}