import React, {useState} from 'react';
import {Button, Modal} from 'antd';
import ProductForm from "./ProductForm";

const NewProductButton = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => setIsModalVisible(true);
    const handleClose = () => {
        setIsModalVisible(false);
    }

    return (
        <div className="App"
             style={{
                 display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center',   // <- vertical alignment
                 marginBottom: 16,
             }}
        >
            <Button type="primary" onClick={showModal}>Add new product</Button>
            <Modal
                title="Add new product to inventory"
                open={isModalVisible}
                onCancel={handleClose}
                footer={null}
            >
                <ProductForm mode="create"
                             initialValues={undefined}
                             onClose={handleClose}/>
            </Modal>
        </div>
    );
}
export default NewProductButton;