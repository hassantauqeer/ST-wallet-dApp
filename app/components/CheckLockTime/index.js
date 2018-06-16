/**
*
* CheckLockTime
*
*/

import React from 'react';
// import styled from 'styled-components';

import instance from '../../../token/TokenInstance';
// import ethereum_address from 'ethereum-address';
import web3 from '../../../token/web3';
import { Row, Card, Col, Input, Button, Form, Icon } from "antd";
const FormItem = Form.Item;


class CheckLockTime extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      lockTimeLoading: false,
      lockTime: '',
      validLockAddress: false,
      validSendingAddress: false,
      addressValidateStatus: "",
      addressHelp: "",
    }
  }
  submitForm = (e) => {
    this.setState({lockTimeLoading: true, validLockAddress: false})
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if(!values) {
        this.setState({validLockAddress: false, lockTimeLoading: false, addressValidateStatus: 'error', addressHelp: 'Address is required!'});
      }
      else if(err) {
        this.setState({validLockAddress: false, lockTimeLoading: false, addressValidateStatus: 'error', addressHelp: 'Invalid Address!'});
      }
      else {
        this.setState({validLockAddress: true});
        const lockTime = await instance.methods.lockTime(this.state.balanceAddress).call();
        this.setState({lockTime, lockTimeLoading: false, validLockAddress: true});
      }
    });
    // console.log(this.state.balanceAddress, "balanceAddress")
  }

  handleCheckAddress = (rule, value, callback) => {
    // console.log(rule, value, callback)
    this.setState({balanceAddress: value, lockTime: '', addressValidateStatus: 'validating'})
    if (value) {
      // if (value && !TokenInstance.isAddress(value)) {
      //   // console.log('invalid')
      //   this.setState({validLockAddress: false, addressValidateStatus: 'validating', addressHelp: 'Invalid Address!'});
      //   callback('Invalid Address!')
      // }
      // else {
        console.log('valid', value)
        this.setState({validLockAddress: true, addressValidateStatus: 'success', addressHelp: 'Valid Address'});
        callback()
      // }
    }
    else {
      this.setState({validLockAddress: false, addressValidateStatus: '', addressHelp: ''});
      callback()
    }
  }
  handleAddressBlur = (evt) => {
    console.log(evt.target.value)
    if(evt.target.value == "") {
      this.setState({addressValidateStatus: '', addressHelp: ''});
    }
    else {
      this.setState({validLockAddress: true, addressValidateStatus: 'success', addressHelp: 'Valid Address'});
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Card loading={this.props.loading} title="Check Locktime">
          <Form style={{ display: 'flex', justifyContent: 'space-between' }} onSubmit={this.submitForm} className="login-form">
            <FormItem validateStatus={this.state.addressValidateStatus} hasFeedback help={this.state.addressHelp} style={{ width: '70%'}}>
              {getFieldDecorator('address', {
                rules: [{ required: true, message: 'Address is required!' },
                  {
                    validator: this.handleCheckAddress
                  }],
              })(
                <Input onBlur={this.handleAddressBlur} placeholder="Enter Address" />
              )}
            </FormItem>
            <FormItem>
              <Button loading={this.state.lockTimeLoading}  type="primary" htmlType="submit" className="login-form-button">
                Check Locktime
              </Button>
            </FormItem>
          </Form>
          {this.state.validLockAddress && this.state.lockTime && this.state.balanceAddress &&
          <Row>
            <Col span={3}>
              <b>Address: </b>
            </Col>
            <Col span={3} style={{color: "#52c41a"}}>
              {this.state.lockTime} ST
            </Col>
          </Row>}
        </Card>
      </div>
    );
  }
}

export default Form.create()(CheckLockTime);
