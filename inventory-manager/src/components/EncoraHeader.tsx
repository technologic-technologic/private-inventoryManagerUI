import React from 'react';
import {Layout} from 'antd';
import encora from "../assets/images/e-shape-chatreuse-400.png"
import encoraTxt from "../assets/images/White-Encora-Logo.png"


const {Header} = Layout;

const EncoraHeader: React.FC = () => {
    return (
        <Header style={{display: 'flex', alignItems: 'center', backgroundColor:"rgb(36,59,104)"}}>
            <img
                src={encora}
                alt="Logo"
                style={{cursor: 'pointer', marginRight: '20px', width:"50px"}}
                onClick={() => window.open('https://www.encora.com/', '_blank')}
            />
            <img
                src={encoraTxt}
                alt="Logo"
                style={{cursor: 'pointer', marginRight: '20px', width:"180px"}}
                onClick={() => window.open('https://www.encora.com/', '_blank')}
            />
        </Header>
    );
};

export default EncoraHeader;