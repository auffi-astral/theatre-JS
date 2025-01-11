<template>
  <div ref="container" class="scene-container"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { types } from '@theatre/core'
import { onMounted, ref } from 'vue'

const { $theatreProject } = useNuxtApp()
const container = ref<HTMLElement>()

onMounted(() => {
  if (!$theatreProject) {
    console.warn('Theatre.js project not available')
    return
  }

  // Basic Three.js setup
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value?.appendChild(renderer.domElement)

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  camera.position.z = 5

  // Setup Theatre.js sheet for animation
  const sheet = $theatreProject.sheet('Scene')
  
  // Create an object to hold camera properties
  const cameraObj = sheet.object('Camera', {
    position: {
      x: types.number(camera.position.x, { range: [-10, 10] }),
      y: types.number(camera.position.y, { range: [-10, 10] }),
      z: types.number(camera.position.z, { range: [0, 10] })
    },
    rotation: {
      x: types.number(0, { range: [-Math.PI, Math.PI] }),
      y: types.number(0, { range: [-Math.PI, Math.PI] }),
      z: types.number(0, { range: [-Math.PI, Math.PI] })
    }
  })

  // Create custom geometry
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
  const material = new THREE.MeshPhongMaterial({ 
    color: 0x00ff00,
    shininess: 100
  })
  const customMesh = new THREE.Mesh(geometry, material)
  scene.add(customMesh)

  // Create Theatre.js controls for the custom mesh
  const meshObj = sheet.object('CustomMesh', {
    position: {
      x: types.number(0, { range: [-5, 5] }),
      y: types.number(0, { range: [-5, 5] }),
      z: types.number(0, { range: [-5, 5] })
    },
    rotation: {
      x: types.number(0, { range: [-Math.PI, Math.PI] }),
      y: types.number(0, { range: [-Math.PI, Math.PI] }),
      z: types.number(0, { range: [-Math.PI, Math.PI] })
    },
    scale: types.number(1, { range: [0.1, 3] }),
    color: types.rgba({ r: 0, g: 1, b: 0, a: 1 })
  })

  // Update mesh properties from Theatre.js
  meshObj.onValuesChange((values) => {
    customMesh.position.set(
      values.position.x,
      values.position.y,
      values.position.z
    )
    customMesh.rotation.set(
      values.rotation.x,
      values.rotation.y,
      values.rotation.z
    )
    customMesh.scale.setScalar(values.scale)
    
    // Update material color
    const color = values.color
    material.color.setRGB(color.r, color.g, color.b)
  })

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate)

    // Update camera position from Theatre.js
    const values = cameraObj.value
    camera.position.set(values.position.x, values.position.y, values.position.z)
    camera.rotation.set(values.rotation.x, values.rotation.y, values.rotation.z)

    renderer.render(scene, camera)
  }

  animate()

  // Handle window resize
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize)
})
</script>

<style scoped>
.scene-container {
  width: 100vw;
  height: 100vh;
}
</style>