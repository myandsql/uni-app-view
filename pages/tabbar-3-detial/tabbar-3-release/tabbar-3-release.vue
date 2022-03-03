<template>
	<view>
		<u-navbar title="编辑文章" @leftClick="leftClick" rightText="提交">
		</u-navbar>
		<view class="content">
		</view>
		<view class="box_view">
			<view class="text_view">
				<textarea v-model="detail.title" placeholder="添加标题" auto-height placeholder-class="grey"
					class="text_view" />
				<picker @change="bindPickerChange" :value="index" :range="selectArray">
					<view class="uni-input">{{selectArray[index]}}</view>
				</picker>
			</view>
			<view class="image_view">
				<u-icon name="/static/img/拍照.png" class="image_view_icon" size="120rpx" label="封面" labelPos="bottom"
					@click="uploadImg"></u-icon>
			</view>
		</view>

		<editor class="ql-container" :placeholder="placeholder" :show-img-size="true" :show-img-toolbar="true"
			:show-img-resize="true" @ready="onEditorReady" id="editor" @statuschange="statuschange" @focus="editFocus"
			@blur="editBlur" ref="editot"></editor>
		<view class="tool-view">
			<view class="tool">
				<u-icon size="40rpx" name="/static/img/richEdit/图片.png"></u-icon>
				<u-icon size="40rpx" name="/static/img/richEdit/字体.png" @click="showMore"></u-icon>
				<u-icon size="40rpx" name="/static/img/richEdit/横线.png" @click="insertDivider" ></u-icon>
				<u-icon size="40rpx" name="/static/img/richEdit/撤回.png" @click="undo"></u-icon>
				<u-icon size="40rpx" name="/static/img/richEdit/反撤回.png" @click="redo"></u-icon>
				<u-icon size="40rpx" label="提交"></u-icon>

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
	export default {
		data() {
			return {
				BoldfaceSrc: "/static/img/richEdit/加粗.png",
				ItalicSrc: "/static/img/richEdit/斜体.png",
				UnderlineSrc: "/static/img/richEdit/下划线.png",
				HeaderSrc: "/static/img/richEdit/标题.png",
				CentetSrc: "/static/img/richEdit/居中对齐.png",
				RightSrc: "/static/img/richEdit/右对齐.png",
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
			onEditorReady(e) {
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
			async chooseImage(type) {
					let _this = this;
					console.log(_this.editorCtx);
					uni.chooseImage({
						count: 1, //最多可以选择的图片张数，默认9
						sizeType: ['original', 'compressed'], //original 原图，compressed 压缩图，默认二者都有
						sourceType: ['album', 'camera'], //album 从相册选图，camera 使用相机，默认二者都有
						success: (respone) => {
							_this.$request.urlRequest(
								'/gate/oss/token', {},
								'GET',
								(res) => {
									if (res.code == 200) {
									let data = res.result;
									let env = {
										uploadImageUrl: 'https://58d.oss-cn-hangzhou.aliyuncs.com/', // 默认存在根目录，可根据需求改
										AccessKeySecret: data.AccessKeySecret, // AccessKeySecret 去你的阿里云上控制台上找
										OSSAccessKeyId: data.AccessKeyId, // AccessKeyId 去你的阿里云上控制台上找
										stsToken: data.SecurityToken,
										timeout: 87600 //这个是上传文件时Policy的失效时间
									}
									let dir = 'images/';
									let filePath = respone.tempFilePaths[0];
									const aliyunFileKey = dir + new Date().getTime() + Math.floor(Math.random() * 150) + '.png';
									const aliyunServerURL = env.uploadImageUrl; //OSS地址，需要https
									const accessid = env.OSSAccessKeyId;
									const policyBase64 = _this.getPolicyBase64(env);
									const signature = _this.getSignature(policyBase64, env); //获取签名
									const stsToken = env.stsToken;
			
									let param = {
										'key': aliyunFileKey,
										'policy': policyBase64,
										'OSSAccessKeyId': accessid,
										'signature': signature,
										'success_action_status': '200',
										'x-oss-security-token': stsToken,
										'stsToken': stsToken,
									};
			
									uni.uploadFile({
										filePath: filePath, //要上传文件资源的路径
										name: 'file', //必须填file
										formData: param,
										success: (res) => {
											if(type){
												_this.detail.imageUrl = aliyunServerURL + aliyunFileKey;
												return;
											}
											_this.editorCtx.insertImage({
												src: aliyunServerURL + aliyunFileKey, // 此处需要将图片地址切换成服务器返回的真实图片地址
												alt: '图片',
												width:"320upx",
												mode:'widthFix',
												success: function(e) {}
											});
										},
										fail: (err) => {
											// _this.msg.push(JSON.stringify(err));
											// err.wxaddinfo = aliyunServerURL;
											// failc(err);
										},
									})
								}
							}
						)
					}
				});
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
			setBold() {
				this.showBold = !this.showBold;
				this.editorCtx.format('bold');
				if (this.BoldfaceSrc == "/static/img/richEdit/加粗.png") {
					this.BoldfaceSrc = "/static/img/richEdit/已加粗.png"
				} else {
					this.BoldfaceSrc = "/static/img/richEdit/加粗.png"
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
			leftClick(){
				console.log("leftClick")
				uni.navigateBack()
			},
			// 富文本框组件内容居中展示
			setCenter() {
				this.showCenter = !this.showCenter;
				this.editorCtx.format('align', this.showCenter ? 'center' : false);
				
				if (this.CentetSrc == "/static/img/richEdit/居中对齐.png") {
					this.CentetSrc = "/static/img/richEdit/已居中对齐.png"
					this.RightSrc  = "/static/img/richEdit/右对齐.png"
				} else {
					this.CentetSrc = "/static/img/richEdit/居中对齐.png"
				}
			},
			// 富文本框组件内容靠右展示
			setRight() {
				this.showRight = !this.showRight;
				this.editorCtx.format('align', this.showRight ? 'right' : false);
				if (this.RightSrc == "/static/img/richEdit/右对齐.png") {
					this.RightSrc  = "/static/img/richEdit/已右对齐.png"
					this.CentetSrc = "/static/img/richEdit/居中对齐.png"
				} else {
					this.RightSrc  = "/static/img/richEdit/右对齐.png"
				}
			},
			insertDivider() {
				this.editorCtx.insertDivider();
			},
			redo() {
				this.editorCtx.redo();
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
	.image_view_icon{
		display: flex; 
		margin-top: 80rpx;

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
