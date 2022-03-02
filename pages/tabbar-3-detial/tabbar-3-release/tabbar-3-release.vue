<template>
	<view>
		<view class="box_view">
			<view class="text_view">
				<textarea v-model="detail.title" placeholder="添加标题" auto-height placeholder-class="grey" class="text_view"  />
				<picker @change="bindPickerChange" :value="index" :range="selectArray">
					<view class="uni-input">{{selectArray[index]}}</view>
				</picker>
			</view>
			<image src="/static/logo.png" @click="uploadImg" mode=""></image>
		</view>

		<editor class="ql-container" :placeholder="placeholder" :show-img-size="true" :show-img-toolbar="true"
			:show-img-resize="true" @ready="onEditorReady" id="editor" @statuschange="statuschange" @focus="editFocus"
			@blur="editBlur" ref="editot"></editor>
		<view class="tool-view">
			<view class="tool">
				<u-icon size="40rpx" name="/static/img/richEdit/图片.png"></u-icon>
				<u-icon size="40rpx" name="/static/img/richEdit/字体.png"   @click="showMore"></u-icon>
				<u-icon size="40rpx" name="/static/img/richEdit/横线.png"></u-icon>
				<u-icon size="40rpx" name="/static/img/richEdit/撤回.png"></u-icon>
				<u-icon size="40rpx" name="/static/img/richEdit/反撤回.png"></u-icon>
				<u-icon size="40rpx" label="提交"></u-icon>

			</view>
			<view class="font-more" v-if="showMoreTool">
			<u-icon size="40rpx" name="/static/img/richEdit/加粗.png"></u-icon>
			<u-icon size="40rpx" name="/static/img/richEdit/斜体.png"></u-icon>
			<u-icon size="40rpx" name="/static/img/richEdit/字体下划线.png"></u-icon>
			<u-icon size="40rpx" name="/static/img/richEdit/标题.png"></u-icon>
			<u-icon size="40rpx" name="/static/img/richEdit/居中对齐.png"></u-icon>
			<u-icon size="40rpx" name="/static/img/richEdit/右对齐.png"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showMoreTool: false,
				showBold: false,
				showItalic: false,
				showIns: false,
				showHeader: false,
				showCenter: false,
				showRight: false,
				showSettingLayer: false,
				activeColor: '#F56C6C',
				screenHeight: "",
				keyboardFlag: false,

				placeholder: '开始输入...',
				detail: {
					title: ""
				},
				selectArray: ['科普文', '分享文', '求助文'],
				index: 0,
			}
		},
		onLoad() {

		},
		methods: {
			onEditorReady() {
				uni.createSelectorQuery()
					.in(this)
					.select('.ql-container')
					.fields({
						size: true,
						context: true
					}, res => {
						this.editorCtx = res.context;
						this.editorCtx.setContents({
							html: this.detail.essay
						})
					})
					.exec();

			},
			undo() {
				this.editorCtx.undo()
			},
			bindPickerChange(e) {
				console.log(e)
				this.index = e.detail.value
			},
			statuschange(e) {
				var detail = e.detail;
				this.checkStatus('bold', detail, 'showBold');
				this.checkStatus('italic', detail, 'showItalic');
				this.checkStatus('ins', detail, 'showIns');
				this.checkStatus('header', detail, 'showHeader');
				if (detail.hasOwnProperty('align')) {
					if (detail.align == 'center') {
						this.showCenter = true;
						this.showRight = false;
					} else if (detail.align == 'right') {
						this.showCenter = false;
						this.showRight = true;
					} else {
						this.showCenter = false;
						this.showRight = false;
					}
				} else {
					this.showCenter = false;
					this.showRight = false;
				}
			},
			async editFocus() {
				this.keyboardFlag = true;
			},
			// 富文本框组件移除光标
			editBlur() {
				this.keyboardFlag = false;
			},
			ChooseImage() {
				uni.chooseImage({
					count: 1, //可选择数量，默认9
					sizeType: ['compressed'], //只能上传压缩图
					sourceType: ['album', 'camera'], //从相册选择或从使用相机
					success: async (res) => {
						if (res.tempFiles[0].size > 10 * 1024 * 1000) { //上传图片大小限制
							uni.showToast({
								title: "照片大小不能10MB",
								icon: "none"
							})
							return
						}
						let url = res.tempFilePaths[0];
						try {
							uni.showLoading({
								title: "上传中...",
								mask: true
							})
							let data = await this.$upLoadImg({
								apiName: "uploadHouse",
								filePath: res.tempFilePaths[0],
								name: "file",
							})
							this.imgUrl = data.data.url;
						} catch (e) {
							console.log(e);
						} finally {
							uni.hideLoading();
						}
					}
				})
			},
			uploadImg() {
				let that = this
				uni.chooseImage({
					success(res) {
						console.log(res.tempFilePaths)
						that.imgArr = res.tempFilePaths;
						console.log(that.imgArr)
					}
				})
			},
			showMore() {
				this.showMoreTool = !this.showMoreTool;
				this.editorCtx.setContents()
			},






		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;

	}

	.text_view {
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		width: 325rpx; 
	}

	.box_view {
		display: flex;
		flex-direction: row;
	}


	.ql-container {
		line-height: 160%;
		font-size: 34upx;
		width: 100%;
		height: calc(100vh - 450upx);
		overflow-y: auto;
		margin: 20upx auto;
		// position: relative;
		// top:0;
		border: 2upx solid #bbb;
		padding: 20upx 30upx;
		box-sizing: border-box;
		// padding-bottom:600upx;
	}

	.tool-view {
		width: 100vw;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.tool {
		height: 100upx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		background: #eee;
	}

	.font-more {
		position: absolute;
		left: 0;
		height: 100upx;
		bottom: 100upx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		background: rgb(235, 235, 235);
		overflow: hidden;
		transition: all 0.15s;
	}

	.setting-layer {
		position: absolute;
		bottom: 100upx;
		background: #fff;
		width: 250upx;
		right: 20upx;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		border-radius: 8upx;
	}

	.setting-layer .single {
		height: 80upx;
		font-size: 32upx;
		padding: 0 30upx;
		display: flex;
		align-items: center;
		line-height: 80upx;
		flex-direction: row;
		color: #666;
	}

	.setting-layer .single .icon {
		margin-right: 20upx;
	}

	.setting-layer-mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		background: transparent;
	}
</style>
