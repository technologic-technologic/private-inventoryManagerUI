import React from 'react';
import {Layout, theme} from 'antd';

const {Content, Footer} = Layout;

const EncoraFooter: React.FC = () => {
    const {} = theme.useToken();

    return (
        <Layout>
            <Content style={{padding: '0 48px'}}>
                <Footer style={{textAlign: 'center'}}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Content>

        </Layout>
    );
};

export default EncoraFooter;