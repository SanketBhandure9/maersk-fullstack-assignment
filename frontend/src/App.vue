<script setup lang="ts">
import { ref, onMounted } from "vue";
import VendorForm from "./components/VendorForm.vue";
import VendorList from "./components/VendorList.vue";

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDark.value = true;
    document.documentElement.setAttribute("data-theme", "dark");
  }
});
</script>

<template>
  <div class="app-container">
    <header>
      <div class="header-content">
        <h1>Trusted Vendor Portal</h1>
        <button
          class="theme-toggle"
          @click="toggleTheme"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          aria-label="Toggle dark/light theme"
        >
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
      </div>
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
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--border);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background-color: var(--row-hover);
  border-color: var(--primary);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.content-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center; /* center children horizontally on narrow screens */
  width: 100%;
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
  color: var(--text);
  margin: 0;
  font-size: 1.8rem;
}

h2 {
  margin-bottom: 15px;
  color: var(--text);
}
</style>
