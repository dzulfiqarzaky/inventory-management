import { Space } from "antd";

type Props = {};
const data = [
    {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
    },
    {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
    },
    {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sydney No. 1 Lake Park",
    },
    {
        key: "4",
        name: "Jim Red",
        age: 32,
        address: "London No. 2 Lake Park",
    },
];

const PurchaseOrderPage = (props: Props) => {
    console.log(props);
    return (
        <>
            <Space
                direction="vertical"
                size="large"
                style={{ display: "flex" }}
            >
                <h1>Purchase Order Page</h1>
            </Space>
        </>
    );
};

export default PurchaseOrderPage;
