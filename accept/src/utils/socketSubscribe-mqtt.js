import mqtt from 'mqtt';

let gSocketClient = null;
let step = 0;
let loopBreakOff = null;

export function socketSubscribe(options) {
	if(gSocketClient || step == 1){
		console.log('上次WS未断开，请稍后再连');
		return;
	};

	// 连接选项
	const mqttOptions = {
	      connectTimeout: 4000, // 超时时间
	      reconnect : false,
	      port: 1883,
	      // 认证信息
	      username: 'client',
	      password: 'client'
	}

	const client = mqtt.connect('mqtt://34.237.138.218', mqttOptions);
	console.log(client, options)

	let sendHeartTimeout = null;

	let heartCheck = () => {
		sendHeartTimeout = setInterval(() => {
			console.log(`heart: ${new Date()}`)
			client.publish(`/heart`, `${window.g_getLocalStorage().id}`, {qos: 1});
		}, 10000)
	}

	client.on('reconnect', (error) => {
		clearInterval(sendHeartTimeout);
	    console.log('正在重连:', error)
	})

	client.on('error', (error) => {
		console.log('错误:',error);
		clearInterval(sendHeartTimeout);
	    destroyWebSocket();
	    socketSubscribe(options);
	})

	client.on('connect', (e) => {
    	client.subscribe(options.subscribeList, { qos:0 }, function (error) {
        	console.log(error || '订阅成功')
    	})
    	heartCheck();
	    step = 1;
	})

	client.on('message',function(topic, message){
		console.log(topic);
		var result = message.toString();　　//接收到新消息，并对其进行处理
		try{
			console.log('result---->',result);
			//****do something ****
			options.backList({body:result})
		}catch(e){
			console.log('error---->',result);
		}
	})

	client.on('close',() => {
		clearInterval(sendHeartTimeout);
		console.log('断开MQTT')
	});

	gSocketClient = client;
}

export function destroyWebSocket() {
	console.log(gSocketClient)
	if (gSocketClient) {
		if(step == 0){
			console.log('正在连接WS,无法断开,循环断开开始')
			let i = 0;
			loopBreakOff = setInterval(() => {
				if(step == 1){
					console.log('循环断开:'+i);
					i++;
					clearInterval(loopBreakOff);
					console.log('上次WS断开成功')
					gSocketClient.end(true);
					gSocketClient = null;
					step = 0;
				}
			},1000)
		}else if(step == 1){
			gSocketClient.end(true);
			gSocketClient = null;
			step = 0;
		}
	}
}
