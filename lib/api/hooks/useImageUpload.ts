import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from '@tanstack/react-query';
import uploadService from '../services/uploadService';
import { Alert, Platform } from 'react-native';

export const useImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload images!'
        );
        return false;
      }
      return true;
    }
    return true;
  };
  
  // Pick a single image from library
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = result.assets[0].uri;
        setSelectedImages(prev => [...prev, newImage]);
        return newImage;
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
    return null;
  };
  
  // Pick multiple images from library
  const pickMultipleImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages = result.assets.map(asset => asset.uri);
        setSelectedImages(prev => [...prev, ...newImages]);
        return newImages;
      }
    } catch (error) {
      console.error('Error picking multiple images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
    return [];
  };
  
  // Remove an image from selected images
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Clear all selected images
  const clearImages = () => {
    setSelectedImages([]);
  };
  
  // Upload a single image mutation
  const uploadImageMutation = useMutation({
    mutationFn: (params: { imageUri: string; type?: string }) => 
      uploadService.uploadImage(params.imageUri, params.type),
  });
  
  // Upload multiple images mutation
  const uploadMultipleImagesMutation = useMutation({
    mutationFn: (params: { imageUris: string[]; type?: string }) => 
      uploadService.uploadMultipleImages(params.imageUris, params.type),
  });
  
  return {
    selectedImages,
    pickImage,
    pickMultipleImages,
    removeImage,
    clearImages,
    uploadImage: uploadImageMutation.mutate,
    uploadMultipleImages: uploadMultipleImagesMutation.mutate,
    isUploading: uploadImageMutation.isPending || uploadMultipleImagesMutation.isPending,
    uploadError: uploadImageMutation.error || uploadMultipleImagesMutation.error,
  };
};
