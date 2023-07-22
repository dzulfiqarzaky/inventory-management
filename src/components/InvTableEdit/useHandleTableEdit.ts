import { useState } from "react";
import { DataType } from "./InvTableEdit.interface";
import { AnyObject } from "antd/es/_util/type";
import { GlobalStateType, useGlobalState } from "../../store";

type GlobalKey = keyof GlobalStateType;

const useHandleEditTable = <T extends GlobalKey>(globalKey: T) => {
    const { globalState, setGlobalState } = useGlobalState();

    const [count, setCount] = useState(2);

    const handleDelete = (key: React.Key) => {
        const newData = globalState[globalKey].filter(
            (item: any) => item.key !== key
        );
        setGlobalState({ ...globalState, [globalKey]: newData });
    };

    const handleAdd = () => {
        const newData: DataType = {
            ...globalState[globalKey][0],
            key: globalState[globalKey][0].key + count,
            newData: true,
        };
        setGlobalState({
            ...globalState,
            [globalKey]: [...globalState[globalKey], newData],
        });
        setCount((count) => count + 1);
    };

    const handleSave = (row: AnyObject) => {
        const newData = [...globalState[globalKey]];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
            edited: true,
        });
        setGlobalState({ ...globalState, [globalKey]: newData });
    };

    const handleSaveGlobal = (row: AnyObject) => {
        const newData = [...globalState[globalKey]];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
            newData: false,
            edited: true,
        });
        setGlobalState({ ...globalState, [globalKey]: newData });
    };

    return {
        handleAdd,
        handleDelete,
        handleSave,
        handleSaveGlobal,
        dataSource: globalState,
        setDataSource: setGlobalState,
    };
};

export default useHandleEditTable;
