import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aliveztechnosoft.myapplication3',
  appName: 'newbao',
  webDir: 'www',
  bundledWebRuntime: false,
  backgroundColor : "#ffffff",
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 0,
      "launchAutoHide": false,
      "backgroundColor": "#ffffff",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": true,
      "androidSpinnerStyle": "large",
      "iosSpinnerStyle": "small",
      "spinnerColor": "#999999",
      "splashFullScreen": true,
      "splashImmersive": true,
      "layoutName": "launch_screen",
      "useDialog": true,
    }
  }
};


export default config;
