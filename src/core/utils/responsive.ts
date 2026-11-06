import { Dimensions, PixelRatio } from 'react-native';

const guidelineBaseWidth = 393;
const guidelineBaseHeight = 957;

export const RW = (size: number) =>
    (Dimensions.get('window').width / guidelineBaseWidth) * size;

export const RH = (size: number) =>
    (Dimensions.get('window').height / guidelineBaseHeight) * size;

export const RF = (size: number) => {
    const scale = Dimensions.get('window').width / guidelineBaseWidth;
    return PixelRatio.roundToNearestPixel(size * scale);
};

export const RS = (size: number) => {
    const { width, height } = Dimensions.get('window');
    const scaleWidth = width / guidelineBaseWidth;
    const scaleHeight = height / guidelineBaseHeight;
    const scale = Math.min(scaleWidth, scaleHeight);
    return PixelRatio.roundToNearestPixel(size * scale);
};
