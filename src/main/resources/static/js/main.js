
function getIndex(list, id) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            return i;
        }
    }
    return -1;
}

var dataApi = Vue.resource('/data{/id}');

Vue.component('data-form', {
  props: ['dates', 'dataAttr'],
  data: function() {
       return {
            text: '',
            id: ''
       }
  },
  watch: {
        dataAttr: function(newVal, oldVal) {
            this.text = newVal.text;
            this.id = newVal.id;
        }
  },
  template:
       '<div>' +
           '<input type="text" placeholder="Write something" v-model="text"/>' +
           '<input type="button" value="Save" @click="save" />' +
       '</div>',
  methods: {
        save: function() {
            var message = { text: this.text };

            if (this.id) {
                dataApi.update({id: this.id}, message).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.dates, data.id);
                        this.dates.splice(index, 1, data);
                        this.text = ''
                        this.id = ''
                    })
                )
            } else {
                dataApi.save({}, message).then(result =>
                    result.json().then(data => {
                         this.dates.push(data);
                         this.text = ''
                    })
                )
            }
        }
  }
});

Vue.component('data-row', {
  props: ['data', 'editMethod', 'dates'],
  template:
        '<div>' +
        '<i>({{ data.id }})</i> {{ data.text }}' +
        '<span style="position: absolute; right: 0">' +
            '<input type="button" value="Edit" @click="edit" />' +
            '<input type="button" value="X" @click="del" />' +
        '</span>' +
        '</div>',
  methods: {
        edit: function() {
            this.editMethod(this.data);
        },
        del: function() {
            dataApi.remove({id: this.data.id}).then(result => {
                if (result.ok){
                    this.dates.splice(this.dates.indexOf(this.data), 1)
                }
            })
        }
  }
});

Vue.component('dates-list', {
  props: ['dates'],
  data: function() {
        return {
            data: null
        }
  },
  template:
        '<div style="position: relative; width: 300px">' +
            '<data-form :dates="dates" :dataAttr="data" />' +
            '<data-row v-for="data in dates" :key="data.id" :data="data"' +
            ':editMethod="editMethod" :dates="dates"/>'+
        '</div>',
  created: function() {
    dataApi.get().then(result =>
        result.json().then(data =>
            data.forEach(data => this.dates.push(data))
        )
    )
   },
  methods: {
        editMethod: function(data) {
            this.data = data;
        }
   }
});

var app = new Vue({
  el: '#app',
  template: '<dates-list :dates="dates" />',
  data: {
    dates: []
  }
});