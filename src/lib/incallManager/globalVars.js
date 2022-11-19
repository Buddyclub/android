export const budyclubNativeUtils = () => {
  if (typeof global.budyclubNativeUtils === 'undefined') {
    console.warn(
      'in React Native, DailyNativeUtils is expected to be available',
    );
    return null;
  }
  return global.budyclubNativeUtils;
};
