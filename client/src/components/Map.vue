<template>
  <v-container align="center" fluid class="align-self-start">
    <v-row class="mt-2"
      ><v-col align="center" justify="center"
        >Dein <strong> {{ lighterData.color }}es</strong> BIC Feuerzeug wurde
        <strong>{{ lighterData.position.length }}</strong> mal gescannt und hat
        bereits über <strong>{{ distance }}</strong> km zurückgelegt. (ID:
        {{ lighterData.id }})</v-col
      ></v-row
    >
    <v-row class="justify-center"
      ><v-col cols="12"
        ><l-map
          :center="center"
          :zoom="zoom"
          class="map"
          ref="map"
          @update:center="centerUpdated"
          @update:zoom="zoomUpdated"
          :options="leafletMapOptions"
        >
          <l-tile-layer :options="tileOptions" :url="url"></l-tile-layer>
          <l-marker
            v-for="marker in lighterData.position"
            :key="marker.id"
            :lat-lng="marker"
          ></l-marker>
          <l-polyline :lat-lngs="lighterData.position" /> </l-map></v-col
    ></v-row>
    <v-row
      ><v-col align="center"
        ><v-btn outlined x-large @click="addLighterPosition"
          >Deine Position hinzufügen</v-btn
        >
      </v-col></v-row
    >
    <v-row
      ><v-col align="center">
        <v-btn outlined x-large @click="reset">Neue Suche</v-btn></v-col
      ></v-row
    >

    <v-row v-if="ownPosition"
      ><v-col align="center">Deine Position: {{ ownPosition }}</v-col></v-row
    >
  </v-container>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

import { LMap, LTileLayer, LMarker, LPolyline } from "vue2-leaflet";
import { Icon } from "leaflet";

import VueGeolocation from "vue-browser-geolocation";

//import getDistance from "geolib/es/getDistance";
import * as geolib from "geolib";

Vue.use(VueAxios, axios);
Vue.use(VueGeolocation);
Vue.config.productionTip = false;

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  name: "Map",
  props: ["lighterData", "api_url"],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
  },

  data: function() {
    return {
      searchId: "",
      url:
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
      center: [47.31322, -1.319482],
      zoom: 2,
      distance: null,
      message: undefined,
      ownPosition: undefined,
      leafletMapOptions: {
        closePopupOnClick: false,
        doubleClickZoom: "center",
      },
      tileOptions: {
        minZoom: 2,
        minNativeZoom: 2,
      },
    };
  },
  watch: {
    lighterData: function() {
      this.refresh();
    },
  },
  methods: {
    centerUpdated(center) {
      this.center = center;
    },
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    getLighterDistance() {
      this.distance = 0;
      for (var i = 0; i < this.lighterData.position.length - 1; i++) {
        this.distance += geolib.getDistance(
          {
            latitude: this.lighterData.position[i].lat,
            longitude: this.lighterData.position[i].lng,
          },
          {
            latitude: this.lighterData.position[i + 1].lat,
            longitude: this.lighterData.position[i + 1].lng,
          }
        );
      }
      this.distance /= 1000;
    },
    addLighterPosition() {
      if (this.ownPosition) return;

      this.$getLocation({
        enableHighAccuracy: true, //defaults to false
        timeout: Infinity, //defaults to Infinity
        maximumAge: 1, //defaults to 0
      }).then((coordinates) => {
        var marker = {
          lat: coordinates.lat,
          lng: coordinates.lng,
        };
        this.lighterData.position.push(marker);
        this.ownPosition = marker;
        this.saveLighterPosition();
      });
    },
    saveLighterPosition() {
      var vm = this;
      console.log(this.lighterData);
      axios
        .patch(vm.api_url + "/" + vm.lighterData.id, vm.lighterData)
        .then(function() {
          vm.refresh();
        })
        .catch(function(error) {
          console.log("Error! Could not reach the API. " + error);
        });
    },
    refresh() {
      console.log("refresh");
      this.getLighterDistance();
    },
    reset() {
      this.$emit("my-event");
    },
    test() {},
  },

  mounted() {
    this.refresh();
  },
};
</script>

<style scoped>
.map {
  z-index: 0;
  height: 600px;
  overflow: hidden;
}
</style>
