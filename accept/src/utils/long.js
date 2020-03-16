//jsencrypt3.0.0-rc.1
//方法一：

const pubkey = 
`-----BEGIN RSA PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
gwQco1KRMDSmXSMkDwIDAQAB
-----END RSA PUBLIC KEY----- `;

const privkey = 
`-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5
rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIM
V7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATe
aTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5Azil
psLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Oz
uku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876
-----END RSA PRIVATE KEY----- `;

let testdata = {
    code: 200,
    result: {
        timestamp: 1572321851823,
        inter1: ["123123123", "123123123", "123123123", "123123123", "123123123"],
        inter2: ["123123123", "123123123", "123123123", "123123123", "123123123"],
        inter3: ["123123123", "123123123", "123123123", "123123123", "123123123"],
        inter4: ["123123123", "123123123", "123123123", "123123123", "123123123"],
        inter5: ["123123123", "123123123", "123123123", "123123123", "123123123"],
        inter6: ["123123123", "123123123", "123123123", "123123123", "123123123"],
        stream: {},
        caton: {},
        card: []
    }
};
let sd1 = new Date().getTime();
//加密
let encryptor = new JSEncrypt();
encryptor.setPublicKey(pubkey);
function rsaEncrypt(content){
  // 要加密的文本超出最大字符限制，则分段加密
  let ct = []
  let maxLength = 117;
  if (content.length > maxLength) {
    let lt = content.match(/.{1,117}/g);
    lt.map((item, index) => {
      let t1 = encryptor.encrypt(item);
      ct.push(t1)
    })
    return ct;
  }
  return [encryptor.encrypt(content)];
}

let encrypted = rsaEncrypt(JSON.stringify(testdata));
let ed1 = new Date().getTime();
console.log(`加密耗时:${ed1 - sd1}`);
console.log(encrypted)

let sd2 = new Date().getTime();
//解密
let decryptor = new JSEncrypt();
decryptor.setPrivateKey(privkey);
function rsaDecryptor(content){
  // 要加密的文本超出最大字符限制，则分段加密
  let ct = ''
  content.map((item,index) => {
    let t1 = decryptor.decrypt(item);
    ct += t1;
  })
  return ct;
}
let decrypted = rsaDecryptor(encrypted);
console.log(JSON.parse(decrypted));
let ed2 = new Date().getTime();
console.log(`解密耗时:${ed2 - sd2}`);
console.log(`总耗时:${ed2 - sd1}`);

//encryptlong3.1.4
//方法二：

const pubLongkey = 
`-----BEGIN RSA PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
gwQco1KRMDSmXSMkDwIDAQAB
-----END RSA PUBLIC KEY----- `;

const privLongkey = 
`-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5
rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIM
V7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATe
aTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5Azil
psLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Oz
uku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876
-----END RSA PRIVATE KEY-----`;

