import InvTableEditComponent from "../../components/InvTableEdit";

type Props = {};

const ProductPage = (props: Props) => {
    return (
        <>
            <h1>Product Page</h1>
            <InvTableEditComponent addButtonLabel="+ Add Product" />
        </>
    );
};

export default ProductPage;
