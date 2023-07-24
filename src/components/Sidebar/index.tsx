import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { MenuItem } from "../../App";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import useSidebar from "./useSidebar";
import { useGlobalState } from "../../store";

const InvSidebar = ({ items }: { items: MenuItem[] }) => {
    const { globalState, setGlobalState } = useGlobalState();
    const { collapsed, setCollapsed } = useSidebar();
    return (
        <Sider
            theme="light"
            width={350}
            style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
            }}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => {
                setGlobalState({ ...globalState, sideBarContext: value });
                setCollapsed(value);
            }}
        >
            {/* <div className="demo-logo-vertical" /> */}
            <Menu
                theme="light"
                defaultSelectedKeys={["1"]}
                mode="inline"
                // items={items}
            >
                {/* <Space direction="vertical" style={{ display: "flex" }}> */}
                {items.map((item) =>
                    item.children ? (
                        <Menu.SubMenu
                            key={item.key}
                            icon={item.icon}
                            title={item.label}
                        >
                            {item.children.map((child) => (
                                <Menu.Item key={child.key}>
                                    <Link to={child.path}>{child.label}</Link>
                                </Menu.Item>
                            ))}
                        </Menu.SubMenu>
                    ) : (
                        <Menu.Item key={item.key} icon={item.icon}>
                            {item.path ? (
                                <Link to={item.path}>{item.label}</Link>
                            ) : null}
                        </Menu.Item>
                    )
                )}
            </Menu>
        </Sider>
    );
};

export default InvSidebar;
