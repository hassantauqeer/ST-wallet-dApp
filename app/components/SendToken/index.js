/**
*
* SendToken
*
*/

import React from 'react';
// import styled from 'styled-components';

import instance from '../../../token/TokenInstance';
// import ethereum_address from 'ethereum-address';
import web3 from '../../../token/web3';
import { Row, Card, Col, Input, Button, Form, Icon } from "antd";
const FormItem = Form.Item;


class SendToken extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      balanceLoading: false,
      sendTxLoading: false,
      balanceAddress: '',
      sendAddress: '',
      balance: '',
      txResp: '',
      validBalanceAddress: false,
      validSendingAddress: false,
      sendingTx: false,
      txHash: "",
    }
  }


  sendTx = async (e) => {
    const form = this.props.form;

    this.setState({sendTxLoading: true, validSendingAddress: false})
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
      }
    });
    if(form.getFieldValue('value')) {
      console.log(form.getFieldValue('value'))
      console.log(form.getFieldValue('sendingAddress'), web3.utils.toWei(form.getFieldValue('value').toString(), 'ether'))
      try {
        this.setState({sendingTx: true, txResp: ''})
        const txResp = await instance.methods.transfer(form.getFieldValue('sendingAddress'), form.getFieldValue('value').toString()).send({from: this.props.token.info.metaMaskAccount, gas: '1000000'});

        if(txResp.events.Transfer.returnValues._success) {
          this.setState({sendingTx: false, txHash: txResp.transactionHash, txResp: txResp.events.Transfer.returnValues._success})
          console.log(txResp, 'loaded')
          this.props.loadToken();
        }else {
          this.setState({sendingTx: false})
          console.log(txResp, 'not loaded')
        }
      }
      catch(err) {
        this.setState({sendingTx: false})
        // console.log(err)
      }
    }

    this.setState({sendTxLoading: false, validSendingAddress: true});
  }
  handleSendAddress = (rule, value, callback) => {
    this.setState({sendAddress: value})
    if (value) {
      // if (value && !ethereum_address.isAddress(value)) {
      //   callback('Invalid Address!')
      //   console.log("invalid-add", value)
      // }
      // else {
      //   callback()
      // }
    }
    else {
      callback()
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Card  loading={!this.props.token.info.tokenLoaded} title="Send Tokens">
          { (parseInt(this.props.token.info.metaMaskAccountNextTxTime)*1000) < this.props.token.timeStamp  && (this.props.token.info.metaMaskAccount != undefined) &&
          <Form style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center' }} onSubmit={this.sendTx} className="login-form">
                <FormItem style={{ width: '100%'}}>
                  {getFieldDecorator('sendingAddress', {
                    rules: [{ required: true, message: 'Address is required!' },
                      {
                        validator: this.handleSendAddress
                      }],
                  })(
                    <Input placeholder="To Address" />
                  )}
                </FormItem>
                <Row style={{ width: '100%'}}>
                  <Col span={12}>
                    <FormItem style={{ width: '100%'}}>
                      {getFieldDecorator('value', {
                        rules: [{ required: true, message: 'Value is required!' }],
                      })(
                        <Input placeholder="Value" type="number" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem>
                      <Button loading={this.state.balanceLoading} type="primary" htmlType="submit" className="login-form-button" style={{ float: 'right'}}>
                        Send
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
            <Row style={{ width: '100%'}}>
              {this.state.sendingTx && <Icon type="loading" />}
              {this.state.txResp && <p><b>Tx Hash:</b><br/><a target="_blank" href={"https://rinkeby.etherscan.io/tx/" + this.state.txHash}>{this.state.txHash}</a></p>}

            </Row>
          </Form>
          }
          { (parseInt(this.props.token.info.metaMaskAccountNextTxTime)*1000) > this.props.token.timeStamp  &&
            <Row>
              <Icon style={{color: '#f5222d', marginRight: 10, fontSize: 17}} type="info-circle-o" />
              <span>Your account is locked till <b>{(new Date(parseInt(this.props.token.info.metaMaskAccountNextTxTime) * 1000)).toString()}</b></span>
            </Row>
          }
          {(this.props.token.info.metaMaskAccount == undefined) &&
          <p>
            <Icon style={{color: '#f5222d', marginRight: 10, fontSize: 17}} type="close-circle-o" />
            <span>Connect MetaMask first.</span>
          </p>}
        </Card>
      </div>
    );
  }
}

SendToken.propTypes = {

};

export default Form.create()(SendToken);
