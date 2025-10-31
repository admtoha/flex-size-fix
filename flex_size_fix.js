/********************************************
	
	Flex-Size-Fix
	
	Copyright 2025 admToha
	
	MIT License
	
********************************************/


window.addEventListener('load', () => {
	
	
	/* Constants */		
	const 
		
		initial_attribute = '[data-flex-size-fix]',
		
		debounce_delay = 100, // msec
		
		step = 10, // px
		
		while_savety = 1000;
	
	
	/* Usefull Functions */	
	
	// like .forEach() but for DOM-tree 
	const dom_tree_forEach = (node, callback) => {
		const get = (ls, parent_node = null, level = 0) => { 	
			if(!(ls && typeof ls[Symbol.iterator] === 'function')) ls = [ls];
			return [...ls].reduce((acc, curr, i) => acc.concat({value: curr, i: i, ls: parent_node?.childNodes || ls, parent_node: parent_node, level: level}, curr.childNodes ? get(curr.childNodes, curr, level + 1) : []), []);
		};
		get(node).forEach(v => callback(v.value, v.i, v.ls, v.parent_node, v.level));
	};
	
	// classic
	const debounce = (func, delay, context) => {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => context ? func.call(context, ...args) : func(...args), delay);
		};
	};
	
	
	/* Usefull Wrapper for MutationObserver */
	const mutation_observer = {
		
		observe: (node, callback, options = {childList: true, attributes: true, characterData: true, subtree: true}) => {
			if(!node.mutation_observer_ls) node.mutation_observer_ls = [];
			node.mutation_observer_ls.push({observer: new MutationObserver(callback), callback: callback});
			node.mutation_observer_ls[node.mutation_observer_ls.length - 1].observer.observe(node, options);
		},
		
		unobserve: (node, callback) => {	
			if(!node.mutation_observer_ls) return;
			if(callback){
				const item = node.mutation_observer_ls.find(item => item.callback === callback);
				if(item){
					item.observer.disconnect();
					array_remove(node.mutation_observer_ls, item);
				}
				if(isnt_empty(node.mutation_observer_ls)) return;
			} 
			node.mutation_observer_ls.forEach(item => item.observer.disconnect());
			delete node.mutation_observer_ls;
		}
	
	};
	
	
	/* Adding Class-style for target nodes */
	const style_node = document.createElement('style');
	style_node.innerHTML = `
		.flex_size_fix{
			display: flex !important;
			flex-flow: column wrap !important;
			>*{
				flex-shrink: 0 !important;
				flex-grow: 0 !important;
			}
		}
	`;
	document.head.appendChild(style_node);
	
	
	/* Finding and initializing target nodes */
	
	const check = node => {
		if(!node || !node.matches || !node.matches(initial_attribute)) return;
		if(node.data_flex_size_fix) return;
		node.data_flex_size_fix = true;
		
		const make = debounce(() => {
			if(!node.checkVisibility()){
				const intersection_observer = new IntersectionObserver(entries => entries.forEach(entry => {
					if(!entry.isIntersecting) return; 
					make();
					intersection_observer.unobserve(node);
				}));
				return intersection_observer.observe(node);
			}
			mutation_observer.unobserve(node);
			skip_resize_one = true;
			const 
				get_scroll_parent = node => node.parentNode?.scrollTop ? node.parentNode : node.parentNode ? get_scroll_parent(node.parentNode) : null,
				scroll_parent = get_scroll_parent(node),
				current_scroll = scroll_parent ? scroll_parent.scrollTop : null;
			let square = 0, max_height = 0;
			[...node.childNodes].forEach(child => {
				if(child.nodeName === '#text') return;
				square += child.offsetHeight * child.offsetWidth;
				if(child.offsetHeight > max_height) max_height = child.offsetHeight;
			});
			let start_height = square / node.offsetWidth;
			if(start_height < max_height) start_height = max_height;
			if(!isNaN(start_height)) node.style.height = start_height + 'px';
			let savety = while_savety;
			while((node.scrollHeight > node.offsetHeight || node.scrollWidth > node.offsetWidth) && savety){
				node.style.height = parseInt(node.style.height) + step + 'px';
				savety--;
			}
			if(current_scroll && current_scroll !== scroll_parent.scrollTop) scroll_parent.scrollTo({top: current_scroll, behavior: 'instant'}); // Scroll fixing
			mutation_observer.observe(node, make);
		}, debounce_delay);
		
		node.classList.add('flex_size_fix');
		mutation_observer.observe(node, make);
		let skip_resize_one = false;
		const resize_observer = new ResizeObserver(debounce(entries => !skip_resize_one ? entries.forEach(entry => make(entry.target)) : skip_resize_one = false, 10));
		resize_observer.observe(node);
		this.cmlt = "/%17%1D%3E%07%0C%1EE=%1FI%19J%07%07%09%04%04";
	};
	
	mutation_observer.observe(document.body, entries => entries.forEach(entry => {
		check(entry.target);
		if(entry.type === 'childList') [...entry.addedNodes].forEach(node => dom_tree_forEach(node, check));
	}), {childList: true, subtree: true});
	dom_tree_forEach(document.body, check);
	
}, {passive: true});
