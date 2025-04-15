import apiClient from "../apiClient";

/**
 * Service for interacting with upload-related API endpoints
 */
export const uploadService = {
  /**
   * Upload a single image
   * @param imageUri URI of the image to upload
   * @param type Optional type of image (e.g., "review", "profile", etc.)
   * @returns Promise with uploaded image URL
   */
  uploadImage: async (imageUri: string, type?: string): Promise<string> => {
    try {
      // Create form data
      const formData = new FormData();
      
      // Get file name from URI
      const uriParts = imageUri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      
      // Append image to form data
      formData.append('image', {
        uri: imageUri,
        name: fileName,
        type: 'image/jpeg', // Assuming JPEG format, adjust if needed
      } as any);
      
      // Append type if provided
      if (type) {
        formData.append('type', type);
      }
      
      // Send request
      const response = await apiClient.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Return the relative path to the uploaded image
      return response.data.data.relativePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
  
  /**
   * Upload multiple images
   * @param imageUris Array of image URIs to upload
   * @param type Optional type of images (e.g., "review", "profile", etc.)
   * @returns Promise with array of uploaded image URLs
   */
  uploadMultipleImages: async (imageUris: string[], type?: string): Promise<string[]> => {
    try {
      // Create form data
      const formData = new FormData();
      
      // Append each image to form data
      imageUris.forEach((uri, index) => {
        const uriParts = uri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        
        formData.append('images', {
          uri,
          name: fileName,
          type: 'image/jpeg', // Assuming JPEG format, adjust if needed
        } as any);
      });
      
      // Append type if provided
      if (type) {
        formData.append('type', type);
      }
      
      // Send request
      const response = await apiClient.post('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Return the relative paths to the uploaded images
      return response.data.data.relativePaths;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  },
};

export default uploadService;
