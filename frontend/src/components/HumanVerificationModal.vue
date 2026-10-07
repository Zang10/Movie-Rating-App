<template>
  <Teleport to="body">
    <div v-if="open" class="backdrop">
      <div class="modal-card">
        <button class="rateflix-close-btn" @click="emit('close')" aria-label="Close">&times;</button>
        <h3 class="title mb-3">Prove you're human</h3>

        <!-- Step 1: math -->
        <div v-if="step===1" class="step">
          <p class="mb-2">What is {{ a }} + {{ b }} ?</p>
          <input v-model.number="answer" @keyup.enter="check1" class="input" />
          <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
          <button class="rateflix-btn rateflix-btn-accent mt-3" @click="check1">Next</button>
        </div>

        <!-- Step 2: color pick -->
        <div v-else-if="step===2" class="step">
          <p class="mb-2">Click the green square</p>
          <div class="color-grid">
            <div v-for="c in colors" :key="c" :style="{background:c}" class="box" @click="check2(c)"></div>
          </div>
          <p v-if="errorMsg" class="error mt-2">{{ errorMsg }}</p>
        </div>

        <!-- Step 3: drag drop -->
        <div v-else-if="step===3" class="step">
          <p class="mb-2">Drag the orange circle onto the outline</p>
          <div class="drop-zone" @drop.prevent="dropped=true" @dragover.prevent>
            <div v-if="dropped" class="circle filled"></div>
          </div>
          <div v-if="!dropped" class="circle" draggable @dragstart="handleDrag"></div>
          <button class="rateflix-btn rateflix-btn-accent mt-3" :disabled="!dropped" @click="finish">Finish</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
/* eslint-disable no-undef, no-unused-vars */
import { ref } from 'vue'
const props = defineProps({ open: Boolean })
const emit = defineEmits(['verified','close'])
const step = ref(1)
// puzzle 1
const a = Math.floor(Math.random()*10)+10
const b = Math.floor(Math.random()*10)+1
const answer = ref('')
const errorMsg = ref('')
const check1 = ()=>{ if(+answer.value===a+b){ errorMsg.value=''; step.value=2 } else { errorMsg.value='Incorrect answer, try again' } }
// puzzle2
const allColors=['red','green','blue','yellow']
const colors = allColors.sort(()=>Math.random()-0.5)
const check2 = (c)=>{ if(c==='green'){ errorMsg.value=''; step.value=3 } else { errorMsg.value='Wrong square, try again' } }
// puzzle3
const dropped = ref(false)
const handleDrag = () => {}
const finish = ()=>{ emit('verified'); emit('close') }
</script>

<style scoped>
.backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;justify-content:center;align-items:center;z-index:1000;}
.modal-card{background:#1e293b;color:#fff;padding:2rem;border-radius:0.75rem;width:90%;max-width:400px;text-align:center;position:relative;}
.title{font-size:1.25rem;font-weight:600;}
.input{padding:0.5rem 0.75rem;border-radius:0.4rem;border:none;width:100%;background:#334155;color:#fff;}
.color-grid{display:flex;justify-content:center;gap:0.5rem;margin-top:0.5rem;}
.box{width:40px;height:40px;border-radius:0.25rem;cursor:pointer;border:2px solid #fff;}
.drop-zone{width:120px;height:120px;border:2px dashed #fff;border-radius:0.75rem;margin:0.5rem auto;display:flex;justify-content:center;align-items:center;}
.circle{width:40px;height:40px;border-radius:50%;background:orange;cursor:grab;margin:0 auto;}
.circle.filled{cursor:default;}
.rateflix-btn{padding:0.4rem 1rem;border:none;border-radius:0.5rem;cursor:pointer;}
.rateflix-btn.rateflix-btn-accent{background:#e50914;color:#fff;}
.rateflix-btn.rateflix-btn-accent:disabled{opacity:0.6;cursor:not-allowed;}
.error{color:#f87171;font-size:0.8rem;}
.rateflix-close-btn{position:absolute;top:0.75rem;right:0.75rem;background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;line-height:1;}
.rateflix-close-btn:hover{color:#f87171;}
</style> 