import { useState } from "react";
import { DataType } from "./InvTableEdit.interface";
import { AnyObject } from "antd/es/_util/type";

const useHandleEditTable = () => {
    const [tableState, setTableState] = useState<DataType[]>([]);
    const [count, setCount] = useState(2);

    const handleDelete = (key: React.Key) => {
        const newData: DataType[] = [...tableState].filter(
            (el: DataType) => el.key !== key
        );
        setTableState(newData);
    };

    const handleAdd = () => {
        if (tableState.length === 0) return;
        const newData: DataType = {
            ...tableState[0],
            key: count.toString(),
            newData: true,
        };
        setTableState((prev) => [...prev, newData]);
        setCount((count) => count + 1);
    };

    const handleSave = (row: AnyObject) => {
        const newData = [...tableState];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
            edited: true,
        });
        setTableState(newData);
    };

    const handleSaveGlobal = (row: AnyObject) => {
        const newData = [...tableState];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
            newData: false,
            edited: true,
        });
        setTableState(newData);
    };

    return {
        handleAdd,
        handleDelete,
        handleSave,
        handleSaveGlobal,
        dataSource: tableState,
        setDataSource: setTableState,
    };
};

export default useHandleEditTable;
