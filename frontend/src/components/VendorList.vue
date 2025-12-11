<template>
  <div class="vendor-list">
    <h2>Vendor List</h2>
    <div v-if="vendorStore.loading">Loading vendors...</div>
    <div v-else-if="vendorStore.error" class="error">
      {{ vendorStore.error }}
    </div>
    <div v-else-if="vendorStore.vendors.length === 0" class="no-vendors">
      No vendors found. Add your first vendor!
    </div>
    <table v-else class="vendors-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Contact Person</th>
          <th>Email</th>
          <th>Partner Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vendor in vendorStore.vendors" :key="vendor.id">
          <td>{{ vendor.id }}</td>
          <td>{{ vendor.name }}</td>
          <td>{{ vendor.contact_person }}</td>
          <td>{{ vendor.email }}</td>
          <td>{{ vendor.partner_type }}</td>
          <td>
            <button
              class="delete-btn"
              @click="confirmDelete(vendor.id)"
              :aria-label="`Delete vendor ${vendor.name}`"
              :disabled="vendorStore.loading"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useVendorStore } from "../stores/vendorStore";

// Using the vendor store directly, no need for local props or state
const vendorStore = useVendorStore();

onMounted(() => {
  vendorStore.fetchVendors();
});

const confirmDelete = async (id: number | undefined) => {
  if (typeof id !== "number") return;

  const ok = window.confirm(
    "Are you sure you want to delete this vendor? This action cannot be undone."
  );
  if (!ok) return;

  try {
    await vendorStore.deleteVendor(id);
  } catch (err) {
    // error is handled in the store, but ensure user sees something if needed
    // We keep it minimal: console logs already done in store
  }
};
</script>

<style scoped>
.vendor-list {
  margin: 20px auto;
  width: 100%;
  max-width: 820px; /* keeps table readable on large screens */
  box-sizing: border-box;
  padding: 0 10px; /* small horizontal padding on very small screens */
}

.vendors-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.vendors-table th,
.vendors-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.vendors-table th {
  background-color: var(--th-bg);
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 1;
}

.vendors-table tbody tr:nth-child(odd) {
  background-color: transparent;
}

.vendors-table tbody tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.02);
}

.vendors-table tbody tr:hover {
  background-color: var(--row-hover);
}

.vendors-table tbody tr:focus-within {
  outline: 2px solid var(--primary);
  outline-offset: -2px;
}

.vendors-table tbody tr:focus-within td {
  background-color: rgba(76, 175, 80, 0.05);
}

.delete-btn {
  background: transparent;
  border: 1px solid var(--danger);
  color: var(--danger);
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}
.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.delete-btn:hover:not(:disabled) {
  background-color: rgba(244, 67, 54, 0.06);
}

.error {
  color: var(--danger);
  padding: 10px;
}

.no-vendors {
  padding: 40px 20px;
  text-align: center;
  color: var(--muted);
  background-color: var(--surface);
  border: 2px dashed var(--border);
  border-radius: 8px;
  font-size: 1rem;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: all 0.2s ease;
}

.no-vendors::before {
  content: "📋";
  display: block;
  font-size: 3rem;
  margin-bottom: 12px;
  opacity: 0.5;
}
</style>
