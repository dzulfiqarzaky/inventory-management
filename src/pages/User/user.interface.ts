import { DataType } from "../../components/InvTableEdit/InvTableEdit.interface";

export interface UserBaseInterface {
    username: string;
    password: string;
    role: string;
}

export interface UserInterface extends UserBaseInterface {
    key: string;
}

export interface UserApiInterface extends UserBaseInterface {
    _id: string;
}

export interface UserDataInterface {
    data: UserInterface[];
}
export interface UserDataApiInterface {
    data: UserApiInterface[];
}

export interface UserColumnInterface {
    createUser: (obj: UserBaseInterface) => void;
    updateUser: (obj: Partial<UserBaseInterface>) => void;
    deleteUser: () => void;
    handleSaveGlobal: (record: DataType) => void;
    handleDelete: (key: string) => void;
    setTableRowId: (key: string) => void;
    isLoadingUpdateUser: boolean;
    isLoadingCreateUser: boolean;
    isLoadingDeleteUser: boolean;
}
