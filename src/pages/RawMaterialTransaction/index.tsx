import { Space } from "antd";
import InvDrawer from "../../components/InvDrawer";
import InvTable, { DataType } from "../../components/InvTable";

type Props = {};
const data: DataType[] = [
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

const RawMaterialTransactionPage = (props: Props) => {
    return (
        <>
            <Space
                direction="vertical"
                size="large"
                style={{ display: "flex" }}
            >
                <h1>Raw Material Transaction Page</h1>
                <InvDrawer />
                <InvTable data={data} />
            </Space>
        </>
    );
};

export default RawMaterialTransactionPage;
