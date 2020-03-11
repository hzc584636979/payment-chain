import { Button, Input, Icon, message, Row, Col, Select, DatePicker, Form } from 'antd';
import React, { Component } from 'react';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import { connect } from 'dva';
import ContLayout from '@/components/ContLayout';
import moment from 'moment';
import styles from './style.less';

const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

@connect(({ profitChart, loading }) => ({
  profitChart,
  loading: loading.effects['profitChart/fetch'],
}))
@Form.create()
class ProfitChart extends Component {
  state = {
    chartType: 1,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'profitChart/fetch',
      payload:{
        time: moment().startOf('month'),
        chartType: 1,
      },
    })
  }

  componentWillUnmount() {

  }

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { chartType } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        chartType,
      };
      dispatch({
        type: 'profitChart/fetch',
        payload: values,
      });
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { history } = this.props.profitChart.data;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xl={12} lg={12} sm={24}>
            <FormItem label="选择时间">
              {getFieldDecorator('time',{ initialValue: history.time })(
                <MonthPicker style={{ width: '100%' }} placeholder="请选择月份" />
              )}
            </FormItem>
          </Col>
          <Col xl={4} lg={12} sm={24}>
            <span className={styles.submitButtons} style={{paddingTop: 4, display: 'inline-block'}}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  handleChangeChartType = chartType => {
    this.setState({
      chartType
    })
    const { dispatch } = this.props;
    const { history } = this.props.profitChart.data;
    dispatch({
      type: 'profitChart/fetch',
      payload: {
        time: history.time,
        chartType
      },
    });
  }

  render() {
    const { profitChart, loading } = this.props;
    const { chartType } = this.state;
    const data = [
      {
          day: "03-01",
          value: 7
      },
      {
          day: "03-02",
          value: 6.9
      },
      {
          day: "03-03",
          value: 109.5
      },
      {
          day: "03-04",
          value: 14.5
      },
      {
          day: "03-05",
          value: 18.4
      },
    ];

    const cols = {
      month: {
        range: [0, 1]
      }
    };
    
    return (
      <ContLayout loading={loading}>
        <div className={styles.wrap}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div>
            <Row
              gutter={24}
              type="flex"
              className={styles.numberList}
            >
              <Col xl={8} md={8} sm={12} xs={12}>
                <div className={`${styles.item} ${chartType == 1 ? styles.itemOn : null}`}>
                  <div className={styles.name}>当月总手续费(USDT)</div>
                  <div className={styles.num}>{ 123213213 }</div>
                </div>
              </Col>
              <Col xl={8} md={8} sm={12} xs={12}>
                <div className={`${styles.item} ${chartType == 2 ? styles.itemOn : null}`}>
                  <div className={styles.name}>当月承兑商总收益(USDT)</div>
                  <div className={styles.num}>{ 1232132313 }</div>
                </div>
              </Col>
              <Col xl={8} md={8} sm={12} xs={12}>
                <div className={`${styles.item} ${chartType == 3 ? styles.itemOn : null}`}>
                  <div className={styles.name}>当月平台总收益(USDT)</div>
                  <div className={styles.num}>{ 1232132313 }</div>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row
              gutter={24}
              type="flex"
              justify="end"
              align="middle"
              style={{
                margin: '30px 0 10px 0'
              }}
            >
              <Col className={`${styles.chartItem} ${chartType == 1 ? styles.chartItemOn : null}`} onClick={() => this.handleChangeChartType(1)}>
                <span className={styles.icon}></span>
                <span className={styles.txt}>当月总手续费</span>
              </Col>
              <Col className={`${styles.chartItem} ${chartType == 2 ? styles.chartItemOn : null}`} onClick={() => this.handleChangeChartType(2)}>
                <span className={styles.icon}></span>
                <span className={styles.txt}>当月承兑商总收益</span>
              </Col>
              <Col className={`${styles.chartItem} ${chartType == 3 ? styles.chartItemOn : null}`} onClick={() => this.handleChangeChartType(3)}>
                <span className={styles.icon}></span>
                <span className={styles.txt}>当月平台总收益</span>
              </Col>
            </Row>
          </div>
          <div>
            <Chart height={400} data={data} scale={cols} forceFit>
              <Legend />
              <Axis name="day" />
              <Axis
                name="value"
                label={{
                  formatter: val => `${val}`
                }}
              />
              <Tooltip
                showTitle={false}
                containerTpl='<div class="g2-tooltip"><table class="g2-tooltip-list"></table></div>'
                itemTpl='<tr class="g2-tooltip-list-item"><td>{value}</td></tr>'
                g2-tooltip={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  visibility: 'hidden',
                  border : '1px solid #efefef',
                  backgroundColor: 'white',
                  color: '#000',
                  opacity: '0.8',
                }}
              />
              <Geom
                type="line"
                position="day*value"
                size={2}
                shape={"smooth"}
              />
              <Geom
                type="point"
                position="day*value"
                size={4}
                shape={"circle"}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
              />
            </Chart>
          </div>
        </div>
      </ContLayout>
    );
  }
}

export default ProfitChart;
