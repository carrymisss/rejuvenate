const CracoAntDesignPlugin = require("craco-antd");

module.exports = {
   plugins: [
      {
         plugin: CracoAntDesignPlugin,
         options: {
            customizeTheme: {
               "@primary-color": "#782fef",
               // "@font-size-base": "16px",
               "@border-radius-base": "5px",
               "@font-family": "'SFProText', sans-serif",
               "@height-base": "35px",
               "@btn-padding-horizontal-base": "@padding-lg",
               "@btn-default-color": "@primary-color",
               "@btn-default-border": "@primary-color",
               "@item-hover-bg": "#ececec",
               "@text-color": "#333333",
               "@card-padding-base": "15px",
               "@border-color-base": "#e7e8ec",
               "@border-color-split": "#e7e8ec"
            }
         }
      }
   ]
};
