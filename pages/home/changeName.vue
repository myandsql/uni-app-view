<template>
	<view>
		<u-navbar title="修改昵称" @leftClick="leftClick" rightText="保存" @rightClick="saveName"></u-navbar>
		<view class="content">
			<u-input border="bottom" placeholder="请输入新昵称" v-model="newName" clearable></u-input>
			<!-- <view>"请输入新昵称</view> -->
		</view>
		<view class="tips">来展示下你的个性昵称吧</view>
	</view>
</template>

<script>
	import api from "utils/apis.js"
	export default {
		async onShow() {
			await getApp().$options.getUserInfo();
			this.name = getApp().globalData.userInfo.username;
		},
		data() {
			return {
				name: '',
				newName: ''
			}
		},
		methods: {
			async saveName() {
				console.log(this.newName)
				console.log(this.name)
				if (this.newName != this.name) {
					const res = await api.request({
						method: 'POST',
						url: '/access/ChangeName',
						data: {
							username: this.newName
						},
					})
					if (res.code == 1) {
						getApp().globalData.userInfo.username = this.newName
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: "保存成功"
						})
						uni.navigateBack()
					}
				}
			},

			leftClick() {
				console.log("leftClick")
				uni.navigateBack()
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		margin: 80rpx auto 0 auto;
		flex-direction: column;
		width: 710rpx;
		height: 80rpx;
		border-bottom: 1rpx solid #E5E5E5;
	}
	.tips{
		margin: 20rpx 20rpx 0 20rpx;
		color: #8E8E8E;
		margin-left: 20rpx;
	}
</style>
