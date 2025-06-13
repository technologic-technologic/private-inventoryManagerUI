import AvailabilitySearchBar from "../AvailabilitySearchBar";
import NameSearchBar from "../NameSearchBar";
import CategorySearchBar from "../CategorySearchBar";
import SearchFilterButton from "../SearchFilterButton";
import React from "react";
import {Col, Layout, Row, Space, Typography} from "antd";

const {Content} = Layout;
const {Text} = Typography;

const SearchBox: React.FC = () => {
    return (
        <Content style={{padding: 50, maxWidth: 600}}>
            <Space direction="vertical" size="middle" style={{width: "100%"}}>
                <Row gutter={50} align="middle">
                    <Col span={8}>
                        <Text>Name</Text>
                    </Col>
                    <Col span={50}>
                        <NameSearchBar/>
                    </Col>
                </Row>

                <Row gutter={25} align="middle">
                    <Col span={6}>
                        <Text>Category</Text>
                    </Col>
                    <Col span={100}>
                        <CategorySearchBar/>
                    </Col>
                </Row>

                <Row gutter={26} align="middle">
                    <Col span={6}>
                        <Text>Availability</Text>
                    </Col>
                    <Col span={18}>
                        <Row gutter={8} align="middle">
                            <Col flex="auto">
                                <AvailabilitySearchBar/>
                            </Col>
                            <Col>
                                <SearchFilterButton/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Space>
        </Content>
    );
};

export default SearchBox;