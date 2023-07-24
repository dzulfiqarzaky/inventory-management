/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react";
import { DataType } from "./InvTableEdit.interface";
import { AnyObject } from "antd/es/_util/type";
// import { GlobalStateType, useGlobalState } from "../../store";

// type GlobalKey = keyof GlobalStateType;

// const useHandleEditTable = <T extends GlobalKey>(globalKey: T) => {
const useHandleEditTable = () => {
    // const { globalState, setGlobalState } = useGlobalState();
    const [tableState, setTableState] = useState<DataType[]>([]);
    const [count, setCount] = useState(2);

    const handleDelete = (key: React.Key) => {
        // const newData = globalState[globalKey].filter(
        //     (item: DataType) => item.key !== key
        // );
        // setGlobalState({ ...globalState, [globalKey]: newData });
        const newData: DataType[] = [...tableState].filter(
            (el: DataType) => el.key !== key
        );
        setTableState(newData);
    };

    const handleAdd = () => {
        // const newData: DataType = {
        //     ...globalState[globalKey][0],
        //     key: globalState[globalKey][0].key + count,
        //     newData: true,
        // };
        // setGlobalState({
        //     ...globalState,
        //     [globalKey]: [...globalState[globalKey], newData],
        // });
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
        // const newData = [...globalState[globalKey]];
        // const index = newData.findIndex((item) => row.key === item.key);
        // const item = newData[index];
        // newData.splice(index, 1, {
        //     ...item,
        //     ...row,
        //     edited: true,
        // });
        // setGlobalState({ ...globalState, [globalKey]: newData });
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
        // const newData = [...globalState[globalKey]];
        // const index = newData.findIndex((item) => row.key === item.key);
        // const item = newData[index];
        // newData.splice(index, 1, {
        //     ...item,
        //     ...row,
        //     newData: false,
        //     edited: true,
        // });
        // setGlobalState({ ...globalState, [globalKey]: newData });
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
        // dataSource: globalState,
        // setDataSource: setGlobalState,
    };
};

export default useHandleEditTable;