let testLongData = {
    "status": 1,
    "data": {
		"userInfo": {
			"id": 1,
			"parent_id": 3,
			"parent_name": "home123",
			"add_time": "2020-03-14T05:16:46.000Z",
			"type": 2,
			"user_name": "无敌",
      "id_card_face_path": "zhifulian.oss - cn - beijing.aliyuncs.com / ewuyissue_file_1581946685357zped.jpg ",
			"id_card_back_path ": "http: //zhifulian.oss-cn-beijing.aliyuncs.com/zllrissue_file_1581946690301eMph.jpg",
			"payment_code_path": null,
			"telephone_number": "13651224748",
			"email_address": "",
			"qq_number": "1981206461",
			"wechat_number": "wechat",
			"payment_link": null,
			"login_pwd": "e10adc3949ba59abbe56e057f20f883e",
			"payment_pwd": "Hzc123",
			"app_key": "eb357890-7069-4b3c-bb0c-ec6225cb91a4",
			"app_secret": "94955168BA5570056043CBA3E2B66796",
			"ip_white_list": null,
			"buy_online": false,
			"sell_online": false,
			"login_date": "2020-03-16T04:10:28.636Z",
			"real_name_passed": false,
			"trade_permission": true,
			"created_at": "2020-02-10T10:01:54.000Z",
			"updated_at": "2020-03-16T04:05:26.000Z",
			"createdAt": "2020-02-10T10:01:54.000Z",
			"updatedAt": "2020-03-16T04:05:26.000Z",
			"rate": 6.9569798068,
			"token_price": 1.0176829883967402,
			"all_balance": 14153925,
			"all_lock_balance": -229742586,
			"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWNjZXB0MSIsImV4cCI6MTU4NDQxODIyOSwiaWF0IjoxNTg0MzMxODI5fQ.MJz1IvVi52SwqXhKH-Y_fHbf0yT44eD_zdFlrLe-FlE"
		},
		"walletInfo": [{
			"id": 3,
			"user_id": 1,
			"address": "0xDDb2d901c92A105C4A65f329a436CCd93BF44aA3",
			"type": 1,
			"create_time": "2020-02-10T10:01:54.000Z",
			"balance": 14153925,
			"lock_balance": -229742586,
			"gas": 0.2,
			"chu_gas_percent": 0.2,
			"ru_gas_percent": 0.2,
			"createdAt": "2020-02-10T10:01:54.000Z",
			"updatedAt": "2020-02-10T10:01:54.000Z",
			"confirmations": 24
		}, {
			"id": 5,
			"user_id": 1,
			"address": "muzr9vEuEh3K4npdvXgXhGR6ufze2M5kqN",
			"type": 2,
			"create_time": "2020-02-10T10:01:54.000Z",
			"balance": 0,
			"lock_balance": 0,
			"gas": 0.2,
			"chu_gas_percent": 0.2,
			"ru_gas_percent": 0.2,
			"createdAt": "2020-02-10T10:01:54.000Z",
			"updatedAt": "2020-02-10T10:01:54.000Z",
			"confirmations": 2
		}],
		"accountInfo": {
			"user_id": 1,
			"credit": 0.837091,
			"success_order_percent": 0.34,
			"total_earnings": 0,
			"total_success_order": 0,
			"pledge_amount": 10,
			"sell_accept_slot_max": 5,
			"buy_accept_slot_max": 5,
			"sell_accept_slot_current": -1,
			"buy_accept_slot_current": 4,
			"sell_float_rate": 0.01,
			"buy_float_rate": 0.01,
			"withdraw_without_audit": true,
			"createdAt": "2020-02-10T10:01:54.000Z",
			"updatedAt": "2020-03-14T06:22:30.000Z",
			"rank": 1
		}
	},
    "msg": "success"
}

let sd1 = new Date().getTime();
//加密
let encryptLongor = new JSEncrypt();
encryptLongor.setPublicKey(pubLongkey);
function rsaEncryptLong(content){
  return encryptLongor.encryptLong(encodeURI(JSON.stringify(content)));
}
testLongData = {
	...testLongData,
	data: rsaEncryptLong(testLongData.data)
};
let ed1 = new Date().getTime();
console.log(`加密耗时:${ed1 - sd1}`);
console.log(testLongData)

let sd2 = new Date().getTime();
//解密
let decryptLongor = new JSEncrypt();
decryptLongor.setPrivateKey(privLongkey);
function rsaDecryptLong(content) {
	try {
		//console.log(`原始数据:${content.data}`)
		let decryptLonData = decryptLongor.decryptLong(content.data);
    let decodedata = decodeURI(decryptLonData);
    console.log(decodedata)
    let newdata = JSON.parse(decodedata);
    console.log(newdata)
		let decrypted = {
		  ...content,
		  data: newdata
		};
		return decrypted;
	}catch(err) {
    notification.error({
      message: `数据异常`,
      description: '返回数据异常，JSON解析报错，请刷新重试',
    });
		return null;
	}
}
console.log(rsaDecryptLong(testLongData))
let ed2 = new Date().getTime();
console.log(`解密耗时:${ed2 - sd2}`);
console.log(`总耗时:${ed2 - sd1}`);