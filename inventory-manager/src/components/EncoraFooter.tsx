import React from 'react';
import {Layout} from 'antd';

const {Content, Footer} = Layout;

const EncoraFooter: React.FC = () => {
    return (
        <Layout>
            <Content style={{padding: '0 48px'}}>
                <Footer style={{textAlign: 'center'}}>
                    Encora ©{new Date().getFullYear()} Created by Spark Intern: Leonardo Trevizo Herrera
                </Footer>
            </Content>

        </Layout>
    );
};

export default EncoraFooter;