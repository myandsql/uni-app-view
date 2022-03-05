<template>
	<view class="media-item" v-if="itemData.title" @click="click">
		<view class="main">
			<text class="media-title media-title2">{{itemData.title}}</text>
			<view v-if="itemData.image_url" class="image-section flex-row image-section-left">
				<image class="image-list1 image-list2" :src="itemData.image_url"></image>
			</view>
		</view>
		<view class="media-foot flex-row">
			<view class="media-info flex-row">
				<text class="info-text">{{itemData.source}}</text>
				<text class="info-text">{{itemData.comment_count}}条评论</text>
				<text class="info-text">{{itemData.vote_count}}条投票</text>
				<text class="info-text">{{itemData.dateTime}}</text>
			</view>
		</view>
		<view class="media-item-line" style="position: absolute;"></view>
	</view>
</template>

<script>
	export default {
		props: {
			itemData: {
				type: Object,
				default: () => {}
			}
		},
		methods: {
			click() {
				this.$emit('click');
			},
		}
	}
</script>

<style scoped>
	.main {
		flexDirection: row-reverse;
	}

	.flex-row {
		flex-direction: row;
	}

	.flex-col {
		flex-direction: column;
	}

	.list-cell {
		padding: 0 30upx;
	}

	.uni-list-cell-hover {
		background-color: #eeeeee;
	}

	.media-item {
		position: relative;
		flex: 1;
		flex-direction: column;
		padding: 20upx 30upx 21upx 30upx;
	}

	.media-item-line {
		position: absolute;
		left: 30upx;
		right: 30upx;
		bottom: 0;
		height: 1upx;
		background-color: #ebebeb;
	}

	.media-image-right {
		flex-direction: row;
	}

	.media-image-left {
		flex-direction: row-reverse;
	}

	.media-title {
		flex: 1;
	}

	.media-title {
		lines: 3;
		text-overflow: ellipsis;
		font-size: 30upx;
		color: #555555;
	}

	.media-title2 {
		flex: 1;
		margin-top: 6upx;
		line-height: 40upx;
	}

	.image-section {
		margin-top: 20upx;
		flex-direction: row;
		justify-content: space-between;
	}

	.image-section-right {
		margin-top: 0upx;
		margin-left: 10upx;
		width: 225upx;
		height: 146upx;
	}

	.image-section-left {
		margin-top: 0upx;
		margin-right: 10upx;
		width: 225upx;
		height: 146upx;
	}

	.image-list1 {
		width: 690upx;
		height: 481upx;
	}

	.image-list2 {
		width: 225upx;
		height: 146upx;
	}

	.image-list3 {
		width: 225upx;
		height: 146upx;
	}

	.media-info {
		flex-direction: row;
		align-items: center;
	}

	.info-text {
		margin-right: 20upx;
		color: #999999;
		font-size: 24upx;
	}

	.media-foot {
		margin-top: 25upx;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.close-view {
		position: relative;
		align-items: center;
		flex-direction: row;
		width: 40upx;
		height: 30upx;
		line-height: 30upx;
		border-width: 1upx;
		border-style: solid;
		border-color: #aaaaaa;
		border-radius: 4px;
		justify-content: center;
		text-align: center;
	}

	.close-l {
		position: absolute;
		width: 18upx;
		height: 1upx;
		background-color: #aaaaaa;
	}

	.close-h {
		transform: rotate(45deg);
	}

	.close-v {
		transform: rotate(-45deg);
	}
</style>

