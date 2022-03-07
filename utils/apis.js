let debug = false;
const urlDebug = 'http://localhost:8000'
const urlRelease = 'http://39.108.237.129' // 这里写正式域名地址

function getBaseUrl() {
	return debug ? urlDebug : urlRelease
}
export default {
	request(options) { //传入的options是一个json对象
		return new Promise((resolve, reject) => {
			let contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
			const authorization = uni.getStorageSync('token');
			uni.request({
				url: getBaseUrl() + options.url,
				method: options.method || "GET",
				data: options.data || {}, 
				header: {
					'content-type': options.contentType || contentType,
					'Authorization': authorization
				},
				success: (res) => {
					if (res.data.code == 0) {
						return uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.data.msg || res.data.message
						})
					}
					resolve(res.data)
				},
				fail: (err) => {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: "接口请求失败"
					})
					reject(err)
				}
			})
		})
	},
	uploadFile(options) {
		return new Promise((resolve, reject) => {
			const authorization = uni.getStorageSync('token');
			uni.uploadFile({
				url: getBaseUrl() + options.url, //仅为示例，非真实的接口地址
				filePath: options.tempFilePath,
				name: 'file',
				header: {
					'Authorization': authorization
				},
				success: (res) => {
					let data = JSON.parse(res.data)
					if (data.code == 0) {
						return uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.data.msg || res.data.message
						})
					}
					resolve(data)
				},
				fail: (err) => {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: "接口请求失败"
					})
					reject(err)
				}
			});

		})
	}




}
