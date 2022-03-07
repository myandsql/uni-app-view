<template>
	<view>
		<u-navbar title="编辑文章" @leftClick="leftClick" rightText="提交" @rightClick="showSetting">
		</u-navbar>
		<view class="content">
		</view>
		<view class="box_view">
			<view class="text_view">
				<textarea v-model="title" placeholder="添加标题" auto-height placeholder-class="grey" class="text_view" />
				<picker @change="bindPickerChange" :value="index" :range="selectArray">
					<view class="uni-input">{{selectArray[index]}}</view>
				</picker>
			</view>
			<view class="image_view" @click="onShowSheet">
				<image v-if="showCover" :src="coverUrl" mode="aspectFit"></image>
				<u-icon v-else name="/static/img/拍照.png" class="image_view_icon" size="120rpx" label="封面"
					labelPos="bottom"></u-icon>
			</view>
		</view>

		<editor class="ql-container" :placeholder="placeholder" :show-img-size="true" :show-img-toolbar="true"
			:show-img-resize="true" @ready="onEditorReady" id="editor" @statuschange="statuschange" @focus="editFocus"
			@blur="editBlur" ref="editot"></editor>
		<view class="tool-view">
			<view class="tool">
				<u-icon size="40rpx" name="/static/img/richEdit/图片.png" @click="ChooseImageInsert"></u-icon>
				<u-icon size="40rpx" name="/static/img/richEdit/字体.png" @click="showMore"></u-icon>
				<u-icon size="40rpx" name="/static/img/richEdit/横线.png" @click="insertDivider"></u-icon>
				<u-icon size="40rpx" name="/static/img/richEdit/撤回.png" @click="undo"></u-icon>
				<u-icon size="40rpx" name="/static/img/richEdit/反撤回.png" @click="redo"></u-icon>
				<u-icon size="40rpx" label="提交" @click="showSetting"></u-icon>

			</view>
			<view class="font-more" v-if="showMoreTool">
				<u-icon size="40rpx" :name="BoldfaceSrc" @click="setBold">
				</u-icon>
				<u-icon size="40rpx" :name="ItalicSrc" @click="setItalic"></u-icon>
				<u-icon size="40rpx" :name="UnderlineSrc" @click="setIns"></u-icon>
				<u-icon size="40rpx" :name="HeaderSrc" @click="setHeader"></u-icon>
				<u-icon size="40rpx" :name="CentetSrc" @click="setCenter"></u-icon>
				<u-icon size="40rpx" :name="RightSrc" @click="setRight"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	import api from "utils/apis.js"
	export default {
		data() {
			return {
				BoldfaceSrc: "/static/img/richEdit/Bold.png",
				ItalicSrc: "/static/img/richEdit/斜体.png",
				UnderlineSrc: "/static/img/richEdit/下划线.png",
				HeaderSrc: "/static/img/richEdit/标题.png",
				CentetSrc: "/static/img/richEdit/居中对齐.png",
				RightSrc: "/static/img/richEdit/右对齐.png",
				coverUrl: '',
				showCover: false,
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
				title: '',
				placeholder: '开始输入...',
				selectArray: ['科普文', '分享文', '求助文'],
				index: 0,
				changeAvatarOptions: [{
					name: '拍照',
					method: 'onChooseImage',
					sourceType: 'camera'
				}, {
					name: '从相册选择',
					method: 'onChooseImage',
					sourceType: 'album'
				}],
			}
		},
		onLoad() {

		},
		methods: {
			onEditorReady(e) {
				uni.createSelectorQuery()
					.in(this)
					.select('.ql-container')
					.fields({
						size: true,
						context: true
					}, res => {
						this.editorCtx = res.context;
						// this.editorCtx.setContents({
						// 	// html: this.detail.essay
						// })
					})
					.exec();

			},
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
			async ChooseImageInsert() {
				uni.chooseImage({
					success: res => {
						// console.log(res.tempFilePaths)
						for (let j = 0, len = res.tempFilePaths.length; j < len; j++) {
							//console.log(res.tempFilePaths[j])
							this.uploadImage(res.tempFilePaths[j])
						}


					}
				});
			},
			async uploadImage(value) {
				//console.log(value)
				const res = await api.uploadFile({
					url: '/access/UploadImage',
					tempFilePath: value,
				})
				if (res.code == 1) {
					this.editorCtx.insertImage({
						src: res.data.imageUrl, // 此处需要将图片地址切换成服务器返回的真实图片地址
						alt: '图片',
						success: function(e) {
							console.log("插入图片成功")
						}
					});

				}
			},

			//上传文件
			async uploadMultiPics(value) {
				const res = await api.uploadFile({
					url: '/access/UploadImage',
					tempFilePath: value,
				})

				if (res.code == 1) {
					this.coverUrl = res.data.imageUrl
					console.log(res.data.imageUrl)
					this.showCover = true
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: "上传成功"
					})

				}
			},
			showMore() {
				this.showMoreTool = !this.showMoreTool;
				this.editorCtx.setContents()
			},
			setBold() {
				this.showBold = !this.showBold;
				this.editorCtx.format('bold');
				if (this.BoldfaceSrc == "/static/img/richEdit/Bold.png") {
					this.BoldfaceSrc = "/static/img/richEdit/isBold.png"
				} else {
					this.BoldfaceSrc = "/static/img/richEdit/Bold.png"
				}
			},
			// 富文本框内容斜体展示
			setItalic() {
				this.showItalic = !this.showItalic;
				this.editorCtx.format('italic');
				if (this.ItalicSrc == "/static/img/richEdit/斜体.png") {
					this.ItalicSrc = "/static/img/richEdit/已斜体.png"
				} else {
					this.ItalicSrc = "/static/img/richEdit/斜体.png"
				}
			},
			setIns() {
				this.showIns = !this.showIns;
				this.editorCtx.format('ins');
				if (this.UnderlineSrc == "/static/img/richEdit/下划线.png") {
					this.UnderlineSrc = "/static/img/richEdit/已下划线.png"
				} else {
					this.UnderlineSrc = "/static/img/richEdit/下划线.png"
				}
			},
			setHeader() {
				this.showHeader = !this.showHeader;
				this.editorCtx.format('header', this.showHeader ? 'H2' : false);
				if (this.HeaderSrc == "/static/img/richEdit/标题.png") {
					this.HeaderSrc = "/static/img/richEdit/已标题.png"
				} else {
					this.HeaderSrc = "/static/img/richEdit/标题.png"
				}
			},
			checkStatus(name, detail, obj) {
				if (detail.hasOwnProperty(name)) {
					this[obj] = true;
				} else {
					this[obj] = false;
				}
			},
			leftClick() {
				console.log("leftClick")
				uni.navigateBack()
			},
			// 富文本框组件内容居中展示
			setCenter() {
				this.showCenter = !this.showCenter;
				this.editorCtx.format('align', this.showCenter ? 'center' : false);

				if (this.CentetSrc == "/static/img/richEdit/居中对齐.png") {
					this.CentetSrc = "/static/img/richEdit/已居中对齐.png"
					this.RightSrc = "/static/img/richEdit/右对齐.png"
				} else {
					this.CentetSrc = "/static/img/richEdit/居中对齐.png"
				}
			},
			// 富文本框组件内容靠右展示
			setRight() {
				this.showRight = !this.showRight;
				this.editorCtx.format('align', this.showRight ? 'right' : false);
				if (this.RightSrc == "/static/img/richEdit/右对齐.png") {
					this.RightSrc = "/static/img/richEdit/已右对齐.png"
					this.CentetSrc = "/static/img/richEdit/居中对齐.png"
				} else {
					this.RightSrc = "/static/img/richEdit/右对齐.png"
				}
			},
			insertDivider() {
				this.editorCtx.insertDivider();
			},
			redo() {
				this.editorCtx.redo();
			}, // 提交信息
			async showSetting() {
				if (!this.title || !this.coverUrl) {
					uni.showToast({
						title: "请补全信息",
						icon: "none"
					})
					return;
				}
				this.editorCtx.getContents({
					success: (data) => {
						this.myContent = JSON.stringify(data);
					}
				})

				uni.showModal({
					title: '确定提交吗？',
					confirmText: "确定提交",
					confirmColor: "#FF7424",
					success: res => {
						if (res.confirm) {
							console.log("yes")
							this.uploadArticles({
								title: this.title,
								type: this.index,
								cover: this.coverUrl,
								content: this.myContent
							})
						} else {
							console.log("no")
						}
					},

				});
			},
			async uploadArticles(value) {
				console.log(value)
				const res = await api.request({
					method: 'POST',
					url: '/access/UploadArticles',
					data: value,
				})
				if (res.code == 1) {
					console.log("yes")
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: "提交成功"
					})
					uni.switchTab({
						url: '../../tabbar/tabbar-1/tabbar-1'
					});
				}
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
		align-items: center;
		width: 475rpx;
		height: 300rpx;
	}

	.box_view {

		display: flex;
		flex-direction: row;
		margin-top: 80rpx;
	}

	.image_view {
		display: flex;
		width: 275rpx;
		height: 300rpx;
		align-items: center;
		justify-content: center;
		background-color: #DADBDE;
		align-items: center
	}

	.image_view_icon {
		display: flex;
		margin-top: 80rpx;

	}



	.ql-container {
		line-height: 160%;
		font-size: 34upx;
		width: 100%;
		height: calc(100vh - 620rpx);
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
