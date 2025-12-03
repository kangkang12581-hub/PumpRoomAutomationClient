<template>
  <div class="video-page">
    <div class="toolbar">
      <input v-model="streamPath" placeholder="请输入 m3u8 地址，如 /hls/cam1/index.m3u8" />
      <button @click="loadVideo">播放</button>
    </div>
    <video ref="videoEl" class="player" controls playsinline></video>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Hls from 'hls.js'

const videoEl = ref(null)
const streamPath = ref('/hls/cam1/index.m3u8')
let hls

function destroy() {
  if (hls) {
    hls.destroy()
    hls = null
  }
}

function loadVideo() {
  destroy()
  const url = streamPath.value
  if (Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 10,
      maxBufferLength: 15,
      maxMaxBufferLength: 30
    })
    hls.attachMedia(videoEl.value)
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(url)
    })
  } else if (videoEl.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoEl.value.src = url
  }
}

onMounted(() => {
  loadVideo()
})

onBeforeUnmount(() => {
  destroy()
})
</script>

<style scoped>
.video-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}
.toolbar {
  display: flex;
  gap: 8px;
}
.player {
  width: 100%;
  max-height: 70vh;
  background: #000;
}
</style>


