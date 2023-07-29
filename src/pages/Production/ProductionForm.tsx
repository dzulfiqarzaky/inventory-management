import { Col, DatePicker, Form, Input, Row, Button, Space, Select } from "antd";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import moment from "moment";

type InitialValue = {
    productionDate: string;
    note: string;
    products: {
        product: string;
        qty: string;
        uom: string;
    }[];
};

type Props = {
    product: { data: { label: string; value: string; uom: string }[] };
    initialVal?: InitialValue; // Make `initialVal` optional
    onSubmit(values: any, onSubmit: any): void;
    isLoading?: boolean;
};

const onFinish = (values: any, data, onSubmit) => {
    console.log("Received values of form:", values);
    console.log("Received values of form:", data);
    const newValues = {
        productionDate: moment(values.productionDate.$d).format(
            "YYYY-MM-DDTHH:mm:ss.SSSZ"
        ),
        note: values.note,
        productItems: values.product.map((prod) => ({
            product: prod.product,
            uom: data.find((el) => el.value === prod.product)?.uom,
            qty: prod.qty,
        })),
    };
    onSubmit(newValues);
};

const ProductionForm = (props: Props) => {
    const { Option } = Select;
    const initialUoms = Array.from(
        { length: props?.product?.data.length },
        () => "kg"
    );
    const [uoms, setUoms] = useState<string[]>(initialUoms);
    const [addNew, setAddnew] = useState<number | null>(null);
    const handleProductChange = (index: number, value: any) => {
        const updatedUoms = [...uoms];
        updatedUoms[index] = props?.product?.data?.find(
            (el) => el.value === value
        )?.uom;
        setUoms(updatedUoms);
    };

    const initialValues = props?.initialVal || {
        productionDate: "",
        note: "",
        products: [],
    };
    console.log(initialValues, 998);
    return (
        <Form
            layout="vertical"
            name="dynamic_form_nest_item"
            onFinish={(values) =>
                onFinish(values, props.product.data, props.onSubmit)
            }
            initialValues={initialValues}
            style={{ maxWidth: 800 }}
            autoComplete="off"
        >
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="productionDate"
                        label="DateTime"
                        rules={[
                            {
                                required: true,
                                message: "Please choose the dateTime",
                            },
                        ]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            getPopupContainer={(trigger) =>
                                trigger.parentElement!
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="note"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message: "please enter url description",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="please enter url description"
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Form.List
                name="product"
                initialValue={props?.initialVal?.products}
            >
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Space
                                key={key}
                                style={{ display: "flex", marginBottom: 8 }}
                                align="baseline"
                            >
                                <Form.Item
                                    {...restField}
                                    label="qty"
                                    name={[name, "qty"]}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Missing Amount",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Amount" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    label="product"
                                    name={[name, "product"]}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Missing Product",
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder={"Product"}
                                        loading={props.isLoading}
                                        style={{ width: 180 }}
                                        onChange={(value) =>
                                            handleProductChange(key, value)
                                        }
                                    >
                                        {props?.product?.data?.map((item) => (
                                            <Option
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    label="uom"
                                    name={[name, "uom"]}
                                    valuePropName="uom"
                                >
                                    <Input
                                        disabled
                                        placeholder="kg, ton, etc"
                                        value={
                                            addNew === key
                                                ? uoms[key]
                                                : !props?.initialVal
                                                ? uoms[key]
                                                : props?.initialVal?.products[
                                                      key
                                                  ].uom
                                        }
                                    />
                                </Form.Item>
                                <MinusCircleOutlined
                                    onClick={() => remove(name)}
                                />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => {
                                    add();
                                    setAddnew(fields.length);
                                }}
                                block
                                icon={<PlusOutlined />}
                            >
                                Add field
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProductionForm;
