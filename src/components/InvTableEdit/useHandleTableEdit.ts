import { useState } from "react";
import { DataType } from "./InvTableEdit.interface";
import { AnyObject } from "antd/es/_util/type";
import { useGlobalState } from "../../store";

const useHandleEditTable = () => {
    const { globalState, setGlobalState } = useGlobalState();

    const [count, setCount] = useState(2);

    const handleDelete = (key: React.Key) => {
        const newData = globalState.tableEditContext.filter(
            (item) => item.key !== key
        );
        setGlobalState({ ...globalState, tableEditContext: newData });
    };

    const handleAdd = () => {
        const newData: DataType = {
            ...globalState.tableEditContext[0],
            key: count,
            newData: true,
        };
        setGlobalState({
            ...globalState,
            tableEditContext: [...globalState.tableEditContext, newData],
        });
        setCount(count + 1);
    };

    const handleSave = (row: AnyObject) => {
        const newData = [...globalState.tableEditContext];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
            newData: false,
            edited: true,
        });

        setGlobalState({ ...globalState, tableEditContext: newData });
    };

    return {
        handleAdd,
        handleDelete,
        handleSave,
        dataSource: globalState,
        setDataSource: setGlobalState,
    };
};

export default useHandleEditTable;
