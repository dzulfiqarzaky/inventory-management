import InvTableEditComponent from "../../components/InvTableEdit";

type Props = {};

const CustomerPage = (props: Props) => {
    return (
        <>
            <h1>Customer Page</h1>
            <InvTableEditComponent addButtonLabel="+ Add Customer" />
        </>
    );
};

export default CustomerPage;
