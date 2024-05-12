<template>
  <v-row>
  <v-col col="4">

    <v-card>
  <div class="center-div">
  <div>
    <v-spacer style="height: 5vh" ></v-spacer>
    <v-btn icon="mdi-printer" :color="buttonColor" :to="{ name: 'printer' }"></v-btn>
    <v-spacer style="height: 1vh" ></v-spacer>
    <div v-if="isLoading">Loading...</div>
    <div v-if="error" style="color: red;">Error: {{ error }}</div>
    <div v-if="printerData" class="printer-status">

      <v-spacer style="height: 5vh" ></v-spacer>

<!--      <v-card>-->
<!--        <v-card-title flat style="background-color: transparent;">-->
<!--          Printer State-->
<!--        </v-card-title>-->
<!--        <v-card-text>-->
<!--          {{ printerData.state.text }}-->
<!--        </v-card-text>-->
<!--      </v-card>-->


<!--        <v-card>-->
          <div v-for="(value, key) in printerData.state.flags" :key="key">
            <p>{{ key }}: {{ value }}</p>
          </div>
<!--        </v-card>-->




<!--      <v-card>-->
        <v-card-title>
          Temperatures
        </v-card-title>
        <v-card-text>
          <p>Bed: Actual: {{ printerData.temperature.bed.actual }}°C, Target: {{ printerData.temperature.bed.target }}°C</p>
          <p>Tool 0: Actual: {{ printerData.temperature.tool0.actual }}°C, Target: {{ printerData.temperature.tool0.target }}°C</p>
        </v-card-text>
<!--      </v-card>-->




    </div>
    <div v-if="error">
      <br>
    </div>

    <div v-if="isLoading">
    <br>
    </div>

  </div>
  </div>
    </v-card>
  </v-col>

<v-col cols="8">

  <v-card>
    <v-card-title>
      Webcam
    </v-card-title>

    <img
        src="http://192.168.0.178/webcam/?action=stream"
        class="img1"
    >


<!--    <img-->
<!--        src="http://192.168.0.178/webcam/?action=stream"-->
<!--        @error="handleImageError"-->
<!--        class="img1"-->
<!--    >-->

<!--    <img :src="imageLoading ? ../images/NoSignal.jpg : http://192.168.0.178/webcam/?action=stream" />-->


<!--    <img src="http://192.168.0.178/webcam/?action=snapshot" class="img">-->
<!--    single photo-->


  </v-card>

  <v-spacer style="height: 1.5vh" ></v-spacer>

  <v-card>
    <v-card-title>
      Progress
    </v-card-title>
    <v-card-text>
      <v-progress-linear
          :value="printJobProgress.completion"
          color="primary"
          height="20"
          striped>
        <template v-slot:default="{ value }">
          {{ value.toFixed(0) }}%
        </template>
      </v-progress-linear>
      <br>
      <div>File: {{ printJobProgress.fileName }}</div>
      <div>Time Left: {{ printJobProgress.printTimeLeft | formatDuration }}</div>
    </v-card-text>
  </v-card>


</v-col>


</v-row>
</template>

<script>
import axios from 'axios';
import config from "../config";

export default {
  name: "PrinterView",

  data() {
    return {
      printerData: null,
      filesData: null,
      filesHeaders: [
        { text: 'File Name', value: 'display' },
        { text: 'Size (Bytes)', value: 'size' },
        { text: 'Download', value: 'refs', sortable: false }
      ],
      error: null,
      isLoading: false,
      printJobProgress: {
        completion: 0,
        printTimeLeft: 0,
        fileName: '',
      },
      snapshotAttempted: false
    };
  },

  computed: {
    buttonColor() {
      if (this.error) return 'red';
      if (!this.printerData) return 'grey';
      if (this.printerData.state.flags.error) return 'red';
      if (this.printerData.state.flags.printing) return 'yellow';
      if (this.printerData.state.flags.operational) return 'green';
      return 'grey';
    }
  },

  mounted() {
    this.fetchPrinterStatus();
    //this.fetchFiles();
    this.fetchPrintJobProgress();
    setInterval(this.fetchPrinterStatus, 15000);
    setInterval(this.fetchPrintJobProgress, 15000);
    // this.loadImg();
  },

  methods: {
    fetchPrinterStatus() {
      this.isLoading = true;
      this.error = null;
      const url = `http://${config.server}/api/printer`;
      const config1 = {
        headers: {
          'X-Api-Key': config.apiKey
        },
        timeout: 2000
      };
      axios.get(url, config1)
          .then(response => {
            this.printerData = response.data;
            this.isLoading = false;
          })
          .catch(error => {
            this.error = error.message;
            this.isLoading = false;
            console.error("Error fetching printer status:", error);
          });
    },
    // loadImg() {
    //   this.imgURL = config.stream;
    // },
    // fetchFiles() {
    //   this.isLoading = true;
    //   this.error = null;
    //   const url = `http://${config.server}/api/files`;
    //   const config2 = {
    //     headers: {
    //       'X-Api-Key': config.apiKey
    //     },
    //     timeout: 5000
    //   };
    //   axios.get(url, config2)
    //       .then(response => {
    //         this.filesData = response.data;
    //         this.isLoading = false;
    //       })
    //       .catch(error => {
    //         this.error = error.message;
    //         this.isLoading = false;
    //         console.error("Error fetching files:", error);
    //       });
    // },
    fetchPrintJobProgress() {
      this.isLoading = true;
      this.error = null;
      const url = `http://${config.server}/api/job`;
      const config3 = {
        headers: {
          'X-Api-Key': config.apiKey
        },
        timeout: 3000
      };

      axios.get(url, config3)
          .then(response => {
            this.printJobProgress.completion = response.data.progress.completion;
            this.printJobProgress.printTimeLeft = response.data.progress.printTimeLeft;
            this.printJobProgress.fileName = response.data.job.file.display;
          })
          .catch(error => {
            console.error("Error fetching print job progress:", error);
          });
    },

    // handleImageError(event) {
    //   if (!this.snapshotAttempted) {
    //     this.snapshotAttempted = true;
    //     event.target.src = 'http://192.168.0.178/webcam/?action=snapshot';    //single photo
    //   } else {
    //     event.target.src = '../images/NoSignal.jpg'; //static image
    //   }
    // },

    filters: {
      formatDuration(duration) {
        // Assume duration is in seconds
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        return `${hours}h ${minutes}m`;
      },
    },
  }
};
</script>

<style scoped>
.printer-status div {
  margin-bottom: 10px;
}

.center-div {
  display: flex;
  justify-content: center;
  align-items: center;
  /*height: 80vh;*/
  text-align: center;
}
.v-card {
  margin: 10px;
  padding: 10px;
  /*height: 85vh;*/
  overflow: auto;

}
.img1{
  width: 100%;
  object-fit: scale-down;
  transform: rotate(180deg);
  transform: scaleY(-1);
}
.img{
  width: 100%;
  object-fit: scale-down;
  /*transform: scaleY(-1);*/
}

</style>
