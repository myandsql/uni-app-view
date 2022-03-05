<script>
	import APIS from "utils/http.js"
	export default {
		onLaunch: function() {
			console.log('App Launch');

			setTimeout(() => {
				uni.setTabBarBadge({
					index: 1,
					text: '31'
				});
				uni.showTabBarRedDot({
					index: 3
				});
			}, 1000);
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		globalData: {
			userInfo: null,
		},
		async getUserInfo() {
			const value = uni.getStorageSync('token');
			if(!value){
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}else{
				if (this.globalData.userInfo === null) {
					try {
						let userRes = await APIS.getUserInfo()
						this.globalData.userInfo = userRes.data 
					} catch (error) {
						uni.removeStorage({key: 'token'});
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}
				}
			}
		},
	};
</script>

<style>
	/*每个页面公共css */
	@import "uni_modules/uview-ui/theme.scss";
</style>
