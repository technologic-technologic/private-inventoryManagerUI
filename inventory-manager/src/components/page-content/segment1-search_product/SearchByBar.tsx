import React from 'react';
import { Form } from 'antd';
import InputSearch from "./input-bars/InputSearch";
import CascaderSearch from "./input-bars/CascaderSearch";

const FiltersForm: React.FC = () => {
    return (
        <Form layout="inline" colon={false} style={{ marginBottom: 16 }}>
            <Form.Item label="Search by name">
                <InputSearch parameter="name" />
            </Form.Item>

            <Form.Item label="Search by category">
                <InputSearch parameter="category" />
            </Form.Item>

            <Form.Item label="Search by availability">
                <CascaderSearch />
            </Form.Item>
        </Form>
    );
};

export default FiltersForm;
