import InvTableEditComponent from "../../components/InvTableEdit";

type Props = {};

const SupplierPage = (props: Props) => {
    console.log(props);
    return (
        <>
            <h1>Supplier Page</h1>
            <InvTableEditComponent addButtonLabel="+ Add Supplier" />
        </>
    );
};

export default SupplierPage;
