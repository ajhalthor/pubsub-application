;(function($){
	//CacheDOM
	var $el = $('#sub-addition')
	var template = $el.html()

	//bindEvents
	$el.delegate('button','click',op)

	render()

	function op(event){
		$currentEl = $(event.target)
		name = $el.find('input')[0].value
		operation = $currentEl.html().toLowerCase() 
		events.trigger("sub_" + operation,name)
		render()
	}

	function render(){
		$el.find('input').val('')
	}
})(jQuery);


(function(){
	//CacheDOM
	var $el = $('#pub-addition')
	var template = $el.html()

	//bindEvents
	$el.delegate('button','click',op)

	render()

	function op(event){
		$currentEl = $(event.target)
		name = $el.find('input')[0].value
		operation = $currentEl.html().toLowerCase()
		events.trigger("pub_" + operation,name)
		render()
	}

	function render(){
		$el.find('input').val('')
	}
})();


var Subscriber = (function(){

	var subscribers = [];

	var $el = $('#subscriber-list')
	var template = $el.html()
	
	//bindEvents
	$el.delegate('button','click',addTopic)
	events.on('notify', _notify)
	events.on('sub_add', add)
	events.on('sub_remove', remove)

	_render() 

	function _render(){
		data = {
				subscribers: subscribers
		}

		$el.html(Mustache.render(template, data))
	}

	function get(indx){
		indx = indx || -1
		if(indx != -1)
			return subscribers[indx]
		return subscribers;
	}

	function add(name){
		subs = subscribers.map(function(sub, indx){
			return sub.name.toLowerCase()
		});

		indx = subs.indexOf(name.toLowerCase())
		if(indx != -1) {
			alert(name + ' already exists!')
			return
		}

		subscribers.push({'name' : name})
		_render()
	}

	function remove(name){
		subs = subscribers.map(function(sub, indx){
			return sub.name
		});

		indx = subs.indexOf(name)

		if(indx != -1) {
			subscribers.splice(indx, 1)
			_render()
			return
		}

		alert(name + ' doesnt exist!')
	}

	function _notify(info){
		subscribers.forEach(function(sub, indx){
			sub.topics = sub.topics || []
			sub.notifications = sub.notifications || []
			if(sub.topics.indexOf(info.topic) != -1)
				sub.notifications.push(info)
		});

		_render()
	}


	function addTopic(event){
        $currentEl = $(event.target)
        $sub = $currentEl.closest('.subscriber');
        name = $sub.find('h4').html();
        topic = $sub.find('input')[0].value;

		subscribers.forEach(function(sub, indx){
			if(name.toLowerCase() == sub.name.toLowerCase()){
				sub.topics = sub.topics || [] //For new subscribers, there is no topics array. So, if this is the case, initialize it to empty list: []
				if(sub.topics.indexOf(topic) == -1){
					sub.topics.push(topic);
					_render()
					return;
				}
			}
		});
	}

	//No DOM for this yet..
	function removeTopic(topic){
		indx = Subscribers.indexOf(topic)
		if(indx != -1) {
			topics.splice(indx,1);
			_render()
		}
	}

	return{
		get: get,
		unsubscribe: removeTopic
	}
})();


var Publisher = (function(){

	var publishers = []

	//cacheDOM
	var $el = $('#publisher-list')
	var template = $el.html()

	//bindEvents (DOM)
	$el.delegate('button','click',send)

	//bindEvents (PubSub)
	events.on('pub_add', add)
	events.on('pub_remove', remove)

	_render();

	function _render(){
		data = {
				publishers: publishers
		}
		$el.html(Mustache.render(template, data))
	}

	function get(indx){
		indx = indx || -1
		if(indx != -1)
			return publishers[indx]
		return publishers;
	}

	function add(name){

		pubs = publishers.map(function(pub, indx){
			return pub.name.toLowerCase()
		});

		indx = pubs.indexOf(name.toLowerCase())
		if(indx != -1) {
			alert(name + ' is already a publisher!')
			return
		}

		publishers.push({'name' : name})
		_render()
	}

	function remove(pub){
		pubs = publishers.map(function(publisher){
			return publisher.name;
		});

		indx = pubs.indexOf(pub);

		if(indx != -1) {
			publishers.splice(indx, 1)
			_render()
		}
	}

	function send(event){
        $currentEl = $(event.target)
        $pub = $currentEl.closest('.publisher');
        name = $pub.find('h4').html();
        topic = $pub.find('input')[0].value;
        payload = $pub.find('textarea')[0].value;

		work = {
			'name':name,
			'topic': topic,
			'payload': payload
		};

		pubs = publishers.map(function(publisher){
			return publisher.name;
		});

		indx = pubs.indexOf(work.name);

		publishers[indx].works = publishers[indx].works || []

		publishers[indx].works.push({
			'topic':topic,
			'payload':payload
		});

		_render();

		events.trigger('notify', work)
	}

	return {
		get: get,
		send: send
	}

})();

