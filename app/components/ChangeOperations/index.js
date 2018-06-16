/**
*
* ChangeOwner
*
*/

import React from 'react';
// import styled from 'styled-components';

import instance from '../../../token/TokenInstance';
import web3 from '../../../token/web3';
import { Row, Card, Col, Input, Button, Form, Icon, Modal } from "antd";
const FormItem = Form.Item;


class ChangeOperations extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      ownerLoading: false,
      txResp: '',
      newOwnerAddress: '',
      validOwnerAddress: false,
      addressValidateStatus: "",
      addressHelp: "",
      currentDate: '',
      visible: false
    }
    this.timer = this.timer.bind(this);
  }

  componentDidMount () {
    var intervalId = setInterval(this.timer, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount () {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  timer () {
    // setState method is used to update the state
    this.props.saveTimeStamp(Date.now());

    this.setState({ currentDate: (new Date()).toString() });
  }


  submitForm = (e) => {
    this.setState({ownerLoading: true, validOwnerAddress: false})
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if(!values) {
        this.setState({validOwnerAddress: false, ownerLoading: false, addressValidateStatus: 'error', addressHelp: 'Address is required!'});
      }
      else if(err) {
        this.setState({validOwnerAddress: false, ownerLoading: false, addressValidateStatus: 'error', addressHelp: 'Invalid Address!'});
      }
      else {
        this.setState({validOwnerAddress: true, txResp: ''});
        this.setState({newOwnerAddress: values.address})
        console.log(this.props.token.info.metaMaskAccount, "this.props.token.info.metaMaskAccountBalance", values, "values")

        if(this.props.componentAction == "Owner") {
          const txResp = await instance.methods.transferOwner(values.address).send({from: this.props.token.info.metaMaskAccount, gas: '1000000'});
          if(txResp.blockHash) {
            this.props.loadToken();
          }
          console.log(txResp)
          this.setState({txResp, ownerLoading: false, validOwnerAddress: true});
        }
        else {
          console.log(values.time, 'values.time')
          const txResp = await instance.methods.changeLockTime(values.time).send({from: this.props.token.info.metaMaskAccount, gas: '1000000'});
          if(txResp.blockHash) {
            this.props.loadToken();
          }
          console.log(txResp)
          this.setState({txResp, ownerLoading: false, validOwnerAddress: true});
        }

      }
    });
    // console.log(this.state.newOwnerAddress, "balanceAddress")
  }

  handleCheckAddress = (rule, value, callback) => {
    // console.log(rule, value, callback)
    this.setState({balanceAddress: value, txResp: '', addressValidateStatus: 'validating'})
    if (value) {
        console.log('valid', value)
        this.setState({validOwnerAddress: true, addressValidateStatus: 'success', addressHelp: 'Valid Address'});
        callback()
    }
    else {
      this.setState({validOwnerAddress: false, addressValidateStatus: '', addressHelp: ''});
      callback()
    }
  }
  handleAddressBlur = (evt) => {
    console.log(evt.target.value)
    if(evt.target.value == "") {
      this.setState({addressValidateStatus: '', addressHelp: ''});
    }
    else {
      this.setState({validOwnerAddress: true, addressValidateStatus: 'success', addressHelp: 'Valid Address'});
    }
  }

  render() {
    // console.log(instance)

    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Card loading={!this.props.token.info.tokenLoaded && this.props.token.info.metaMaskAccount} title={"Change " + this.props.componentAction}>
          {(this.props.token.info.metaMaskAccount == this.props.token.info.owner || this.props.componentAction == "Locktime")  && (this.props.token.info.metaMaskAccount != undefined) && <div>

            <Form style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}
                  onSubmit={this.submitForm} className="login-form">

              {
                this.props.componentAction == "Locktime" &&
                <Row>
                  <p><b>Current DateTime:</b> {this.state.currentDate}</p>
                </Row>
              }


              {this.props.componentAction == "Owner" &&
              <Row style={{width: '100%'}}>
                <Col span={24} style={{width: '100%'}}>
                  <FormItem validateStatus={this.state.addressValidateStatus} hasFeedback help={this.state.addressHelp}>
                    {getFieldDecorator('address', {
                      rules: [{required: true, message: 'Address is required!'},
                        {
                          validator: this.handleCheckAddress
                        }],
                    })(
                      <Input onBlur={this.handleAddressBlur} placeholder="Enter New Owner's Address"/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              }

              <Row style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                <Col span={10} pull={8}>
                  {this.props.componentAction == "Locktime" &&
                  <FormItem validateStatus={this.state.addressValidateStatus} hasFeedback help={this.state.addressHelp}>
                    {getFieldDecorator('time', {
                      rules: [{required: true, message: 'Time is required!'}],
                    })(
                      <Input min="1" type="number" placeholder="Enter New Lock Time"/>
                    )}
                  </FormItem>}
                </Col>
                <Col span={6} pull={1}>
                  <FormItem>
                    <Button loading={this.state.ownerLoading} type="primary" htmlType="submit"
                            className="login-form-button">
                      Change {this.props.componentAction}
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>

            {this.state.validOwnerAddress && this.state.txResp.blockHash && this.state.newOwnerAddress &&
            <Row>
              <Col>
                <b>New Owner Address: </b>
                <p style={{color: "#1890ff"}}>
                  {this.state.newOwnerAddress}
                </p>
              </Col>
            </Row>}
          </div>}


          {(this.props.token.info.metaMaskAccount != this.props.token.info.owner && this.props.componentAction == "Owner") &&
            <p>
              <Icon style={{color: '#FAAD14', marginRight: 10, fontSize: 17}} type="warning" />
              <span>Only an Onwer can change Owner Address. You should log through Owner address.</span>
            </p>}

          {(this.props.componentAction == "Locktime" && this.props.token.info.metaMaskAccount != undefined) &&
          <p>
            <Icon style={{color: '#FAAD14', marginRight: 10, fontSize: 17}} type="warning" />
            <span>This will change the Lock time of Current Meta Mask Account.</span>
          </p>}
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

ChangeOperations.propTypes = {

};

export default Form.create()(ChangeOperations);
