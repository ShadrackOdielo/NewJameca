<template>
  <UModal
    title="Add Category"
    description="Add a new category to the system"
  >
    <UButton label="Add Category" icon="i-lucide-plus" color="neutral" variant="subtle" />

    <template #body>
        <UForm
            :state="state"
            :schema="categoriesInsertSchema"
            class="space-y-4"
            @submit.prevent="onSubmit"
                        >
        <UFormField label="Name">
            <UInput
                v-model="state.name"
                name="name"
                placeholder="Enter category name"
                required
            />
        </UFormField>
        <UFormField label="Slug">
            <UInput
                v-model="state.slug"
                name="slug"
                placeholder="Enter category slug"
                required
            />
        </UFormField>
        <UFormField label="Description">
            <UTextarea
                v-model="state.description"
                name="description"
                placeholder="Enter category description"
                required
            />
        </UFormField>
        <UFormField label="Image Upload">
                <div class="flex flex-col items-center ">
                    <UButton
                        label="Upload Images"
                        icon="i-lucide-upload"
                        variant="outline"
                        @click="imageInput?.click()"
                    />
                    <input
                        ref="imageInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleImageChange"
                    >
                </div>
                <UButton
                    v-if="imagePreviews.length > 0"
                    label="Clear Image"
                    icon="i-lucide-trash-2"
                    variant="ghost"
                    class="mb-4"
                    @click="clearImage"
                />
                <div class=" flex flex-col gap-2">
                    <div v-if="imagePreviews.length > 0" class="relative flex flex-row gap-4">
                        <img :src="imagePreviews[0]?.previewUrl" alt="Image Preview" class="w-auto h-8 object-cover rounded-md" >
                        <div class="flex flex-col">
                            <span class="text-sm font-semibold">{{ imagePreviews[0]?.file.name }}</span>
                            <span class="text-xs text-gray-500">{{ ((imagePreviews[0]?.file.size ?? 0) / 1024).toFixed(2) }} KB</span>
                        </div>
                        <UButton
                            icon="i-lucide-trash-2"
                            variant="ghost"
                            @click="clearImage"
                        />
                    </div>
                </div>
                </UFormField>
                <p>{{ progress }}</p>
            <UButton
            type="submit"
            label="Submit"
            color="primary"
            loading-auto
            />
        
        </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { z } from 'zod';
import { categoriesInsertSchema } from '~/types/schemas';

const imagePreviews = ref<ImagePreview[]>([]); // Store image previews
const imageInput = ref<HTMLInputElement | null>(null); // Reference to the file input
const supabase = useSupabaseClient();
type CategorySchema = z.infer<typeof import('~/types/schemas').categoriesInsertSchema>;
type ImagePreview = {
    file: File;
    previewUrl: string;
};
     const state = reactive<Partial<CategorySchema>>({
        id: undefined,
        name: '',
        slug: '',
        description: '',
        image_url: '',
        
    });
    const toast = useToast();
// slugify state.name for slug field
const slugify = (name: string) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
};
// Watch for changes in state.name to update the slug
watch(() => state.name, (newName) => {
    state.slug = newName ? slugify(newName) : '';
});
// Function to handle image selection
const handleImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0] as File;
        const previewUrl = URL.createObjectURL(file);
        imagePreviews.value = [{ file, previewUrl }]; // Only one image allowed
    }
};
const clearImage = () => {
    imagePreviews.value = [];
    if (imageInput.value) imageInput.value.value = '';
};
const progress = ref(0); // Progress for image upload')
async function onSubmit(event: FormSubmitEvent<CategorySchema>) {
    progress.value = 10; // Reset progress
    
    if (imagePreviews.value.length > 0) {
        // Upload image to Supabase Storage
        progress.value = 25; // Reset progress
        const imagePreview = imagePreviews.value[0] as ImagePreview;
        const { data, error } = await supabase.storage
            .from('images')
            .upload(`categories/${Date.now()}-${imagePreview.file.name}`, imagePreview.file);
        if (error) {
            toast.add({ title: 'Image Upload Error', description: error.message, color: 'error' });
            return;
        }
        state.image_url = supabase.storage.from('images').getPublicUrl(data.path).data.publicUrl;
        progress.value = 50; // Update progress after image upload
    }
    // Update Supabase table
    const { error: insertError } = await supabase
        .from('categories')
        .insert( event.data as CategorySchema);  
        if (insertError) {
        toast.add({ title: 'Database Error', description: insertError.message, color: 'error' });
        return;
    }
    toast.add({ title: 'Success', description: 'Category added successfully.', color: 'success' });
    progress.value = 100; // Complete progress
    // Optionally reset form here
}
</script>
