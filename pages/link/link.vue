<template>
	<view>
		<web-view :src="link"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				link:''
			}
		},
		methods: {
			
		},
		onLoad(e){
			this.link = e.link
		}
	}
</script>

<style>

</style>
