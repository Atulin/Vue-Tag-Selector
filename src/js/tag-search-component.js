Vue.component('tag-search', {
    props: {
        route: {
            type: String,
            required: true
        }
    },
    data: function () {
        return {
            options: [],
            selected: [],
            search: '',
            highlighted: null,
            focused: false
        }
    },
    computed: {
        filtered() {
            return this.options.filter(x => {
                return (
                       x.name.toLowerCase().includes(this.search.toLowerCase())
                    || x.namespace.toLowerCase().includes(this.search.toLowerCase())
                )
                && !this.selected.some(i => i.id === x.id)
                && this.search.length > 0
            })
        }
    },
    methods: {
        handleInputKeys: function (e) {
            switch (e.key) {
                case 'Backspace':
                    if (this.search.length <= 0) {
                        this.selected.pop();
                    }
                    break;
                case 'ArrowUp':
                    if (this.highlighted !== null) e.preventDefault();
                    if (this.highlighted > 0) {
                        this.highlighted--;
                    } else {
                        this.highlighted = null;
                    }
                    break;
                case 'ArrowDown':
                    if (this.highlighted !== null) e.preventDefault();
                    if (this.highlighted === null) {
                        this.highlighted = 0;
                    } else if (this.highlighted < this.filtered.length - 1) {
                        this.highlighted++;
                    }
                    break;
                case ' ':
                case 'Enter':
                    if (this.highlighted !== null) {
                        e.preventDefault();
                        this.selected.pushUnique(JSON.parse(JSON.stringify(this.filtered[this.highlighted])));
                    }
                    break;
                default:
                    break;
            }
        }
    },
    created() {
        axios.get(this.route)
            .then(res => {
                this.options = res.data
            })
            .catch(console.error)
    },
    template: `
    <div class="tag-select">
    
        <select class="output" name="tags" id="tags" multiple>
            <option v-for="s in selected" :value="s.id">{{s.name}}</option>
        </select>
        
        <div class="input">
            <div class="tag" v-for="t in selected">{{t.name}}<button v-on:click="selected.remove(t)">x</button></div>
            <input type="text" 
                   v-model="search" 
                   v-on:keydown="handleInputKeys"
                   v-on:focusin="focused = true"
                   v-on:focusout="focused = false"
                   placeholder="Search...">
        </div>
    
        <div class="options" v-if="focused">
            <div v-for="(t, idx) in filtered" 
                 class="option" 
                 :class="highlighted === idx ? 'hl' : null"
                 v-on:click="selected.pushUnique(t)">
              <span class="ns">{{t.namespace}}:</span>
              <span class="name">{{t.name}}</span>
              <div class="bg" :style="{backgroundColor: t.color}"></div>
            </div>
        </div>
    </div>`
});
