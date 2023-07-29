import { Col, DatePicker, Form, Input, Row, Button, Space, Select } from "antd";

type Props = {
    data: any;
    onSubmit(values: any, onSubmit: any): void;
    isLoading: boolean | undefined;
};
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import moment from "moment";

const onFinish = (values: any, data, onSubmit) => {
    console.log("Received values of form:", values);
    console.log("Received values of form:", data);
    const newValues = {
        productionDate: moment(values.dateTime.$d).format(
            "YYYY-MM-DDTHH:mm:ss.SSSZ"
        ),
        note: values.description,
        productItems: values.product.map((prod) => ({
            product: prod.product,
            uom: data.find((el) => el.value === prod.product)?.uom,
            qty: prod.amount,
        })),
    };
    console.log(newValues, 1112);
    onSubmit(newValues);
};

const ProductionForm = (props: Props) => {
    const initialUoms = Array.from(
        { length: props?.data?.data.length },
        () => "kg"
    );
    const [uoms, setUoms] = useState<string[]>(initialUoms);

    const handleProductChange = (index: number, value: any) => {
        const updatedUoms = [...uoms];
        updatedUoms[index] = props?.data?.data?.find(
            (el) => el.value === value
        )?.uom;
        setUoms(updatedUoms);
    };
    return (
        <Form
            layout="vertical"
            name="dynamic_form_nest_item"
            onFinish={(values) =>
                onFinish(values, props.data.data, props.onSubmit)
            }
            style={{ maxWidth: 800 }}
            autoComplete="off"
        >
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="dateTime"
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
                        name="description"
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
            <Form.List name="product">
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
                                    label="amount"
                                    name={[name, "amount"]}
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
                                        {props?.data?.data?.map((item) => (
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
                                        value={uoms[key]}
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
                                onClick={() => add()}
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
