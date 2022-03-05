<template>
	<view class="tui-tabs">
		<scroll-view id="tab-bar" scroll-x scroll-with-animation class="tui-scroll-h" :show-scrollbar="false" :scroll-into-view="scrollInto">
			<view v-for="(tab, index) in tabBars" :key="tab.id" class="tui-tab-item" :id="tab.id" :data-current="index" @click="tabClick">
				<text class="tui-tab-item-title" :class="{ 'tui-tab-item-title-active': tabIndex == index }">{{ tab.name }}</text>
			</view>
		</scroll-view>
		<view class="tui-line-h"></view>
		<swiper :current="tabIndex" class="tui-swiper-box" :duration="300" @change="tabChange" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
			<swiper-item class="tui-swiper-item" v-for="(tab, index1) in newsList" :key="index1">
				<scroll-view
					class="tui-scroll-v"
					:refresher-enabled="refresherEnabled"
					:refresher-triggered="tab.refreshing"
					refresher-background="#fafafa"
					enable-back-to-top
					:refresher-threshold="100"
					scroll-y
					@scrolltolower="loadMore(index1)"
					@refresherrefresh="onrefresh"
				>
					<view v-for="(newsitem, index2) in tab.data" :key="newsitem.id">
						<news-item :itemData="newsitem" @close="close(index1, index2)" :lastChild="index2 === tab.data.length - 1" @click="goDetail(newsitem)"></news-item>
					</view>
					<view class="tui-loading-more" v-if="tab.isLoading || tab.pageIndex > 3">
						<text class="tui-loadmore-line" v-if="tab.pageIndex > 3"></text>
						<text class="tui-loading-more-text">{{ tab.loadingText }}</text>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>
<script>
import newsItem from './news-item.vue';

// 缓存最多页数
const MAX_CACHE_PAGEINDEX = 3;
// 缓存页签数量
const MAX_CACHE_PAGE = 3;

const newsData = [
	{
		title: '温故知新老师们这些话要牢记',
		image_url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg?imageView2/3/w/200/h/100/q/90',
		comment_count: 3101,
		vote_count: 2356,
		dateTime: '2020-01-01',
		article_type: 1,
		source: '央视网新闻'
	},
	{
		title: '美国会表决通过新驻华大使 月底有望赴华',
		image_url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg?imageView2/3/w/200/h/100/q/90',
		comment_count: 3102,
		vote_count: 2356,
		dateTime: '2020-01-01',
		article_type: 1,
		source: '央视网新闻'
	},
	{
		title: '哪些专业毕业后收入高?计算机、金融专业排前列金融专业排前列金融专业排前列金融专业排前列金融专业排前列',
		image_url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg?imageView2/3/w/200/h/100/q/90',
		comment_count: 3103,
		vote_count: 2356,
		dateTime: '2020-01-01',
		article_type: 1,
		source: '粤港精英联盟'
	},
	{
		title: '科创板交易系统准备就绪,不存在首批名单',
		image_url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg?imageView2/3/w/200/h/100/q/90',
		comment_count: 3104,
		vote_count: 2356,
		dateTime: '2020-01-01',
		article_type: 1,
		source: '百科故事大全'
	},
	{
		title: '哪些专业毕业后收入高?计算机、金融专业排前列金融专业排前列金融专业排前列金融专业排前列金融专业排前列',
		image_url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg?imageView2/3/w/200/h/100/q/90',
		comment_count: 3103,
		vote_count: 2356,
		dateTime: '2020-01-01',
		article_type: 1,
		source: '粤港精英联盟'
	},
	{
		title: '科创板交易系统准备就绪,不存在首批名单',
		image_url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg?imageView2/3/w/200/h/100/q/90',
		comment_count: 3104,
		vote_count: 2356,
		dateTime: '2020-01-01',
		article_type: 1,
		source: '百科故事大全'
	},
	{
		title: '哪些专业毕业后收入高?计算机、金融专业排前列金融专业排前列金融专业排前列金融专业排前列金融专业排前列',
		image_url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg?imageView2/3/w/200/h/100/q/90',
		comment_count: 3103,
		vote_count: 2356,
		dateTime: '2020-01-01',
		article_type: 1,
		source: '粤港精英联盟'
	},
	{
		title: '科创板交易系统准备就绪,不存在首批名单',
		image_url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg?imageView2/3/w/200/h/100/q/90',
		comment_count: 3104,
		vote_count: 2356,
		dateTime: '2020-01-01',
		article_type: 1,
		source: '百科故事大全'
	},
];

