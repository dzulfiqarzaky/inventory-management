import InvTableEditComponent from "../../components/InvTableEdit";

type Props = {};

const RawMaterialPage = (props: Props) => {
    return (
        <>
            <h1>Raw Material Page</h1>
            <InvTableEditComponent addButtonLabel="+ Add Raw Material" />
        </>
    );
};

export default RawMaterialPage;
