<template>
	<view class="forget">

		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<view class="tips">若你忘记了密码，可在此重置新密码。</view>
				<wInput v-model="emailData" type="text"  placeholder="请输入邮箱" @blur="checkEmail"></wInput>
				<wInput v-model="passData" type="password"  placeholder="请输入新密码" isShowPass></wInput>

				<wInput v-model="verCode" type="number"  placeholder="验证码" isShowCode codeText="获取重置码"
					setTime="30" ref="runCode" @setCode="getVerCode()"></wInput>
			</view>

			<wButton class="wbutton" text="重置密码" :rotate="isRotate" @click.native="startRePass()"></wButton>

		</view>
	</view>
</template>

<script>
	let _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	import APIS from "utils/http.js"
	export default {
		data() {
			return {
				emailData: "", //电话
				passData: "", //密码
				verCode: "", //验证码
				isRotate: false, //是否加载旋转
			}
		},
		components: {
			wInput,
			wButton
		},
		mounted() {
			_this = this;
		},
		methods: {
			getVerCode() {
				//获取验证码
				if (!this.emailFormat) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '邮箱格式不对'
					});
					return;
				}
				APIS.forgetPassword(this.emailData)
				console.log("获取验证码")

				this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）


			},
			startRePass() {
				//重置密码
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
			   
				if (this.passData.length < 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '密码太短了'
					});
					return false;
				}
				APIS.resetPassword({email:this.emailData,password:this.passData,captcha:this.verCode })
				console.log("重置密码成功")
				_this.isRotate = true
			},
			checkEmail() {
				console.log("checkEmail")
				if (RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/)
					.test(this.emailData)) {
					this.emailFormat = true
				} else {
					this.emailFormat = false
				}
			}

		}
	}
</script>

<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
</style>
