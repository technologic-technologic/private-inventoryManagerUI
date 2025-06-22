import React from 'react';
import {Layout, theme} from 'antd';
import encora2 from "../assests/images/encora-logo-square.png"

const {Header} = Layout;

const EncoraHeader: React.FC = () => {
    const {} = theme.useToken();

    return (
        <Header style={{display: 'flex', alignItems: 'center'}}>
            <img
                src={encora2}
                alt="Logo"
                style={{cursor: 'pointer', marginRight: '20px', width:"50px"}}
                onClick={() => window.open('https://www.encora.com/', '_blank')}
            />
            <span style={{color: 'white', fontSize: '42px', fontFamily:'encora', wordSpacing:'20px'}}>encora</span>
        </Header>
    );
};

export default EncoraHeader;