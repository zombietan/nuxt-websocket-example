<template>
  <b-container fluid>
    <h5>
      <font-awesome-icon :class="{ vanishIn: isActive, magictime: isActive}" class="text-info" :icon="['fab', 'twitter']"/>
      トレンド
        <small class="float-right text-muted">30秒間隔で更新</small>
    </h5>
    <b-row>
      <b-col sm="6">
        <RankTable :trends="upTo25" :prevTrendNames="beforeUpdateTrendNames" :rankFirst="1"/>
      </b-col>
      <b-col sm="6">
        <RankTable :trends="upTo50" :prevTrendNames="beforeUpdateTrendNames" :rankFirst="26"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import socket from '~/plugins/socket.io.js'
import RankTable from '@/components/RankTable.vue'

export default {
  components: {
    RankTable
  },

  asyncData () {
    return new Promise(resolve => {
      socket.emit('init', trends => resolve( { trends } ))
    })
  },

  data: () => ({
    beforeUpdateTrendNames: [],
    isActive: false
  }),

  beforeMount() {
    socket.on('trends', (trends) => {
      this.flashTwitterLogo()
      this.beforeUpdateTrendNames = this.trends.map(trend => trend.name)
      this.trends.splice(0, this.trends.length)
      this.trends = this.trends.concat(trends)
    })
  },

  computed: {
    upTo25: function() {
      return this.trends.slice(0, 25)
    },
    upTo50: function() {
      return this.trends.slice(25, 50)
    },
  },

  methods: {
    flashTwitterLogo: async function() {
      this.isActive = true
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.isActive = false
    },
  }
}
</script>

<style>
</style>
