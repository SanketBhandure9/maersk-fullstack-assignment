<script setup lang="ts">
import VendorForm from "./components/VendorForm.vue";
import VendorList from "./components/VendorList.vue";
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Trusted Vendor Portal</h1>
    </header>
    <main>
      <div class="content-layout">
        <VendorForm />
        <VendorList />
      </div>
    </main>
  </div>
</template>

<style>
/* Global styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: var(--text);
  background-color: var(--bg);
  line-height: 1.6;
  color: #333;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  padding: 20px 0;
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
}

.content-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 1024px) {
  .content-layout {
    flex-direction: row;
    gap: 30px;
    align-items: flex-start;
  }

  .content-layout > *:first-child {
    flex: 0 0 420px;
  }

  .content-layout > *:last-child {
    flex: 1 1 auto;
  }
}

h1 {
  color: #2c3e50;
}

h2 {
  margin-bottom: 15px;
  color: #2c3e50;
}
</style>
