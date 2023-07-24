import React from "react";
import {
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    ShopOutlined,
    DollarOutlined,
    DatabaseOutlined,
    SettingOutlined,
    FileSyncOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Skeleton, Space, theme } from "antd";
import InvStatistics from "./components/statistics";
import InvSidebar from "./components/Sidebar";
import { Outlet } from "react-router";
import { useGlobalState } from "./store";
import { RequireAuth, RequireNoAuth } from "./lib/Auth";
import LoginPage from "./pages/Login/index";
import { useLocation } from "react-router-dom";

const { Header, Content, Footer } = Layout;
export type MenuItem = {
    key: string;
    icon: any;
    label: string;
    path?: string;
    children?: {
        key: string;
        label: string;
        path: string;
    }[];
};

export const SidebarData: MenuItem[] = [
    {
        key: "1",
        icon: <PieChartOutlined />,
        label: "Dashboard",
        path: "/",
    },
    {
        key: "sub1",
        icon: <FileSyncOutlined />,
        children: [
            {
                key: "3",
                label: "Raw Material Transaction",
                path: "/raw-material/buy",
            },
            {
                key: "4",
                label: "Raw Material Used",
                path: "/raw-material/used",
            },
        ],
        label: "Raw Material",
    },
    {
        key: "sub2",
        icon: <SettingOutlined />,
        label: "Production",
        path: "/product/production",
    },
    {
        key: "sub3",
        icon: <DatabaseOutlined />,
        children: [
            {
                key: "7",
                label: "Raw Material",
                path: "/raw-material",
            },
            {
                key: "8",
                label: "Product",
                path: "/product",
            },
        ],
        label: "Inventory",
    },
    {
        key: "sub4",
        icon: <DollarOutlined />,
        children: [
            {
                key: "9",
                label: "Purchase Order",
                path: "/invoice/purchase-order",
            },
            {
                key: "10",
                label: "Bill",
                path: "/invoice/bill",
            },
        ],
        label: "Order",
    },
    {
        key: "11",
        icon: <TeamOutlined />,
        label: "Customer",
        path: "/customer",
    },
    {
        key: "12",
        icon: <ShopOutlined />,
        label: "Supplier",
        path: "/supplier",
    },
    {
        key: "13",
        icon: <UserOutlined />,
        label: "User",
        path: "/user",
    },
];

const App: React.FC = () => {
    const location = useLocation();

    // Split the URL into segments based on "/"
    const segments = location.pathname.split("/");

    // Filter out empty segments (e.g., when URL is "/")
    const filteredSegments = segments.filter((segment) => segment !== "");

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { globalState } = useGlobalState();
    return (
        <Layout style={{ minHeight: "100vh", display: "flex" }}>
            <RequireAuth>
                <InvSidebar items={SidebarData} />
                <Layout
                    className="site-layout"
                    style={{
                        marginLeft: globalState.sideBarContext ? 100 : 360,
                        transition: "margin 0.2s ease-in",
                    }}
                >
                    <Header
                        style={{ padding: 0, background: colorBgContainer }}
                    />
                    <Content style={{ margin: "0 16px" }}>
                        <Breadcrumb
                            style={{ margin: "16px 0", fontSize: "20px" }}
                        >
                            {filteredSegments.map((segment, index) => (
                                <Breadcrumb.Item key={index}>
                                    {segment.charAt(0).toUpperCase() +
                                        segment.slice(1)}
                                </Breadcrumb.Item>
                            ))}
                        </Breadcrumb>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                            }}
                        >
                            <Skeleton loading={false}>
                                <Space
                                    direction="vertical"
                                    size="large"
                                    style={{ display: "flex" }}
                                >
                                    <InvStatistics />
                                    <Outlet />
                                </Space>
                            </Skeleton>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>
                        Inventory app
                    </Footer>
                </Layout>
            </RequireAuth>
            <RequireNoAuth>
                <LoginPage />
            </RequireNoAuth>
        </Layout>
    );
};

export default App;
