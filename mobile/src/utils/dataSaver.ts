import * as ImageManipulator from 'expo-image-manipulator';

export const compressImage = async (uri: string): Promise<string> => {
    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 1024 } }], // Resize width to max 1024px (maintains aspect ratio)
            { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG } // Compress to 60% quality
        );
        return result.uri;
    } catch (error) {
        console.error('Image compression failed:', error);
        return uri; // Fallback to original if compression fails
    }
};
