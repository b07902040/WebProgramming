import React from 'react';
import { Tabs, Input, message } from 'antd';

const { TabPane } = Tabs;
const ChatBox = (name) => (
    <TabPane tab={name} key={name} closable={true}>
        <p>{name}'s chatbox</p>
    </TabPane>
);

export default ChatBox;