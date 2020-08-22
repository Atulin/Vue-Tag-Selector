Array.prototype.remove = function (element) {
    let idx = this.indexOf(element);
    if (idx > -1) {
        this.splice(idx, 1)
    }
}

Array.prototype.pushUnique = function (element) {
    if (this.includes(element)) return;
    this.push(element);
}

new Vue({
    el: '#app',
    data: {},
    methods: {},
    computed: {},
    mounted() {
        console.log("Vue is mounted!");
    }
})
