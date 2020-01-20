import { 
  financeSettings, 
  financeSettingsSaveCoin, 
  financeSettingsBankDisabled,
  financeSettingsBankDelete,
  financeSettingsAlipayDisabled,
  financeSettingsAlipayDelete,
  financeSettingsWXDisabled,
  financeSettingsWXDelete,
  financeSettingsVisaDisabled,
  financeSettingsVisaDelete,
  financeSettingsPaypalDisabled,
  financeSettingsPaypalDelete,
} from '@/services/api';

const Model = {
  namespace: 'financeSettings',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(financeSettings, payload);
      yield put({
        type: 'save',
        payload: response && response.data,
      });
      return response;
    },
    *saveCoin({ payload }, { call, put }) {
      const response = yield call(financeSettingsSaveCoin, payload);
      return response;
    },
    *bankDisabled({ payload }, { call, put }) {
      const response = yield call(financeSettingsBankDisabled, payload);
      return response;
    },
    *bankDelete({ payload }, { call, put }) {
      const response = yield call(financeSettingsBankDelete, payload);
      return response;
    },
    *alipayDisabled({ payload }, { call, put }) {
      const response = yield call(financeSettingsAlipayDisabled, payload);
      return response;
    },
    *alipayDelete({ payload }, { call, put }) {
      const response = yield call(financeSettingsAlipayDelete, payload);
      return response;
    },
    *WXDisabled({ payload }, { call, put }) {
      const response = yield call(financeSettingsWXDisabled, payload);
      return response;
    },
    *WXDelete({ payload }, { call, put }) {
      const response = yield call(financeSettingsWXDelete, payload);
      return response;
    },
    *visaDisabled({ payload }, { call, put }) {
      const response = yield call(financeSettingsVisaDisabled, payload);
      return response;
    },
    *visaDelete({ payload }, { call, put }) {
      const response = yield call(financeSettingsVisaDelete, payload);
      return response;
    },
    *paypalDisabled({ payload }, { call, put }) {
      const response = yield call(financeSettingsPaypalDisabled, payload);
      return response;
    },
    *paypalDelete({ payload }, { call, put }) {
      const response = yield call(financeSettingsPaypalDelete, payload);
      return response;
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default Model;
