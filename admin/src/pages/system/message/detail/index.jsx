import { Button, Descriptions, Popconfirm, Modal } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ContLayout from '@/components/ContLayout';
import moment from 'moment';
import styles from './style.less';

@connect(({ systemMessageDetail, loading }) => ({
  systemMessageDetail,
  loading: loading.effects['systemMessageDetail/fetch'],
}))
class SystemMessageDetail extends Component {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemMessageDetail/fetch',
    });
  }

  componentWillUnmount() {

  }

  render() {
    const { systemMessageDetail={}, loading } = this.props;
                          
    return (
      <ContLayout>
        <div className={styles.wrap}>
          <div className={styles.inner}>
            <div className={styles.title}>{systemMessageDetail.title}</div>
            <div className={styles.time}>{moment(systemMessageDetail.time).local().format('YYYY-MM-DD HH:mm:ss')}</div>
            <div className={styles.content} dangerouslySetInnerHTML={{__html: systemMessageDetail.content || ''}}></div>
          </div>
        </div>
      </ContLayout>
    );
  }
}

export default SystemMessageDetail;
