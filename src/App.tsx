import React from "react";
import {
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Skeleton, Space, theme } from "antd";
import InvStatistics from "./components/statistics";
import InvSidebar from "./components/Sidebar";
import { Outlet } from "react-router";
import { useGlobalState } from "./store";
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
        icon: <UserOutlined />,
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
        icon: <TeamOutlined />,
        label: "Production",
        path: "/product/production",
    },
    {
        key: "sub3",
        icon: <TeamOutlined />,
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
        icon: <TeamOutlined />,
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
        icon: <FileOutlined />,
        label: "Customer",
        path: "/customer",
    },
    {
        key: "12",
        icon: <FileOutlined />,
        label: "Supplier",
        path: "/supplier",
    },
    {
        key: "13",
        icon: <FileOutlined />,
        label: "User",
        path: "/user",
    },
];

const App: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { globalState } = useGlobalState();
    console.log(globalState, 1111);
    return (
        <Layout style={{ minHeight: "100vh", display: "flex" }}>
            <InvSidebar items={SidebarData} />
            <Layout
                className="site-layout"
                style={{
                    marginLeft: globalState.sideBarContext ? 100 : 360,
                    transition: "margin 0.2s ease-in",
                }}
            >
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: "0 16px" }}>
                    <Breadcrumb style={{ margin: "16px 0" }}>
                        <Breadcrumb.Item>Product</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
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
                <Footer style={{ textAlign: "center" }}>Inventory app</Footer>
            </Layout>
        </Layout>
    );
};

export default App;
