<template>
  <div>
    <label for="time">Select Time:</label>
    <select v-model="selectedTime" @change="updateTime">
      <option disabled value="">Please select a time</option>
      <option v-for="hour in 24" :key="hour" :value="`${hour}:00`">{{ hour }}:00</option>
      <option v-for="minute in 60" :key="minute" :value="`${hour}:30`" v-if="minute % 30 === 0">{{ minute }}:30</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'TimePicker',
  data() {
    return {
      selectedTime: '',
    };
  },
  methods: {
    updateTime() {
      this.$emit('time-changed', this.selectedTime);
    },
  },
};
</script>

<style scoped>

</style>