export default {
	components: {
		newsItem
	},
	data() {
		return {
			isIos: false,
			newsList: [],
			cacheTab: [],
			tabIndex: 0,
			tabBars: [],
			scrollInto: '',
			showTips: false,
			navigateFlag: false,
			pulling: false,
			refreshIcon:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRBAMAAABYoVcFAAAAKlBMVEUAAACXl5eZmZmfn5+YmJiXl5eampqZmZmYmJiYmJiZmZmYmJiZmZmZmZl02B9kAAAADXRSTlMAQKAQ0GAsUN+wz5CA21ow0AAAAM5JREFUSMftzLEJAkEQheFR4WzjGji4wC5E0A7E0OgaEIwF4RqwJEEODKcX1114yQ/uhsLtY6Lh57NZ7Dz1heXd27Kwcb+WlQv3Vy1rWcta1rKW/1Q2R8PWt8FYdhPLi79ZLt33KB/hibJzH1E+PaAqRfqAcuMBVSlyMmy1C6hKka0CoCpBAlUJEmgsQQJVCRKoSpBAU0mSaCpJEk0lSSMaS5JG9FuK/IkeQkmSaEjikSSaRpJoHEmiIvOoyCwqMo+KzKMi8+hoZTtte5vDPrSGI5zJ/Z1kAAAAAElFTkSuQmCC'
		};
	},
	onLoad() {
		setTimeout(() => {
			this.tabBars = [
				{
					name: '推荐',
					id: 'hot'
				},
				{
					name: '科普文',
					id: 'yule'
				},
				{
					name: '分享文',
					id: 'sports'
				}
			
			]
			this.init()
		}, 200);
	},
	methods: {
		init() {
			this.newsList = this.randomfn();
		},
		randomfn() {
			let ary = [];
			for (let i = 0, length = this.tabBars.length; i < length; i++) {
				let aryItem = {
					loadingText: '正在加载...',
					refreshing: false,
					refreshText: '',
					data: [],
					isLoading: false,
					pageIndex: 1
				};
				if (i === 0) {
					aryItem.pageIndex = 2;
					aryItem.data = aryItem.data.concat(newsData);
				}
				ary.push(aryItem);
			}
			console.log(ary)
			return ary;
		},
		getList(index, refresh) {
			let activeTab = this.newsList[index];
			let list = newsData || [];
			if (refresh) {
				activeTab.data = [];
				activeTab.loadingText = '正在加载...';
				activeTab.pageIndex = 2;
				activeTab.data = list || [];
			} else {
				activeTab.data = activeTab.data.concat(list);
				activeTab.pageIndex++;
				activeTab.isLoading = false;
				//根据实际修改判断条件
				if (activeTab.pageIndex > 3) {
					activeTab.loadingText = '没有更多了';
				}
			}
		},
		goDetail(e) {
			if (this.navigateFlag) return;
			this.navigateFlag = true;
			uni.navigateTo({
				url: '/pages/template/news/newsDetail/newsDetail'
			});
			setTimeout(() => {
				this.navigateFlag = false;
			}, 200);
		},
		loadMore(e) {
			let activeTab = this.newsList[this.tabIndex];
			if (activeTab.pageIndex < 4 && !activeTab.isLoading) {
				activeTab.isLoading = true;
				setTimeout(() => {
					this.getList(this.tabIndex);
				}, 300);
			}
		},
		tabClick(e) {
			let index = e.target.dataset.current || e.currentTarget.dataset.current;
			this.switchTab(index);
		},
		tabChange(e) {
			let index = e.target.current || e.detail.current;
			this.switchTab(index);
		},
		swiperTransition() {
			this.refresherEnabled = false;
		},
		swiperAnimationfinish() {
			this.refresherEnabled = true;
		},
		switchTab(index) {
			if (this.tabIndex === index) return;
			if (this.newsList[index].data.length === 0) {
				this.getList(index);
			}
			// 缓存 tabId
			if (this.newsList[this.tabIndex].pageIndex > MAX_CACHE_PAGEINDEX) {
				let isExist = this.cacheTab.indexOf(this.tabIndex);
				if (isExist < 0) {
					this.cacheTab.push(this.tabIndex);
					//console.log("cache index:: " + this.tabIndex);
				}
			}

			this.tabIndex = index;
			let scrollIndex = index - 1 < 0 ? 0 : index - 1;
			this.scrollInto = this.tabBars[scrollIndex].id;

			// 释放 tabId
			if (this.cacheTab.length > MAX_CACHE_PAGE) {
				let cacheIndex = this.cacheTab[0];
				this.clearTabData(cacheIndex);
				this.cacheTab.splice(0, 1);
				//console.log("remove cache index:: " + cacheIndex);
			}
		},
		clearTabData(e) {
			this.newsList[e].data.length = 0;
			this.newsList[e].loadingText = '加载更多...';
		},
		onrefresh(e) {
			var tab = this.newsList[this.tabIndex];
			if (tab.refreshing) {
				return;
			}

			tab.refreshing = true;

			setTimeout(() => {
				uni.stopPullDownRefresh();
				this.getList(this.tabIndex, true);
				this.pulling = true;
				tab.refreshing = false;
				uni.showToast({
					title: '刷新成功',
					icon: 'none'
				});
				setTimeout(() => {
					// TODO fix ios和Android 动画时间相反问题
					this.pulling = false;
				}, 500);
			}, 3000);
		},
	},
	onPullDownRefresh() {
		console.log('onPullDownRefresh')
	}
};
</script>

