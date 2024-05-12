// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#0046a0',
                    secondary: '#9EC8FF',
                    accent: '#D1E5FF',
                }
            },
            dark: {
                colors: {
                    primary: '#0046a0',

                }
            }
        }
    }
})