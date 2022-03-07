<template>
	<view>
		<view class="u-page">
			<u-list @scrolltolower="scrolltolower">
					<u--text text="我的关注" calss="text-view" align="center" size=21></u--text>
				<u-list-item v-for="(item, index) in indexList" :key="index">

					<u-cell :title="item.name">

						<u-avatar slot="icon" shape="square" size="35" :src="item.url"
							customStyle="margin: -3px 5px -3px 0"></u-avatar>
						<u-button slot="value" class="u-slot-value" :text="item.text" @click="changeFollow(item.index)"></u-button>
					</u-cell>

				</u-list-item>
			</u-list>
		</view>
	</view>
</template>

<script>
	import api from "utils/apis.js"
	export default {
		data() {
			return {
				indexList: [],
			}
		},
		async onLoad() {
			const res = await api.request({
				url: '/access/GetFollows',
			})
			console.log(res)
			console.log(res.data.length)
			if (res.code == 1) {
				for (let i = 0; i < res.data.length; i++) {
					this.indexList.push({
						url: res.data[i].avatars,
						name: res.data[i].username,
						text: "已关注"
					})
				}
			}
			// this.loadmore()
		},
		methods: {
			scrolltolower() {
				// this.loadmore()
			},
			 changeFollow(e) {
				 
				console.log(e)
			}

		},
	}
</script>
<style lang="scss" scoped>
	.u-slot-value {
		width: 120rpx;
	}

	.text-view {
		position: sticky;
			/* #ifdef H5 */
			top: 44px;
			/* #endif */
			/* #ifndef H5 */
			top: 0;
			/* #endif */
			z-index: 999;
			flex: 1;
			flex-direction: column;
			overflow: hidden;
			background-color: #ffffff;

	}
</style>
