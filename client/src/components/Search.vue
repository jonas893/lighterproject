<template>
  <v-container fill-height fluid>
    <v-main>
      <v-row justify="center"
        ><v-col align="center"><h1>Wo ist mein Feuerzeug?</h1></v-col></v-row
      >
      <v-row v-if="!lighterData" justify="center" class="align-self-start">
        <v-col class="col-auto">
          <v-text-field
            outlined
            label="Feuerzeug ID"
            v-model="searchId"
            required
          ></v-text-field>
        </v-col>
        <v-col class="col-auto">
          <v-btn elevation="2" outlined x-large @click="submit">
            SUCHEN
          </v-btn>
        </v-col>
      </v-row>

      <Map
        :lighterData="lighterData"
        :api_url="api_url"
        v-if="lighterData"
        @my-event="reset"
      />
    </v-main>
  </v-container>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

//Axios aufrufen
Vue.use(VueAxios, axios);

import Map from "./Map";

export default {
  name: "Search",
  components: {
    Map,
  },

  data: function() {
    return {
      searchId: "",
      lighterData: undefined,
      api_url: "http://localhost:3000/lighter",
      message: undefined,
    };
  },
  watch: {
    $route(data) {
      if (
        data == undefined ||
        data == null ||
        (data.query.id == undefined && data.query.id == "") ||
        this.$route.query.id == null
      )
        return;
      this.searchLighter(data.query.id);
    },
  },
  methods: {
    submit: function() {
      if (this.searchId == null || this.searchId == "") return;
      this.$router.push({ path: "/", query: { id: this.searchId } });
    },
    searchLighter: function(id) {
      axios
        .get(this.api_url + "/" + id)
        .then((response) => {
          this.lighterData = response.data;
          this.message = undefined;
          console.log(response);
        })
        .catch((error) => {
          this.message = error;
          console.log(error);
        });
    },

    reset: function() {
      this.lighterData = undefined;
      this.searchId = "";
      this.$router.replace({});
      this.message = undefined;
    },
  },
  created() {
    console.log(this.$route.query.id);
    if (
      this.$route.query.id == undefined ||
      this.$route.query.id == "" ||
      this.$route.query.id == null
    )
      return;
    this.searchLighter(this.$route.query.id);
  },
};
</script>

<style scoped></style>
