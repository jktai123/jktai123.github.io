Vue.directive('my-directive', {
	bind: function (el) {
		el.innerHTML = '<p>**bind now**</p>';
	},
	update: function (el,binding) {
		el.innerHTML = '<p>' + binding.oldValue + ' -> ' + binding.value + '</p>';
	},
	unbind: function (el) {
		el.innerHTML = '<p>**unbind**</p>';
	},
});

Vue.component('my-component', {
	template: '<p style="border:2px solid #A00;">My Component</p>'
})
Vue.component('my-component1', {
	props: ['message'],
	template: '<p style="border:1px solid #ccc ;">{{message}}</p>'
})
Vue.component('my-component2', {
	props: ['items'],
	template: '#my-template'
})
function initial() {

	new Vue({
		el: '#msg',
		data: {
			val: '',
			message: 'this is message!',
			selF: '',
			selB: '',
			flg: false,
			data:[
			'Hello!',
			'Welcome.',
			'Good-bye...']
			
		},
		created: function () {
			this.selF = 'orange';
			this.selB = 'blue';
			this.flg = true;
		},
		methods: {
			myfunc: function () {
				this.message = this.val;
			}
		}
	});
}

