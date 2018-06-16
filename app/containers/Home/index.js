/**
 *
 * Home
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectToken from './selectors';
import reducer from './reducer';
import saga from './saga';
import CheckOperations from "../../components/CheckOperations";
import ChangeOperations from "../../components/ChangeOperations";
import SendToken from "../../components/SendToken";
import { loadToken, saveTimeStamp } from "./actions";

import { Row, Card, Col, Input, Button, Form, Icon, Tabs } from "antd";
const FormItem = Form.Item;
const { TabPane } = Tabs;


export class Home extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    this.props.loadToken();
  }

  render() {
    return (
      <div className="app">
        <div className="container">
          <Card loading={!this.props.token.info.tokenLoaded} title="ERC 20 Token Wallet" style={{ width: '100%', textAlign: 'center' }}>
            <Row>
              <Col className="custom-column" span={6} ><b>Name: </b>{this.props.token.info.name}</Col>
              <Col className="custom-column"  span={6} ><b>Symbol: </b>{this.props.token.info.symbol}</Col>
              <Col className="custom-column"  span={6} ><b>Total Supply: </b>{this.props.token.info.totalSupply}</Col>
            </Row>
            <Row style={{ margin: '15px auto'}}>
              <Col className="custom-column"  span={12}><b>Contract Address: </b>{this.props.token.info.contractAddress}</Col>
              <Col className="custom-column"  span={12}><b>Owner Address: </b>{this.props.token.info.owner}</Col>
            </Row>
            <Row>
              <Col  className="custom-column" span={12}><b>Current MetaMask Account: </b>{this.props.token.info.metaMaskAccount == undefined ? <span style={{color: '#f5222d'}}>Connect MetaMask</span> : this.props.token.info.metaMaskAccount}</Col>
              <Col  className="custom-column" span={4}><b>Account Balance: </b> {this.props.token.info.metaMaskAccountBalance} ST</Col>
            </Row>
          </Card>

          <Tabs defaultActiveKey="1" size="default">
            <TabPane tab="Token Operations" key="1">
              <Row style={{margin: '20px auto'}}>
                <Col span={11}>
                  <ChangeOperations componentAction="Owner" {...this.props}/>
                </Col>
                <Col offset={2} span={11}>
                  <SendToken {...this.props}/>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Account Operations" key="2" style={{marginLeft: 0}}>
              <Row style={{margin: '20px auto'}}>
                <Col span={11}>
                  <CheckOperations componentAction="Balance" {...this.props}/>
                </Col>
                <Col offset={2} span={11}>
                  <CheckOperations componentAction="Locktime" {...this.props}/>
                </Col>
              </Row>
              <Row style={{margin: '20px auto'}}>
                <Col span={11}>
                  <ChangeOperations componentAction="Locktime" {...this.props}/>
                </Col>
                <Col offset={2} span={11}>
                  <CheckOperations componentAction="Next Tx Time" {...this.props}/>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: makeSelectToken(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadToken: () => dispatch(loadToken()),
    saveTimeStamp: (val) => dispatch(saveTimeStamp(val)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Home);
