<template>
	<!--pages/mine/index.wxml-->
	<view class="container">
		<view v-if="!userInfo" class="info-container">
			<image class="not-login-avatar" src="/static/img/default.png"></image>
			<span class="not-login">未登录</span>
		</view>
		<view v-else class="info-container">
			<image class="login-avatar"
				:src="userInfo.avatars ? userInfo.avatars : userInfo.gender === 1? '/static/img/boy.png' : '/static/img/girls.png'">
			</image>
			<view class="bussiness-info">
				<view class="name">{{userInfo.username}}</view>
			</view>
			<view class="edit-info">
				<text class="desc" @click="editInformation">编辑资料</text>
				<image class="arrow" src="/static/img/mine/ic_arrow.png"></image>
			</view>
		</view>
		<view class="personal-container">
			<view class="my-collect" @click="navToCollection">
				<image class="collect-img" src="/static/img/mine/demo.png"></image>
				<text class="collect-title">我的关注</text>
			</view>
			<view class="my-browse" @click="navToHistory">
				<image class="history-img" src="/static/img/mine/demo.png"></image>
				<text class="history-title">我的粉丝</text>
			</view>
		</view>
		<view class="order-serve">
			<view class="title">常用功能</view>
			<view class="serve-container">
				<navigator v-for="(item, index) in mainItem" :key="index" :url="item.path">
					<view class="order-item">
						<image class="item-image" :src="item.image"></image>
						<view class="item-text">{{item.text}}</view>
					</view>
				</navigator>


			</view>
		</view>
		<view class="other-serve">
			<view class="title">其他服务</view>
			<view class="serve-container">
				<navigator v-for="(item, index) in otherItem" :key="index" :url="item.path">
					<view class="other-item">
						<image class="item-image" :src="item.image"></image>
						<view class="item-text">{{item.text}}</view>
					</view>
				</navigator>
			</view>
		</view>
		<u-button v-if="!userInfo" class="login-btn" @click="toLogin">立即登录</u-button>
	</view>

</template>


<script>
	// import userAPI from '@/utils/http/user.js'
	// import uploadAPI from '@/utils/http/upload.js'
	export default {
		data() {
			return {
				userInfo: null,
				otherItem: [{
					image: '/static/img/mine/demo.png',
					path: './setting/setting',
					text: '设置'
				}],
				mainItem: [{
						image: '/static/img/mine/demo.png',
						text: '收藏列表',
						path: ''
					}, {
						image: '/static/img/mine/demo.png',
						text: '浏览记录',
						path: ''
					}, {
						image: '/static/img/mine/demo.png',
						text: '我的动态',
						path: ''
					},
					{
						image: '/static/img/mine/demo.png',
						text: '暂定',
						path: ''
					}
				],
			}
		},
		created() {

		},
		async onShow() {
			await getApp().$options.getUserInfo();
			this.userInfo = getApp().globalData.userInfo;
		},
		onLoad() {

		},
		methods: {
			editInformation(){
				console.log(123)
				uni.navigateTo({
					url: "/pages/home/infoDetail"
				});
			},
			toLogin(){
				uni.navigateTo({
					url: "/pages/login/login"
				});
			},
			navToCollection(){
				uni.navigateTo({
					url: "../../home/follow"
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* pages/mine/index.wxss */
	page {
		background: #F4F5F9;
	}
	.container {
	  width: 750rpx;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  position: relative;
	}

	.info-container {
		position: relative;
		width: 100%;
		height: 300rpx;
		background-image: linear-gradient(#46A3FF, #80FFFF);
	}

	.not-login {
		position: absolute;
		left: 227rpx;
		top: 95rpx;
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		line-height: 33rpx;
	}

	.not-login-avatar,
	.login-avatar {
		position: absolute;
		left: 33rpx;
		top: 35rpx;
		width: 156rpx;
		height: 156rpx;
		border-radius: 50%;
	}

	.bussiness-info {
		position: absolute;
		top: 70rpx;
		left: 223rpx;
		width: auto;
	}

	.name {
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		line-height: 33rpx;
	}

	.star-edit {
		width: 490rpx;
		height: 30rpx;
		position: relative;
		display: flex;
		align-items: center;
		margin-top: 23rpx;
	}

	.star {
		width: 28rpx;
		height: 28rpx;
		margin-right: 6rpx;
	}

	.desc {
		position: absolute;
		right: 20rpx;
		/* width: 310rpx; */
		text-align: right;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		opacity: 0.5;
	}

	.arrow {
		position: absolute;
		right: 0;
		width: 11rpx;
		height: 20rpx;
	}

	.edit-wrap {
		position: absolute;
		right: 0;
	}

	.change-image {
		width: 26rpx;
		height: 30rpx;
	}

	.change-desc {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #1F6CDC;
		line-height: 33rpx;
		margin-left: 12rpx;
	}

	.password-change {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 180rpx;
		height: 47rpx;
		margin-top: 26rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
	}

	.personal-container {
		position: absolute;
		top: 250rpx;
		display: flex;
		align-items: center;
		width: 710rpx;
		height: 120rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 2rpx 10rpx 0rpx #DADFE1;
		border-radius: 20rpx;
	}

	.my-collect,
	.my-browse {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50%;
		height: 40rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #222222;
	}

	.my-collect {
		border-right: 1px solid #CCCCCC;
	}

	.collect-img,
	.history-img {
		width: 48rpx;
		height: 48rpx;
		margin-right: 20rpx;
	}

	.order-serve,
	.other-serve {
		position: relative;
		width: 710rpx;
		height: 252rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 2rpx 10rpx 0rpx #DADFE1;
		border-radius: 20rpx;
	}

	.order-serve {
		margin-top: 108rpx;
	}

	.other-serve {
		margin-top: 30rpx;
	}

	.title {
		position: absolute;
		top: 23rpx;
		left: 31rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #222222;
	}

	.serve-container {
		display: flex;
		box-sizing: border-box;
		justify-content: space-between;
		padding: 100rpx 30rpx 0rpx 30rpx;
	}


	.order-item,
	.other-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #FFFFFF;
		min-width: 120rpx;
	}

	.item-image {
		width: 48rpx;
		height: 48rpx;
	}

	.item-text {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666;
		margin-top: 22rpx;
	}

	.login-btn,
	.logout-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 280rpx;
		height: 61rpx;
		margin-top: 48rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: normal;
		color: #FFFFFF;
		background: #46A3FF;
		border-radius: 31rpx;
	}

	.login-btn.register {
		margin-top: 36rpx;

	}

	.van-popup--center {
		border-radius: 8rpx;
	}

	.login-dialog {
		position: relative;
		width: 560rpx;
		height: 498rpx;
		background: #FFFFFF;
	}

	.close-img {
		position: absolute;
		top: 44rpx;
		right: 44rpx;
		width: 28rpx;
		height: 28rpx;
	}

	.login-title {
		position: absolute;
		top: 71rpx;
		text-align: center;
		width: 100%;
		height: 32rpx;
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #222222;
	}

	.customer-login,
	.service-login {
		position: absolute;
		width: 440rpx;
		height: 74rpx;
		background: #1F6CDC;
		border-radius: 37rpx;
		font-size: 34rpx;
		font-family: PingFang SC;
		font-weight: normal;
		color: #FFFFFF;
		line-height: 30rpx;
	}

	.customer-login {
		top: 184rpx;
		left: 60rpx;
	}

	.service-login {
		bottom: 103rpx;
		left: 60rpx;
	}

	.edit-info {
		position: absolute;
		top: 110rpx;
		right: 31rpx;
		width: 160rpx;
		display: flex;
		align-items: center;
	}
</style>
