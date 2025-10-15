import React from 'react';
import {Layout} from 'antd';
import encora from "../assets/images/encora-logo-square.png"

const {Header} = Layout;

const EncoraHeader: React.FC = () => {
    return (
        <Header style={{display: 'flex', alignItems: 'center'}}>
            <img
                src={encora}
                alt="Logo"
                style={{cursor: 'pointer', marginRight: '20px', width:"50px"}}
                onClick={() => window.open('https://www.encora.com/', '_blank')}
            />
            <span style={{color: 'white', fontSize: '42px', fontFamily:'encora', wordSpacing:'20px'}}>encora</span>
        </Header>
    );
};

export default EncoraHeader;