<template>
	<view >
		<view class="head_content">
		<u-avatar :src="headSrc" size=160upx></u-avatar>
		<view width="auto" lineHeight="auto">{{name}}</view>
		</view>
		<u-toast ref="uToast" />
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
			click(name) {
                this.$refs.uToast.success(`点击了第${name}个`)
            }
		}
	}
</script>

<style>
	.content {
		display: flex;
		text-align: center;
		height: 400upx;
		margin-top: 200upx;
	}
	.head_content {
		display:felx;
		height: 300rpx;
		width: 750rpx;
		align-items: center;
		justify-content: center;
		background-color: #A9E08F;
	}
	.image {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 0upx;
		width: 150upx;
		hight: 150upx;
	}
	 .grid-text {
	        font-size: 14px;
	        color: #909399;
	        padding: 10rpx 0 20rpx 0rpx;
	        /* #ifndef APP-PLUS */
	        box-sizing: border-box;
	        /* #endif */
	    }
	
</style>
