import { Col, DatePicker, Form, Input, Row, Button, Space, Select } from "antd";

type Props = {};
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const onFinish = (values: any, onSubmit) => {
    console.log("Received values of form:", values);
    onSubmit(values);
};

const ProductionForm = (props: Props) => {
    console.log(props, "<<<< props");
    return (
        <Form
            layout="vertical"
            name="dynamic_form_nest_item"
            onFinish={(values) => onFinish(values, props.onSubmit)}
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
                                    rules={[
                                        {
                                            required: true,
                                            message: "Missing Uom",
                                        },
                                    ]}
                                >
                                    <Input placeholder="kg, ton, etc" />
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
