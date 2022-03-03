let debug = true;
const urlDebug = 'http://localhost:8000'  
const urlRelease = ''  // 这里写正式域名地址

function getBaseUrl() {
  return debug ? urlDebug : urlRelease
}
export default {
	// 账号登录
	accountLogin(email, password) {
		console.log(email, password)
		let loginUrl = getBaseUrl() + '/Login'
		console.log(loginUrl)
		uni.request({
			header:{
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
		    url: loginUrl, 
			method: 'POST',
		    data: {
				"email":email,
		        "password":password,
		    },
		    success: (res) => {
				console.log(res.data)
		        if(res.data.code == 1){
					uni.setStorage({
						key: 'token',
						data: res.data.token
					});
					console.log("登录成功")
					uni.switchTab({
						
						url:"../tabbar/tabbar-5/tabbar-5"
					});
				}else{
					uni.hideLoading()
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: res.data.msg
				});
				}
		    }
		});
		
		// return request.post(url, data)
	},
	// 短信发送验证码
	sendSMS(data) {
		let url = getBaseUrl() + '/RegistrationPhaseOne';
		// return request.post(url, data)
	},
	// 注册
	register(data) {
		let url = '/RegistrationPhaseTwo';
		// return request.post(url, data)
	},
	// 忘记密码(发送验证码)
	forgetPassword(data) {
		let url = '/ChangePassWordPhaseOne';
		// return request.post(url, data)
	},
	// 重置密码
	resetPassword(data) {
		let url = '/ChangePassWordPhaseTwo';
		// return request.post(url, data)
	}
}