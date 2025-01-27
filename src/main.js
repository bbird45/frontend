import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import './main.css'

import { faLock, faUser, faHome, faSignOutAlt, faBuilding, faDoorOpen, faMap ,faLightbulb,faGraduationCap , faChalkboardTeacher ,faBook,faQuestionCircle,faEdit, faTrash, faBookOpen, faColumns, faScroll, faSitemap, faProjectDiagram, faExchangeAlt, faCode, faTerminal, faLaptopCode, faCogs, faPoll, faClipboardList, faTrophy} from '@fortawesome/free-solid-svg-icons'
library.add(faLock,faUser, faHome, faSignOutAlt, faBuilding, faDoorOpen, faMap,faLightbulb ,faGraduationCap,faChalkboardTeacher,faBook,faQuestionCircle,faEdit,faTrash, faBookOpen, faColumns, faScroll, faSitemap, faProjectDiagram, faExchangeAlt, faCode, faTerminal, faLaptopCode, faCogs, faPoll, faClipboardList, faTrophy)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

app.config.compilerOptions.isCustomElement = (tag) => {
  return tag.startsWith('ion-') 
}

app.mount('#app')
