/**
*
* CheckOperations
*
*/

import React from 'react';
// import styled from 'styled-components';

import instance from '../../../token/TokenInstance';
// import ethereum_address from 'ethereum-address';
import web3 from '../../../token/web3';
import { Row, Card, Col, Input, Button, Form, Icon } from "antd";
const FormItem = Form.Item;

class CheckOperations extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      txRespLoading: false,
      txResp: '',
      validBalanceAddress: false,
      validSendingAddress: false,
      addressValidateStatus: "",
      addressHelp: "",
    }
  }
  getBalance = (e) => {
    this.setState({balanceLoading: true, validBalanceAddress: false})
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if(!values) {
        this.setState({validBalanceAddress: false, balanceLoading: false, addressValidateStatus: 'error', addressHelp: 'Address is required!'});
      }
      else if(err) {
        this.setState({validBalanceAddress: false, balanceLoading: false, addressValidateStatus: 'error', addressHelp: 'Invalid Address!'});
      }
      else {
        this.setState({validBalanceAddress: true});
        if(this.props.componentAction == "Balance") {
          const txResp = await instance.methods.balanceOf(this.state.balanceAddress).call();
          this.setState({txResp, balanceLoading: false, validBalanceAddress: true});
        }
        else if(this.props.componentAction == "Next Tx Time") {
          const txResp = await instance.methods.nextTxTime(this.state.balanceAddress).call();
          console.log(txResp, 'txresp')
          if(txResp == '1521867032' || txResp == '0' ){
            this.setState({txResp: 'Not Locked Yet', balanceLoading: false, validBalanceAddress: true});
          }
          else {
            this.setState({txResp: (new Date(parseInt(txResp * 1000))).toString(), balanceLoading: false, validBalanceAddress: true});
          }
        }
        else {
          const txResp = await instance.methods.lockTime(this.state.balanceAddress).call();
          this.setState({txResp, balanceLoading: false, validBalanceAddress: true});
        }
      }
    });
    if (this.state.validSendingAddress) {
    }
    // console.log(this.state.balanceAddress, "balanceAddress")
  }

  handleCheckAddress = (rule, value, callback) => {
    // console.log(rule, value, callback)
    this.setState({balanceAddress: value, txResp: '', addressValidateStatus: 'validating'})
    if (value) {
      // if (value && !ethereum_address.isAddress(value)) {
      //   // console.log('invalid')
      //   this.setState({validBalanceAddress: false, addressValidateStatus: 'validating', addressHelp: 'Invalid Address!'});
      //   callback('Invalid Address!')
      // }
      // else {
        console.log('valid', value)
        this.setState({validBalanceAddress: true, addressValidateStatus: 'success', addressHelp: 'Valid Address'});
        callback()
      // }
    }
    else {
      this.setState({validBalanceAddress: false, addressValidateStatus: '', addressHelp: ''});
      callback()
    }
  }
  handleAddressBlur = (evt) => {
    console.log(evt.target.value)
    if(evt.target.value == "") {
      this.setState({addressValidateStatus: '', addressHelp: ''});
    }
    else {
      this.setState({validBalanceAddress: true, addressValidateStatus: 'success', addressHelp: 'Valid Address'});
    }
    // else {
    //   this.setState({validBalanceAddress: true, addressValidateStatus: '', addressHelp: 'Invalid Address'});
    // }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Card loading={!this.props.token.info.tokenLoaded} title={"Check " + this.props.componentAction}>
          <Form style={{ display: 'flex', justifyContent: 'space-between' }} onSubmit={this.getBalance} className="login-form">
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
              <Button loading={this.state.balanceLoading}  type="primary" htmlType="submit" className="login-form-button">
                Check {this.props.componentAction}
              </Button>
            </FormItem>
          </Form>
          {this.state.validBalanceAddress && this.state.txResp && this.state.balanceAddress &&
          <Row>
            <Col span={5}>
              <b>{this.props.componentAction}</b>
            </Col>
            <Col span={19} style={{color: "#52c41a"}}>
              {this.state.txResp} {this.props.componentAction == "Balance" ? <span>ST</span> : this.props.componentAction == "Locktime" ? <span>Minutes</span> :
                <p><Icon style={{color: '#FAAD14', marginRight: 10, fontSize: 17}} type="warning" />
                <span style={{color: '#00000073'}}>You have to send a Transaction to initiate lock.</span></p>}
            </Col>
          </Row>}
        </Card>
      </div>
    );
  }
}

CheckOperations.propTypes = {

};

export default Form.create()(CheckOperations);
