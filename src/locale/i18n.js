import i18n from "i18next"
import { initReactI18next } from 'react-i18next';
import pt from "./pt_BR.json"
import en from "./en_US.json"

i18n.use(initReactI18next)
    .init({
      resources:{
        en:{
          translation:en
        },
        pt:{
          translation:pt
        }
        
      },
      lng:"en",
      fallbackLng:"en",
      interpolation:{
        escapeValue:false
      }
    })

export default i18n