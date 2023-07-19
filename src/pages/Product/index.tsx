import InvTableEditComponent from "../../components/InvTableEdit";

type Props = {};

const ProductPage = (props: Props) => {
    console.log(props);
    return (
        <>
            <h1>Product Page</h1>
            <InvTableEditComponent addButtonLabel="+ Add Product" />
        </>
    );
};

export default ProductPage;
