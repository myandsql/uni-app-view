<template>
	<view class="container">
		<view class="content-main flex-column">
			<view class="content-item special flex-center" @click="onShowSheet">
				<view class="item-left-title">头像</view>
				<image class="item-headImg" mode="aspectFill" :src="userInfo.avatars"></image>
				<!-- 	<image class="icon-image" src="/static/img/mine/ic_arrow2.png"></image> -->
				<u-icon name="/static/img/icon/common/arrow.png" size="50rpx"></u-icon>
			</view>
			<view class="content-item flex-center" @click="goChangeName">
				<view class="item-left-title">名字</view>
				<view class="item-right">{{ userInfo.username}}</view>
				<u-icon name="/static/img/icon/common/arrow.png" size="50rpx"></u-icon>
			</view>
			<picker :range="columns" @change="bindSexChange">
				<view class="content-item flex-center">
					<view class="item-left-title">性别</view>
					<view class="item-right">{{ userInfo.gender}} </view>
					<u-icon name="/static/img/icon/common/arrow.png" size="50rpx"></u-icon>
				</view>
			</picker>
		</view>
	</view>
</template>
<script>
	import api from "utils/apis.js"
	export default {
		data() {
			return {
				userInfo: {},
				changeAvatarOptions: [{
					name: '拍照',
					method: 'onChooseImage',
					sourceType: 'camera'
				}, {
					name: '从相册选择',
					method: 'onChooseImage',
					sourceType: 'album'
				}],
				columns: ['男', '女']

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

			//显示上传选项
			async onShowSheet(e) {
				uni.showActionSheet({
					itemList: ['拍照', '从相册选择'],
					success: res => {
						this[this.changeAvatarOptions[res.tapIndex].method](this.changeAvatarOptions[res
							.tapIndex].sourceType)
					},
					fail: err => {
						console.log(err.errMsg);
					}
				})
			},
			//选择图片
			async onChooseImage(sourceType) {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: [sourceType],
					success: res => {
						console.log('tempFilePaths[0]', res.tempFilePaths[0]);
						this.uploadMultiPics(res.tempFilePaths[0])
					}
				});

			},
			//上传文件
			async uploadMultiPics(value) {
				const res = await api.uploadFile({
					url: '/access/ChangeAvatars',
					tempFilePath: value,
				})

				if (res.code == 1) {
					this.userInfo.avatars = res.data.imageUrl
					console.log(res.data.imageUrl)
					getApp().globalData.userInfo.avatars = res.data.imageUrl
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: "保存成功"
					})
				}
			},
			goChangeName() {
				uni.navigateTo({
					url: './changeName'
				})
			},
			async bindSexChange(e) {
				console.log(e)
				if (this.userInfo.gender != this.columns[e.target.value]) {
					const res = await api.request({
						method: 'POST',
						url: '/access/ChangeGender',
						data: {
							gender: this.columns[e.target.value]
						},
					})
					console.log(res)
					if (res.code == 1) {
						this.userInfo.gender = this.columns[e.target.value]
						getApp().globalData.userInfo.gender = this.columns[e.target.value]
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: "保存成功"
						})
					}
				}


			},

		}
	}
</script>
<style lang="scss" scoped>
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

	.container {
		margin-top: 12rpx;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
	}

	.flex-center {
		display: flex;
		align-items: center;
	}

	.cut-line {
		padding: 0 35rpx;
		height: 80rpx;
		background: rgba(248, 248, 248, 1);
	}

	.content-main {
		width: 750rpx;
		position: relative;
		background: #ffffff;
	}

	.cut-line-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #222222;
	}

	.content-item {
		height: 100rpx;
		padding: 0 35rpx;
		border-bottom: 1px solid rgba(240, 240, 240, 1);
	}


	.content-item.special {
		height: 140rpx;
	}

	.item-left-title {
		min-width: 170rpx;
		font-size: 30rpx;
		font-weight: 500;
		color: #222222;
	}

	.save-button {
		margin-top: 79rpx;
		margin-bottom: 88rpx;
		width: 600rpx;
		height: 74rpx;
		background: #206CDC;
		border-radius: 37rpx;
		font-size: 34rpx;
		font-weight: 500;
		color: #FFFFFF;
	}

	.item-headImg {
		width: 100rpx;
		height: 100rpx;
		border: 1rpx solid #DEDEDE;
		margin-left: auto;
		border-radius: 50%;
	}

	.icon-image {
		margin-left: 20rpx;
		width: 17rpx;
		min-width: 17rpx;
		height: 30rpx;
	}

	.item-right {
		margin-left: auto;
		padding: 4rpx 0;
	}

	.item-right.introduction {
		padding: 20rpx 0;
	}

	.comment-stars {
		width: 28rpx;
		height: 26rpx;
		margin-right: 6rpx;
	}

	.selected-item {
		box-sizing: border-box;
		height: 56rpx;
		line-height: 56rpx;
		padding: 0 20rpx;
		margin-left: 20rpx;
		max-width: 550rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		font-size: 24rpx;
		font-weight: 500;
		color: #222222;
		background: #F2F2F2;
		border-radius: 4rpx;
	}

	.picture {
		width: 120rpx;
		height: 68rpx;
	}

	.item-right-lable {
		font-size: 24rpx;
		font-weight: 500;
		color: #9A9A9A;
	}




	/* 国家选择样式 */

	.van-popup--right.van-popup--round {
		border-radius: 20rpx 0 0 20rpx !important;
	}

	.select-content-top {
		padding: 26rpx 0;
		margin-left: 20rpx;
		height: 90rpx;
	}

	.type-name {
		font-size: 28rpx;
		font-weight: bold;
		color: #222;
	}

	.select-style {
		margin-left: auto;
		font-size: 24rpx;
		font-weight: 500;
		color: #999;
		margin-right: 20rpx;
	}

	.categroy-left {
		width: 100%;
		height: 900rpx;
		border-right: 1px solid rgba(221, 221, 221, 1);
		box-sizing: border-box;
		position: relative;
	}

	.indexes {
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		width: auto;
		right: 0;
		z-index: 50;
		overflow-y: visible;
		display: flex;
	}

	.indexes>view {
		overflow-y: visible;
		margin: auto;
	}

	.indexes>view>view {
		width: auto;
		padding: 4rpx 24rpx;
		font-weight: 500;
		color: #222;
		text-align: center;
		font-size: 24rpx;
	}

	.textName {
		position: fixed;
		top: 40%;
		left: 44%;
		z-index: 49;
		display: flex;
	}

	.textName>view {
		border-radius: 50%;
		display: flex;
		margin: auto;
		width: 100rpx;
		height: 100rpx;
		background-color: #15a05e;
	}

	.textName>view>view {
		margin: auto;
		width: auto;
		height: auto;
		font-size: 40rpx;
		color: white;
	}

	.indexesName {
		padding-left: 22rpx;
		height: 54rpx;
		line-height: 54rpx;
		background: #F5F5F5;
	}

	.cancle-button {
		position: fixed;
		bottom: 0;
		background: #ffffff;
		height: 100rpx;
		border-top: 1rpx solid #E5E5E5;
		width: 100%;
		padding: 0 36rpx;
		line-height: 100rpx;
		text-align: center;
		font-size: 28rpx;
		font-weight: 500;
		color: #222222;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
	}

	.user {
		margin-left: 50rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #666666;
		border-bottom: 1rpx solid #E5E5E5;
	}

	.user:last-child {
		border-bottom: none;
	}
</style>
