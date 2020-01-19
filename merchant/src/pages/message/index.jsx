import { message, List, Row, Col } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import ContLayout from '@/components/ContLayout';
import styles from './style.less';

@connect(({ message, loading }) => ({
  message,
  loading: loading.effects['message/fetch'],
}))

class Message extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'message/fetch',
      payload:{ pageSize:10,page:0 },
    });
  }

  componentWillUnmount() {

  }

  handleStandardTableChange = (page) => {
    const { dispatch } = this.props;

    const params = {
      page: page -1,
      pageSize: 10,
    };

    dispatch({
      type: 'message/search',
      payload: params,
    });
  };

  render() {
    const {  } = this.state;
    const { history, list, pagination } = this.props.message.data;

    return (
      <ContLayout>
        <div className={styles.wrap}>
          <List
            pagination={pagination.total && { 
              ...pagination,
              showQuickJumper: true,
              showTotal: total => `共${total}条记录`,
              onChange: this.handleStandardTableChange,
            }}
            dataSource={ list }
            renderItem={
              item => (
                <List.Item className={styles.item}>
                  <Row 
                    style={{
                      width: '100%'
                    }}
                    type="flex"
                    justify="space-between"
                  >
                    <Col xs={20} className={styles.title}><Link to={`/Message/detail/${item.id}`}>{item.title}</Link></Col>
                    <Col style={{textAlign: 'right'}} xs={4}>2019-11-01</Col>
                  </Row>
                </List.Item>
              )
            }
          />
        </div>
      </ContLayout>
    );
  }
}

export default Message;
