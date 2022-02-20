<template>
	<view class="content">
		<u-avatar :src="headSrc"  randomBgColor ></u-avatar>
		<view width="auto" lineHeight="auto">{{name}}</view>
	</view>
		
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				headSrc:'/static/img/boy.png',
				name:"测试员",
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 400upx;
		margin-top: 80upx;
	}
</style>
