import bigDecimal from 'js-big-decimal';
import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import vueMq from 'vue-mq';
import router from './router';

Vue.use(vueMq, {
    breakpoints: {
        xs: 600,
        sm: 960,
        md: 1264,
        lg: 1904,
        xl: Infinity
    },

    defaultBreakpoint: 'xs'
});

Vue.config.productionTip = false;

let api = 'https://api.coincap.io/v2';

function sleep(ms) {
    return new Promise(function(resolve) {
        setTimeout(function() { resolve() }, ms);
    });
}

let last_request = null;

Vue.mixin({
    methods: {
        async api(resource) {
            async function request() {
                try {
                    let response = await fetch(`${api}/${resource}`, {
                        method: 'GET',
                        mode: 'cors',
                        cache: 'no-cache'
                    });
                    let json = await response.json();
                    localStorage.setItem('last_request', Date.now());
                    return json;
                }

                catch(error) { console.error(error) }
            }

            if (!last_request) {
                if (localStorage.getItem('last_request') != undefined) { last_request = parseInt(localStorage.getItem('last_request')) }
                else { last_request = Date.now() - 2000 }
            }

            if ((Date.now() - last_request) >= 1100) {
                last_request = Date.now();
                localStorage.setItem('last_request', last_request);
                return await request();
            }

            else {
                await sleep(1100);
                last_request = Date.now();
                localStorage.setItem('last_request', last_request);
                return await request();
            }
        },

        decimal(val) { return new bigDecimal(val) }
    }
})

new Vue({
    vuetify,
    router,
    render: h => h(App)
}).$mount('#app')
