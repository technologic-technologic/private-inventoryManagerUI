import React from 'react';
import {Layout, Menu, theme} from 'antd';

const {Header} = Layout;

const items = Array.from({length: 3}).map((_, index) => ({
    key: String(index + 1),
    label: `nav ${index + 1}`,
}));

const EncoraHeader: React.FC = () => {
    const {} = theme.useToken();

    return (
        <Header style={{display: 'flex', alignItems: 'center'}}>
            <div className="demo-logo"/>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                items={items}
                style={{flex: 1, minWidth: 0}}
            />
        </Header>
    );
};

export default EncoraHeader;