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
            category: typeof values.category === "string"
                ? values.category
                : values.category[0]
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
                rules={[{required: false}]}
                hidden={true}
            >
                <Input placeholder="text"/>
            </Form.Item>
            <Form.Item
                name="updateDate"
                label="updateDate"
                rules={[{required: false}]}
                hidden={true}
                initialValue={new Date().toISOString()}
            >
                <Input placeholder="text"/>
            </Form.Item>
            <Form.Item
                name="id"
                label="id"
                rules={[{required: false}]}
                hidden={true}
                initialValue={initialValues?.id}
            >
                <Input placeholder="text"/>
            </Form.Item>
            <Form.Item
                name="name"
                label="Name"
                tooltip="Type product name"
                rules={[
                    {required: true, message: "Please enter the name"},
                    {type: "string"},
                    {
                        validator: (_, value) => {
                            if (!value) {
                                return Promise.resolve();
                            }
                            const forbiddenWords = ["Name", "Test", "Admin", "Metrics"];
                            const hasForbiddenWord = forbiddenWords.some((word) =>
                                value.toLowerCase().includes(word.toLowerCase())
                            );
                            if (hasForbiddenWord) {
                                return Promise.reject(new Error("The category contains forbidden words"));
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
                initialValue={initialValues?.name}
            >
                <Input placeholder="Watermelon"/>
            </Form.Item>

            <Form.Item
                name="category"
                label="Category"
                tooltip="Select or type a new category"
                rules={[
                    {required: true, message: "Please select or create a category"},
                    {
                        transform: (value) => {
                            if (typeof value === "string") {
                                return value;
                            } else {
                                return value[0] as string
                            }
                        }
                    },
                    {
                        validator: (_, value) => {
                            if (!value) {
                                return Promise.resolve();
                            }
                            const forbiddenWords = ["Overall", "Total", "Summary", "Metrics"];
                            const hasForbiddenWord = value.some((entry: string) =>
                                forbiddenWords.some((word) =>
                                    entry.toLowerCase().includes(word.toLowerCase())
                                )
                            );
                            if (hasForbiddenWord) {
                                return Promise.reject(new Error("The category contains forbidden words"));
                            }
                            return Promise.resolve();
                        },
                    }
                ]}
                initialValue={initialValues?.category ? [initialValues?.category] : undefined}
            >
                <Select
                    mode="tags"
                    maxCount={1}
                    placeholder="Food"
                    allowClear
                    style={{width: '100%'}}
                    options={options}
                />
            </Form.Item>

            <Form.Item
                name="stockQuantity"
                label="Stock"
                tooltip="Please enter the product stock availability"
                rules={[
                    {required: true, message: "Please enter stock quantity"},
                    {
                        pattern: /^\d+?$/,
                        message: "Only natural numbers allowed (e.g. 10, 1, 239)",
                    },
                    {
                        type: "number", message: "Only numbers allowed"
                    },
                    {
                        validator: (_, value) => {
                            if (!value) {
                                return Promise.resolve();
                            } else if (typeof value != "number") {
                                return Promise.reject(new Error("Please enter stock quantity (e.g 0 or any natural number)"));
                            } else if (value === null) {
                                return Promise.reject(new Error("Please enter stock quantity"));
                            } else if (!Number.isInteger(value) || value < 0) {
                                return Promise.reject(new Error("Only natural numbers allowed (e.g. 0, 10, 239)"));
                            }
                            return Promise.resolve();
                        },
                    },]}
                initialValue={initialValues?.stockQuantity}
            >
                <InputNumber style={{width: "100%"}} min={0} placeholder={"10"}/>
            </Form.Item>

            <Form.Item
                name="unitPrice"
                label="Unit Price"
                tooltip="Please enter the product price"
                rules={[
                    {required: true, message: "Please enter the price of the product"},
                    {
                        pattern: /^\d+(\.\d+)?$/,
                        message: "Only numeric values are allowed (e.g. 123 or 123.45)",
                    },
                    {
                        validator: (_, value) => {
                            if (!value) {
                                return Promise.resolve();
                            } else if (value === null) {
                                return Promise.reject(new Error("Please enter the price of the product"));
                            } else if (typeof value !== "number" || isNaN(value) || value < 0) {
                                return Promise.reject(new Error("Only valid numeric values ≥ 0 are allowed (e.g. 123 or 123.45)"));
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
                initialValue={initialValues?.unitPrice}
            >
                <InputNumber style={{width: "100%"}} min={0} step={0.01} placeholder="80.99"/>
            </Form.Item>

            <Form.Item
                name="expirationDate"
                label="Expiration Date"
                tooltip="Not necessary. Expiration date of the product"
                rules={[{required: false, message: "Please select expiration date"}]}
                initialValue={
                    initialValues?.expirationDate
                        ? dayjs(initialValues.expirationDate)
                        : undefined}

            >
                <DatePicker style={{width: "100%"}} placeholder="01/12/1999"/>
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