<style>
page {
	width: 100%;
	min-height: 100%;
	display: flex;
	height: 100vh;
}

.tui-tabs {
	flex: 1;
	flex-direction: column;
	overflow: hidden;
	background-color: #fafafa;
}

.tui-scroll-h {
	white-space: nowrap;
	height: 80rpx;
	background-color: #ffffff;
	display: flex;
	flex-direction: row;
	/* #ifdef H5 */
	position: fixed;
	top: 44px;
	left: 0;
	z-index:999;
	/* #endif */
}

.tui-line-h {
	height: 1rpx;
	background-color: #cccccc;
	position: relative;
}

.tui-tab-item {
	display: inline-block;
	padding-left: 34rpx;
	padding-right: 34rpx;
	flex-wrap: nowrap;
}

.tui-tab-item-title {
	color: #555;
	font-size: 30rpx;
	height: 80rpx;
	line-height: 80rpx;
	flex-wrap: nowrap;
	white-space: nowrap;
}

.tui-tab-item-title-active {
	color: #5677fc;
	font-size: 36rpx;
	font-weight: bold;
	border-bottom: 6rpx solid #5677fc;
	text-align: center;
	display: block;
	box-sizing: border-box;
}

.tui-swiper-box {
	height: 100%;
	overflow-y: auto;
	/* #ifdef H5 */
	margin-top: 80rpx;
	/* #endif */
}

.tui-swiper-item {
	flex: 1 !important;
	flex-direction: row;
}

.tui-scroll-v {
	width: 100%;
	height: 100%;
}

.tui-loading-more {
	align-items: center;
	justify-content: center;
	padding-top: 15px;
	padding-bottom: 15px;
	text-align: center;
	position: relative;
}

.tui-loadmore-line {
	border-bottom-width: 1rpx;
	border-bottom-style: solid;
	border-bottom-color: #e5e5e5;
	width: 320rpx;
	position: absolute;
	z-index: -1;
}

.tui-loading-more-text {
	padding-left: 8rpx;
	padding-right: 8rpx;
	font-size: 28rpx;
	line-height: 28rpx;
	background-color: #fafafa;
	text-align: center;
	color: #999;
}
</style>
