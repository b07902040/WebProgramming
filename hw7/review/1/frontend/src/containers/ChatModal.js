import {Modal, Form, Input} from 'antd'

const ChatModal = ({visible, onCreate, onCancel}) => {
    const [form] = Form.useForm()
    return (
        <Modal
            visible={visible}
            title='create new chatRoom'
            okText='Create'
            cancelText='Cancel'
            onCancel={onCancel}
            onOk={()=>{
                form.validateFields().then((values)=>{
                    form.resetFields()
                    onCreate(values)
                })
            }}
        >
            <Form form={form} layout='vertical' name='form_in_modal' >
                <Form.Item name='name' label='Name'
                    rules={[{
                            required:true, 
                            message: "Error, need name",
                        }, 
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )


}


export default ChatModal