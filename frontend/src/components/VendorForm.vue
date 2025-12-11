<template>
  <div class="vendor-form">
    <h2>Add New Vendor</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Name:</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Company name"
          :disabled="vendorStore.loading || isSubmitting"
        />
      </div>

      <div class="form-group">
        <label for="contactPerson">Contact Person:</label>
        <input
          id="contactPerson"
          v-model="form.contact_person"
          type="text"
          required
          placeholder="Contact person name"
          :disabled="vendorStore.loading || isSubmitting"
        />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="contact@example.com"
          :disabled="vendorStore.loading || isSubmitting"
        />
      </div>

      <div class="form-group">
        <label for="partnerType">Partner Type:</label>
        <select
          id="partnerType"
          v-model="form.partner_type"
          required
          :disabled="vendorStore.loading || isSubmitting"
        >
          <option value="Supplier">Supplier</option>
          <option value="Partner">Partner</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="vendorStore.loading || isSubmitting">
          {{
            vendorStore.loading || isSubmitting ? "Submitting..." : "Add Vendor"
          }}
        </button>
        <div v-if="vendorStore.error" class="error-message">
          {{ vendorStore.error }}
        </div>
        <div v-if="formError" class="error-message">{{ formError }}</div>
        <div v-if="success" class="success-message">
          Vendor added successfully!
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useVendorStore } from "../stores/vendorStore";
import type { Vendor } from "../types/Vendor";

const vendorStore = useVendorStore();

const form = reactive<Vendor>({
  name: "",
  contact_person: "",
  email: "",
  partner_type: "Supplier",
});

const success = ref(false);
const isSubmitting = ref(false);
const formError = ref<string | null>(null);

const resetForm = () => {
  form.name = "";
  form.contact_person = "";
  form.email = "";
  form.partner_type = "Supplier";
};

const submitForm = async () => {
  if (isSubmitting.value || vendorStore.loading) return;

  isSubmitting.value = true;
  formError.value = null;
  const emailNormalized = String(form.email || "")
    .trim()
    .toLowerCase();
  if (
    emailNormalized &&
    vendorStore.vendors.some(
      (v) =>
        String(v.email || "")
          .trim()
          .toLowerCase() === emailNormalized
    )
  ) {
    formError.value =
      "A vendor with this email already exists. Please use a different email address.";
    isSubmitting.value = false;
    return;
  }

  success.value = false;

  const payload = { ...form };
  resetForm();

  try {
    await vendorStore.addVendor(payload);
    success.value = true;

    setTimeout(() => {
      success.value = false;
    }, 2000);
  } catch (err: any) {
    form.name = payload.name;
    form.contact_person = payload.contact_person;
    form.email = payload.email;
    form.partner_type = payload.partner_type;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.vendor-form {
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background-color: var(--surface);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  margin-top: 20px;
}

button {
  padding: 10px 15px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: var(--primary-hover);
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: var(--danger);
  margin-top: 10px;
}

.success-message {
  color: var(--success);
  margin-top: 10px;
}
</style>
