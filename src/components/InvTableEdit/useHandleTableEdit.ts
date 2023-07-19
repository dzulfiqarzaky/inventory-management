import { useState } from "react";
import { DataType } from "./InvTableEdit.interface";
import { AnyObject } from "antd/es/_util/type";

const useHandleEditTable = () => {
    const [dataSource, setDataSource] = useState<DataType[]>([]);

    const [count, setCount] = useState(2);

    const handleDelete = (key: React.Key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const handleAdd = () => {
        const newData: DataType = {
            ...dataSource[0],
            key: count,
            newData: true,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row: AnyObject) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
            newData: false,
            edited: true,
        });

        setDataSource(newData);
    };

    const handleDatabaseSave = (row: AnyObject) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
            newData: false,
            edited: false,
        });
        setDataSource(newData);
        console.log(newData, "<<<< anter ke db ini");
    };

    return {
        handleAdd,
        handleDelete,
        handleSave,
        dataSource,
        setDataSource,
        handleDatabaseSave,
    };
};

export default useHandleEditTable;
