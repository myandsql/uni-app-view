let debug = false;
const urlDebug = 'http://localhost:8000'
const urlRelease = 'http://39.108.237.129' // 这里写正式域名地址

function getBaseUrl() {
	return debug ? urlDebug : urlRelease
}
export default {
	// 账号登录
	accountLogin(data) {
		let url = getBaseUrl() + '/Login'
		return new Promise((resolve, reject) => {
			let contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
			uni.request({
				url: url,
				data: data,
				method: 'POST',
				header: {
					'content-type': contentType,
					// 'token': token
				},
				success: res => {
					//返回什么就相应的做调整
					if (res.data.code === 1) {
						resolve(res.data)
					} else {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.data.msg || res.data.message
						});
						// reject(res)
					}
				},
				error: e => {
					reject('网络出错')
				}
			})
		})
	},
	// 短信发送验证码
	sendSMS(data) {
		let url = getBaseUrl() + '/RegistrationPhaseOne';
		return new Promise((resolve, reject) => {
			let contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
			uni.request({
				url: url,
				data: data,
				method: 'POST',
				header: {
					'content-type': contentType,
					// 'token': token
				},
				success: res => {
					//返回什么就相应的做调整
					if (res.data.code === 1) {
						resolve(res.data)
					} else {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.data.msg || res.data.message
						});
						// reject(res)
					}
				},
				error: e => {
					reject('网络出错')
				}
			})
		})
	},
	// 注册
	register(data) {
		let url = getBaseUrl() + '/RegistrationPhaseTwo';
		return new Promise((resolve, reject) => {
			let contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
			uni.request({
				url: url,
				data: data,
				method: 'POST',
				header: {
					'content-type': contentType,
					// 'token': token
				},
				success: res => {
					//返回什么就相应的做调整
					if (res.data.code === 1) {
						resolve(res.data)
					} else {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.data.msg || res.data.message
						});
						// reject(res)
					}
				},
				error: e => {
					reject('网络出错')
				}
			})
		})
	},
	// 忘记密码(发送验证码)
	forgetPassword(email) {
		let forgetPasswordUrl = getBaseUrl() + '/ChangePassWordPhaseOne';
		uni.request({
			header: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			url: forgetPasswordUrl,
			method: 'POST',
			data: {
				"email": email,
			},
			success: (res) => {
				console.log(res.data)
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: res.data.msg
				});
			}
		});
		// return request.post(url, data)
	},
	// 重置密码
	resetPassword(data) {
		let resetPasswordUrl = getBaseUrl() + '/ChangePassWordPhaseTwo';
		console.log(data)
		uni.request({
			header: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			url: resetPasswordUrl,
			method: 'POST',
			data: {
				"email": data.email,
				"password": data.password,
				"captcha": data.captcha
			},
			success: (res) => {
				console.log(res.data)
				if (res.data.code == 1) {
					uni.setStorage({
						key: 'token',
						data: res.data.token
					});
					console.log("登录成功")
					uni.navigateTo({
						url: "./login"
					});


				}
			}
		});
		// return request.post(url, data)
	},

	// 获取用户资料
	getUserInfo(data = {}) {
		let url = getBaseUrl() + '/access/GetUserInfo';
		return new Promise((resolve, reject) => {
			let contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
			const authorization = uni.getStorageSync('token');
			uni.request({
				url: url,
				data: data,
				method: 'GET',
				header: {
					'content-type': contentType,
					'Authorization': authorization
				},
				success: res => {
					//返回什么就相应的做调整
					if (res.data.code === 1) {
						resolve(res.data)
					} else {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.data.msg || res.data.message
						});
						// reject(res)
					}
				},
				error: e => {
					reject('网络出错')
				}
			})
		})
	},
	// 上传图片
	
	



}
