import InvTableEditComponent from "../../components/InvTableEdit";

type Props = {};

const LoginPage = (props: Props) => {
    console.log(props);
    return (
        <>
            <h1>Raw Material Transaction Page</h1>
            <InvTableEditComponent addButtonLabel="+ Add Customer" />
        </>
    );
};

export default LoginPage;
