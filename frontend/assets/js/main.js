Vue.component('doughnut-chart', {
    extends: VueChartJs.Doughnut,
    props: ['data'],
    data: {
        values: []
    },
    mounted() {
        this.renderChart({
            labels: ['Passed', 'Failed'],
            datasets: [
                {
                    label: 'Test Results',
                    backgroundColor: [
                        '#0DCA98',
                        '#EE553E'
                    ],
                    data: [0,0]
                }
            ]
        }, { responsive: true, maintainAspectRatio: false })
    }

})

var vm = new Vue({
    el: '#app',
    data: {
        message: 'Hello World',
        website: '',
        results: {
            pageSpeed: {},
            links: {},
            firstbyte: {},
            complete: 0
        },
        passed: 0,
        failed: 0
    },
    methods: {
        analyse: function() {
            this.results.complete = 0;
            this.passed = 0;
            this.failed = 0;
            this.pageSpeed();
            this.get404s();
            this.firstTimeToByte();
        },
        pageSpeed: function () {
            this.$http.post('https://weagan53i5.execute-api.eu-west-1.amazonaws.com/test/pagespeed', { Url: this.website })
                .then((data, status, request) => {
                    this.results['pageSpeed'] = data.data;
                    this.results['complete'] += 1;
                    this.results['pageSpeed'].time = this.results['pageSpeed'].time.toFixed(2);
                    if(this.results['pageSpeed'].time < 1) {
                        this.passed += 1;
                    } else {
                        this.failed += 1;
                    }
                });
        },
        get404s: function() {
            this.$http.post('https://weagan53i5.execute-api.eu-west-1.amazonaws.com/test/404detector',{ url: this.website })
                .then((data, status, request) => {
                    this.results['links'] = data.data;
                    this.results['complete'] += 1;
                    if(this.results['links'].brokenLinks.length == 0) {
                        this.passed += 1;
                    } else {
                        this.failed += 1;
                    }
                });
        },
        firstTimeToByte: function() {
            this.$http.post('https://weagan53i5.execute-api.eu-west-1.amazonaws.com/test/firstbyte', { url: this.website })
                .then((data, status, request) => {
                    this.results['firstbyte'] = data.data;
                    this.results['complete'] += 1;
                    this.results['firstbyte'].time = (this.results['firstbyte'].time / 100000000).toFixed(4);
                    if(this.results['firstbyte'].time <= 0.5) {
                        this.passed += 1;
                    } else {
                        this.failed += 1;
                    }
                });
        }
    }
})
