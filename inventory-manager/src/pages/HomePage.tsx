import React from 'react';
import {Layout} from 'antd';
import EncoraHeader from "../components/EncoraHeader";
import EncoraFooter from "../components/EncoraFooter";
import EncoraContent from "../components/page-content/EncoraContent";

const HomePage: React.FC = () => {
    return (
        <Layout>
            <EncoraHeader/>
            <EncoraContent/>
            <EncoraFooter/>
        </Layout>
    );
};

export default HomePage;