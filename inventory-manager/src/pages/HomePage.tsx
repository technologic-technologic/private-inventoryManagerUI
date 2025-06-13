import React from 'react';
import {Layout, theme} from 'antd';
import EncoraHeader from "../components/EncoraHeader";
import EncoraFooter from "../components/EncoraFooter";
import EncoraContent from "../components/EncoraContent";

const HomePage: React.FC = () => {
    const {} = theme.useToken();

    return (
        <Layout>
            <EncoraHeader/>
            <EncoraContent/>
            <EncoraFooter/>
        </Layout>
    );
};

export default HomePage;