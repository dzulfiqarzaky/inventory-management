import React from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

const InvStatistics: React.FC = () => (
    <Row gutter={16}>
        <Col span={12}>
            <Card bordered={false}>
                <Statistic
                    title="Income"
                    value={1280000}
                    precision={2}
                    valueStyle={{ color: "#3f8600" }}
                    prefix="IDR"
                    suffix={<ArrowUpOutlined />}
                />
            </Card>
        </Col>
        <Col span={12}>
            <Card bordered={false}>
                <Statistic
                    title="Expenditure"
                    value={123000}
                    precision={2}
                    valueStyle={{ color: "#cf1322" }}
                    suffix={<ArrowDownOutlined />}
                    prefix="IDR"
                />
            </Card>
        </Col>
    </Row>
);

export default InvStatistics;
