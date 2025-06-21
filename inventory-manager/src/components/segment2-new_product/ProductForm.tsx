import React from "react";
import {Button, DatePicker, Form, Input, InputNumber, Select, Space} from "antd";
import {Product} from "../../types/Product";
import {createProduct, updateProduct} from "../../services/Requests";
import {useSearchContext} from "../../context/SearchContext";
import dayjs from "dayjs";
import {useProductsData} from "../../context/DataContext";


interface ProductFormProps {
    initialValues?: Product;
    mode?: "create" | "edit";
    onClose: () => void;
}


const ProductForm: React.FC<ProductFormProps> = ({initialValues, mode = "create", onClose}) => {
    const [form] = Form.useForm<Product>();
    const {stockQuantity, setParams} = useSearchContext();
    const {categories} = useProductsData();


    const handleSave = async (values: Product) => {
        const formatted = {
            ...values,
            expirationDate: values.expirationDate
                ? new Date(values.expirationDate.toISOString())
                : undefined,
            category: values.category[0]
        };

        if (mode === 'edit') {
            await updateProduct(formatted.id, formatted)
                .then(() => setParams(
                    {
                        name: undefined,
                        page: 0,
                        category: undefined,
                        stockQuantity: 3,
                        sort: undefined
                    }))
                .catch((e) => console.log(e))
                .finally(() => {
                    if (stockQuantity === 0) {
                        setParams(
                            {
                                name: undefined,
                                page: 0,
                                category: undefined,
                                stockQuantity: 3,
                                sort: undefined
                            })
                    } else {
                        setParams(
                            {
                                name: undefined,
                                page: 0,
                                category: undefined,
                                stockQuantity: 0,
                                sort: undefined
                            })
                    }
                    handleCancel();
                });
            onClose();
        } else {

            await createProduct(formatted)
                .then()
                .catch((e) => console.log(e))
                .finally(() => {
                    if (stockQuantity === 0) {
                        setParams(
                            {
                                name: undefined,
                                page: 0,
                                category: undefined,
                                stockQuantity: 3,
                                sort: undefined
                            })
                    } else {
                        setParams(
                            {
                                name: undefined,
                                page: 0,
                                category: undefined,
                                stockQuantity: 0,
                                sort: undefined
                            })
                    }
                });
        }
        form.resetFields();
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    const options = categories.map(item => ({
        label: item,
        value: item,
    }));

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            onFinishFailed={(error) => {
                console.log("Validation failed:", error);
            }}

        >
            <Form.Item
                name="creationDate"
                label="creationDate"
                rules={[{required: false, message: "Please enter the name"}]}
                hidden={true}
            >
                <Input placeholder="text"/>
            </Form.Item>
            <Form.Item
                name="updateDate"
                label="updateDate"
                rules={[{required: false, message: "Please enter the name"}]}
                hidden={true}
                initialValue={new Date().toISOString()}
            >
                <Input placeholder="text"/>
            </Form.Item>
            <Form.Item
                name="id"
                label="id"
                rules={[{required: false, message: "Please enter the name"}]}
                hidden={true}
                initialValue={initialValues?.id}
            >
                <Input placeholder="text"/>
            </Form.Item>
            <Form.Item
                name="name"
                label="Name"
                rules={[{required: true, message: "Please enter the name"}]}
                initialValue={initialValues?.name}
            >
                <Input placeholder="text"/>
            </Form.Item>

            <Form.Item
                name="category"
                label="Category"
                rules={[{required: true, message: "Please select or create a category"}]}
                initialValue={initialValues?.category}
            >
                <Select
                    mode="tags"
                    maxCount={1}
                    placeholder="Select or type a new category"
                    allowClear
                    style={{width: '100%'}}
                    options={options}
                />
            </Form.Item>

            <Form.Item
                name="stockQuantity"
                label="Stock"
                rules={[
                    {required: true, message: "Please enter stock quantity"},
                    {
                        pattern: /^\d+?$/,
                        message: "Only numeric values are allowed (e.g. 123 or 123.45)",
                    },]}
                initialValue={initialValues?.stockQuantity}
            >
                <InputNumber style={{width: "100%"}} min={0}/>
            </Form.Item>

            <Form.Item
                name="unitPrice"
                label="Unit Price"
                rules={[
                    {required: true, message: "Please enter the price of the product"},
                    {
                        pattern: /^\d+(\.\d+)?$/,
                        message: "Only numeric values are allowed (e.g. 123 or 123.45)",
                    },
                ]}
                initialValue={initialValues?.unitPrice}
            >
                <InputNumber style={{width: "100%"}} min={0} step={0.01}/>
            </Form.Item>

            <Form.Item
                name="expirationDate"
                label="Expiration Date"
                rules={[{required: false, message: "Please select expiration date"}]}
                initialValue={
                    initialValues?.expirationDate
                        ? dayjs(initialValues.expirationDate)
                        : undefined}

            >
                <DatePicker style={{width: "100%"}}/>
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default ProductForm;
