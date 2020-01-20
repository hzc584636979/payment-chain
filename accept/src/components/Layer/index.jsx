import { Button, Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './style.less';

class Layer extends Component {
  state = {
    
  };

  componentDidMount() {
    let div = document.createElement('div');
    div.className = styles.mask;
    document.body.appendChild(div);
    document.documentElement.style.overflow="hidden";
  }

  componentWillUnmount() {
    let mask = document.getElementsByClassName(styles.mask)[0];
    document.body.removeChild(mask);
    document.documentElement.style.overflow="visible";
  }

  render() {
    const { hiddenVisible, title, children } = this.props;
    let contentHeight = this.content && this.content.clientHeight;
    if(contentHeight && contentHeight + 50 > document.documentElement.clientHeight){
      contentHeight = document.documentElement.clientHeight - 50;
    }
    return (
      <div className={styles.wrap}>
        <div className={styles.title}>
          {title}
          <a className={styles.close} onClick={hiddenVisible}><Icon type="close" /></a>
        </div>
        <div className={styles.content} style={{height: '80vh'}}>
          <Scrollbars>
            <div ref={content => {this.content = content;}}>
              { children }
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default Layer;
