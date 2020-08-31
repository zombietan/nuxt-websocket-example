<template>
  <b-table :items="trends"
            :fields="fields"
            small table-variant="active"
            primary-key="name"
            :tbody-transition-props="transProps">
    <template v-slot:cell(index)="data">
      {{ getRank(data.index) }}
    </template>

    <template v-slot:cell(name)="data">
      <a :href="`${data.item.url}`">{{data.value}}</a>
    </template>
  </b-table>  
</template>

<script>
export default {
  name: "RankTable",
  props: {
    trends: {
      type: Array
    },
    prevTrendNames: {
      type: Array
    },
    rankFirst: {
      type: Number
    }
  },
  data: () => ({
    transProps: {
      name: 'v'
    },
    fields: [
      {key: 'index', label: 'No.', isRowHeader: true, thClass: 'text-info'},
      {key: 'name', label: 'word', thClass: 'text-info'},
      {key: 'tweet_volume', label: 'volume', thClass: 'text-info'},
      {key: 'isNew', label: 'isNew', tdClass: 'text-info', thClass: 'text-info', formatter: 'isNewFormatter'}
    ],
  }),
  methods: {
    isNewFormatter: function (value, key, item) {
      if (this.prevTrendNames.length === 0) {
        return null
      }
      return this.prevTrendNames.some(v => v === item.name) ? null : "new"
    },
    getRank: function (index) {
      return index + this.rankFirst
    }
  }
}
</script>

<style>
</style>