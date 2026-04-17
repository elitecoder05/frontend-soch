import apiClient from '@/api/index';

export interface UploadProgress {
  progress: number;
  url?: string;
  error?: string;
}

export class ImageUploadService {
  /**
   * Upload a single image to Firebase Storage
   * @param file - The file to upload
   * @param path - The storage path (e.g., 'model-logos', 'model-screenshots')
   * @param fileName - Optional custom filename
   * @param onProgress - Progress callback function
   * @returns Promise that resolves to the download URL
   */
  static async uploadImage(
    file: File,
    path: string,
    fileName?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB');
      }

      const formData = new FormData();
      formData.append('image', file, fileName || file.name);
      formData.append('folder', path);

      const response = await apiClient.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          if (!onProgress || !event.total) return;

          const progress = Math.round((event.loaded * 100) / event.total);
          onProgress({ progress });
        },
      });

      const downloadURL = response.data?.url;
      if (!downloadURL) {
        throw new Error('Upload succeeded but no image URL was returned');
      }

      onProgress?.({ progress: 100, url: downloadURL });
      return downloadURL;
  }

  /**
   * Upload multiple images
   * @param files - Array of files to upload
   * @param path - Storage path
   * @param onProgress - Progress callback with index
   * @returns Promise that resolves to array of download URLs
   */
  static async uploadMultipleImages(
    files: File[],
    path: string,
    onProgress?: (index: number, progress: UploadProgress) => void
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      return this.uploadImage(
        file,
        path,
        undefined,
        (progress) => {
          if (onProgress) {
            onProgress(index, progress);
          }
        }
      );
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Delete an image from Firebase Storage
   * @param url - The full download URL of the image
   * @returns Promise that resolves when deletion is complete
   */
  static async deleteImage(url: string): Promise<void> {
    try {
      await apiClient.delete('/api/upload/image', {
        data: { imageUrl: url },
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Validate image file
   * @param file - File to validate
   * @param maxSizeMB - Maximum size in MB (default: 5)
   * @returns Object with isValid boolean and error message if invalid
   */
  static validateImageFile(file: File, maxSizeMB: number = 5): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'Only image files are allowed' };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { isValid: false, error: `Image size must be less than ${maxSizeMB}MB` };
    }

    // Check supported formats
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedFormats.includes(file.type)) {
      return { isValid: false, error: 'Only JPG, PNG, and WebP formats are supported' };
    }

    return { isValid: true };
  }

  /**
   * Resize image if needed (client-side)
   * @param file - Original file
   * @param maxWidth - Maximum width
   * @param maxHeight - Maximum height
   * @param quality - JPEG quality (0-1)
   * @returns Promise that resolves to resized file
   */
  static async resizeImage(
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 800,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}