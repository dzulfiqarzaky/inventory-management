import InvTableEditComponent from "../../components/InvTableEdit";

type Props = {};

const UserPage = (props: Props) => {
    console.log(props);
    return (
        <>
            <h1>User Page</h1>
            <InvTableEditComponent addButtonLabel="+ Add User" />
        </>
    );
};

export default UserPage;
