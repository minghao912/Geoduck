
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var Direction;
    (function (Direction) {
        Direction["s2t"] = "s2t";
        Direction["t2s"] = "t2s";
    })(Direction || (Direction = {}));
    async function convert(direction, query) {
        let url = `https://node.dragonfruit.tk/panda_linux/${direction}?query=${query}`;
        console.log("> Direction is " + direction + ", query is " + query);
        console.log("> GET URL: " + url);
        return new Promise((resolve, reject) => {
            try {
                // Send GET request
                fetch(url).then(response => {
                    response.json().then(panda => {
                        console.log(`> Server responded with {${panda.original}, ${panda.conversion}}`);
                        resolve(panda.conversion);
                    }, rejection => {
                        reject("An error occurred: " + rejection);
                    });
                }, rejection => {
                    reject("An error occurred: " + rejection);
                });
            }
            catch (err) {
                console.log(err);
                reject("There was an error with the GET request: " + err);
            }
        });
    }

    var communicator = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get Direction () { return Direction; },
        convert: convert
    });

    var Page;
    (function (Page) {
        Page["MAIN"] = "MAIN";
        Page["API"] = "API";
    })(Page || (Page = {}));
    var Lang;
    (function (Lang) {
        Lang[Lang["CHINESE"] = 0] = "CHINESE";
        Lang[Lang["ENGLISH"] = 1] = "ENGLISH";
    })(Lang || (Lang = {}));

    var constants = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get Page () { return Page; },
        get Lang () { return Lang; }
    });

    /* src\Input.svelte generated by Svelte v3.31.0 */

    const { console: console_1 } = globals;
    const file = "src\\Input.svelte";

    // (64:61) 
    function create_if_block_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("简体字");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(64:61) ",
    		ctx
    	});

    	return block;
    }

    // (62:20) {#if lang == constants.Lang.ENGLISH}
    function create_if_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Simplified");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(62:20) {#if lang == constants.Lang.ENGLISH}",
    		ctx
    	});

    	return block;
    }

    // (79:61) 
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("繁體字");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(79:61) ",
    		ctx
    	});

    	return block;
    }

    // (77:20) {#if lang == constants.Lang.ENGLISH}
    function create_if_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Traditional");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(77:20) {#if lang == constants.Lang.ENGLISH}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div5;
    	let div4;
    	let div1;
    	let h20;
    	let t0;
    	let hr0;
    	let t1;
    	let div0;
    	let label0;
    	let textarea0;
    	let t2;
    	let div3;
    	let h21;
    	let t3;
    	let hr1;
    	let t4;
    	let div2;
    	let label1;
    	let textarea1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*lang*/ ctx[0] == Lang.ENGLISH) return create_if_block_2;
    		if (/*lang*/ ctx[0] == Lang.CHINESE) return create_if_block_3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type && current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*lang*/ ctx[0] == Lang.ENGLISH) return create_if_block;
    		if (/*lang*/ ctx[0] == Lang.CHINESE) return create_if_block_1;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1 && current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			h20 = element("h2");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			hr0 = element("hr");
    			t1 = space();
    			div0 = element("div");
    			label0 = element("label");
    			textarea0 = element("textarea");
    			t2 = space();
    			div3 = element("div");
    			h21 = element("h2");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			hr1 = element("hr");
    			t4 = space();
    			div2 = element("div");
    			label1 = element("label");
    			textarea1 = element("textarea");
    			attr_dev(h20, "class", "align-center my-2 svelte-y4hy53");
    			add_location(h20, file, 60, 16, 2183);
    			attr_dev(hr0, "class", "my-2");
    			set_style(hr0, "border-top", "1px solid black");
    			add_location(hr0, file, 67, 16, 2467);
    			attr_dev(textarea0, "class", "form-control svelte-y4hy53");
    			attr_dev(textarea0, "id", "simp");
    			attr_dev(textarea0, "rows", "10");
    			attr_dev(textarea0, "cols", "25");
    			attr_dev(textarea0, "placeholder", /*placeholder*/ ctx[1]);
    			add_location(textarea0, file, 70, 24, 2656);
    			attr_dev(label0, "class", "full-size svelte-y4hy53");
    			attr_dev(label0, "for", "simp");
    			add_location(label0, file, 69, 20, 2594);
    			attr_dev(div0, "class", "form-group full-size svelte-y4hy53");
    			add_location(div0, file, 68, 16, 2538);
    			attr_dev(div1, "class", "col mx-3 my-2 full-size svelte-y4hy53");
    			add_location(div1, file, 59, 12, 2128);
    			attr_dev(h21, "class", "align-center my-2 svelte-y4hy53");
    			add_location(h21, file, 75, 16, 2918);
    			attr_dev(hr1, "class", "my-2");
    			set_style(hr1, "border-top", "1px solid black");
    			add_location(hr1, file, 82, 16, 3203);
    			attr_dev(textarea1, "class", "form-control svelte-y4hy53");
    			attr_dev(textarea1, "id", "trad");
    			attr_dev(textarea1, "rows", "10");
    			attr_dev(textarea1, "cols", "25");
    			attr_dev(textarea1, "placeholder", /*placeholder*/ ctx[1]);
    			add_location(textarea1, file, 85, 24, 3392);
    			attr_dev(label1, "class", "full-size svelte-y4hy53");
    			attr_dev(label1, "for", "trad");
    			add_location(label1, file, 84, 20, 3330);
    			attr_dev(div2, "class", "form-group full-size svelte-y4hy53");
    			add_location(div2, file, 83, 16, 3274);
    			attr_dev(div3, "class", "col mx-3 my-2 full-size svelte-y4hy53");
    			add_location(div3, file, 74, 12, 2863);
    			attr_dev(div4, "class", "row mt-10 d-flex");
    			set_style(div4, "align-content", "center");
    			set_style(div4, "min-width", "100vh");
    			set_style(div4, "min-height", "50vh");
    			add_location(div4, file, 58, 8, 2020);
    			attr_dev(div5, "class", "container text-center");
    			add_location(div5, file, 57, 4, 1975);
    			add_location(main, file, 56, 0, 1963);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, h20);
    			if (if_block0) if_block0.m(h20, null);
    			append_dev(div1, t0);
    			append_dev(div1, hr0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			append_dev(label0, textarea0);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, h21);
    			if (if_block1) if_block1.m(h21, null);
    			append_dev(div3, t3);
    			append_dev(div3, hr1);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, label1);
    			append_dev(label1, textarea1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea0, "input", /*input_handler*/ ctx[3], false, false, false),
    					listen_dev(textarea1, "input", /*input_handler_1*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block0) if_block0.d(1);
    				if_block0 = current_block_type && current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(h20, null);
    				}
    			}

    			if (dirty & /*placeholder*/ 2) {
    				attr_dev(textarea0, "placeholder", /*placeholder*/ ctx[1]);
    			}

    			if (current_block_type_1 !== (current_block_type_1 = select_block_type_1(ctx))) {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type_1 && current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(h21, null);
    				}
    			}

    			if (dirty & /*placeholder*/ 2) {
    				attr_dev(textarea1, "placeholder", /*placeholder*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			if (if_block0) {
    				if_block0.d();
    			}

    			if (if_block1) {
    				if_block1.d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const DELAY = 500;

    // Takes the output and sets it in the other text box
    function setOutput(textarea, str) {
    	// Get other textarea
    	let textareaToSwitch;

    	switch (textarea.id) {
    		case "simp":
    			textareaToSwitch = document.getElementById("trad");
    			break;
    		case "trad":
    			textareaToSwitch = document.getElementById("simp");
    			break;
    		default:
    			textarea.value = "There was an error parsing your text.";
    			break;
    	}

    	// Change color and set output
    	textarea.style.color = null;

    	textareaToSwitch.style.color = "SteelBlue";
    	textareaToSwitch.value = str;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Input", slots, []);
    	let { lang = Lang.CHINESE } = $$props;
    	let placeholder;

    	// Takes the input and sends it to the server
    	// Timeout stuff makes it so that it only runs the conversion when user stops typing for specified delay
    	let timeout = null;

    	function handleInput(e) {
    		clearTimeout(timeout);

    		timeout = setTimeout(
    			() => {
    				const textarea = e.target;
    				console.log("> Text input detected in textarea with id " + textarea.id);

    				switch (textarea.id) {
    					case "simp":
    						convert(Direction.s2t, textarea.value).then(output => setOutput(textarea, output));
    						break;
    					case "trad":
    						convert(Direction.t2s, textarea.value).then(output => setOutput(textarea, output));
    						break;
    					default:
    						textarea.value = "There was an error parsing your text.";
    						break;
    				}
    			},
    			DELAY
    		);
    	}

    	const writable_props = ["lang"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	const input_handler = e => handleInput(e);
    	const input_handler_1 = e => handleInput(e);

    	$$self.$$set = $$props => {
    		if ("lang" in $$props) $$invalidate(0, lang = $$props.lang);
    	};

    	$$self.$capture_state = () => ({
    		communicator,
    		constants,
    		lang,
    		placeholder,
    		timeout,
    		DELAY,
    		handleInput,
    		setOutput
    	});

    	$$self.$inject_state = $$props => {
    		if ("lang" in $$props) $$invalidate(0, lang = $$props.lang);
    		if ("placeholder" in $$props) $$invalidate(1, placeholder = $$props.placeholder);
    		if ("timeout" in $$props) timeout = $$props.timeout;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*lang*/ 1) {
    			 {
    				$$invalidate(1, placeholder = (function () {
    					if (lang == Lang.CHINESE) return "在此输入"; else return "Start typing...";
    				})());
    			}
    		}
    	};

    	return [lang, placeholder, handleInput, input_handler, input_handler_1];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { lang: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get lang() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lang(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Main.svelte generated by Svelte v3.31.0 */
    const file$1 = "src\\Main.svelte";

    // (19:69) 
    function create_if_block_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("使用说明");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(19:69) ",
    		ctx
    	});

    	return block;
    }

    // (17:28) {#if lang == constants.Lang.ENGLISH}
    function create_if_block_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Instructions");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(17:28) {#if lang == constants.Lang.ENGLISH}",
    		ctx
    	});

    	return block;
    }

    // (28:69) 
    function create_if_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("在其中一个文本区开始输入，翻译会在对面显示");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(28:69) ",
    		ctx
    	});

    	return block;
    }

    // (26:28) {#if lang == constants.Lang.ENGLISH}
    function create_if_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Start typing, and the output will appear in the other box.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(26:28) {#if lang == constants.Lang.ENGLISH}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let input;
    	let t0;
    	let div5;
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let h3;
    	let t1;
    	let div1;
    	let p;
    	let current;

    	input = new Input({
    			props: { lang: /*lang*/ ctx[0] },
    			$$inline: true
    		});

    	function select_block_type(ctx, dirty) {
    		if (/*lang*/ ctx[0] == Lang.ENGLISH) return create_if_block_2$1;
    		if (/*lang*/ ctx[0] == Lang.CHINESE) return create_if_block_3$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type && current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*lang*/ ctx[0] == Lang.ENGLISH) return create_if_block$1;
    		if (/*lang*/ ctx[0] == Lang.CHINESE) return create_if_block_1$1;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1 && current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(input.$$.fragment);
    			t0 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div1 = element("div");
    			p = element("p");
    			if (if_block1) if_block1.c();
    			add_location(h3, file$1, 15, 24, 507);
    			attr_dev(div0, "class", "card-header");
    			add_location(div0, file$1, 14, 20, 456);
    			add_location(p, file$1, 24, 24, 897);
    			attr_dev(div1, "class", "card-body");
    			add_location(div1, file$1, 23, 20, 848);
    			attr_dev(div2, "class", "card border-primary mt-2 center-children svelte-t03t5v");
    			add_location(div2, file$1, 13, 16, 380);
    			attr_dev(div3, "class", "col mx-3 full-size svelte-t03t5v");
    			add_location(div3, file$1, 12, 12, 330);
    			attr_dev(div4, "class", "row mt-2");
    			add_location(div4, file$1, 11, 8, 294);
    			attr_dev(div5, "class", "container text-center");
    			add_location(div5, file$1, 10, 4, 249);
    			add_location(main, file$1, 5, 0, 154);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(input, main, null);
    			append_dev(main, t0);
    			append_dev(main, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			if (if_block0) if_block0.m(h3, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, p);
    			if (if_block1) if_block1.m(p, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const input_changes = {};
    			if (dirty & /*lang*/ 1) input_changes.lang = /*lang*/ ctx[0];
    			input.$set(input_changes);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if (if_block0) if_block0.d(1);
    				if_block0 = current_block_type && current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(h3, null);
    				}
    			}

    			if (current_block_type_1 !== (current_block_type_1 = select_block_type_1(ctx))) {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type_1 && current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(p, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(input);

    			if (if_block0) {
    				if_block0.d();
    			}

    			if (if_block1) {
    				if_block1.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Main", slots, []);
    	let { lang = Lang.CHINESE } = $$props;
    	const writable_props = ["lang"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("lang" in $$props) $$invalidate(0, lang = $$props.lang);
    	};

    	$$self.$capture_state = () => ({ Input, constants, lang });

    	$$self.$inject_state = $$props => {
    		if ("lang" in $$props) $$invalidate(0, lang = $$props.lang);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lang];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { lang: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get lang() {
    		throw new Error("<Main>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lang(value) {
    		throw new Error("<Main>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\API.svelte generated by Svelte v3.31.0 */

    const { document: document_1 } = globals;
    const file$2 = "src\\API.svelte";

    function create_fragment$2(ctx) {
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let div29;
    	let div1;
    	let div0;
    	let p;
    	let t1;
    	let br;
    	let t2;
    	let samp;
    	let t4;
    	let div28;
    	let div27;
    	let div2;
    	let h20;
    	let t6;
    	let div15;
    	let div6;
    	let div5;
    	let div3;
    	let t8;
    	let div4;
    	let pre0;
    	let code0;
    	let t10;
    	let div10;
    	let div9;
    	let div7;
    	let t12;
    	let div8;
    	let pre1;
    	let code1;
    	let t14;
    	let div14;
    	let div13;
    	let div11;
    	let t16;
    	let div12;
    	let pre2;
    	let code2;
    	let t18;
    	let div16;
    	let h21;
    	let t20;
    	let div21;
    	let div20;
    	let div19;
    	let div17;
    	let t22;
    	let div18;
    	let pre3;
    	let code3;
    	let t24;
    	let div26;
    	let div25;
    	let div24;
    	let div22;
    	let t26;
    	let div23;
    	let pre4;
    	let code4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			div29 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t1 = text("Requests can be made directly via HTTP or HTTPS. The server responds to GET requests to:");
    			br = element("br");
    			t2 = space();
    			samp = element("samp");
    			samp.textContent = "http[s]://node.dragonfruit.tk/panda_linux/<direction>?query=<query>";
    			t4 = space();
    			div28 = element("div");
    			div27 = element("div");
    			div2 = element("div");
    			h20 = element("h2");
    			h20.textContent = "API Format";
    			t6 = space();
    			div15 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "Valid Directions";
    			t8 = space();
    			div4 = element("div");
    			pre0 = element("pre");
    			code0 = element("code");
    			code0.textContent = "enum Direction {\r\n    s2t = \"s2t\",    // Simplified to Traditional\r\n    s2t = \"t2s\",    // Traditional to Simplified\r\n}";
    			t10 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div7 = element("div");
    			div7.textContent = "Response Format";
    			t12 = space();
    			div8 = element("div");
    			pre1 = element("pre");
    			code1 = element("code");
    			code1.textContent = "{\r\n    \"original\": string,\r\n    \"conversion\": string\r\n}";
    			t14 = space();
    			div14 = element("div");
    			div13 = element("div");
    			div11 = element("div");
    			div11.textContent = "Example";
    			t16 = space();
    			div12 = element("div");
    			pre2 = element("pre");
    			code2 = element("code");
    			code2.textContent = "{\r\n    \"original\": \"汉字\",\r\n    \"conversion\": \"漢字\"\r\n}";
    			t18 = space();
    			div16 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Usage Examples";
    			t20 = space();
    			div21 = element("div");
    			div20 = element("div");
    			div19 = element("div");
    			div17 = element("div");
    			div17.textContent = "Valid URL";
    			t22 = space();
    			div18 = element("div");
    			pre3 = element("pre");
    			code3 = element("code");
    			code3.textContent = "https://node.dragonfruit.tk/panda_linux/s2t?query=汉字";
    			t24 = space();
    			div26 = element("div");
    			div25 = element("div");
    			div24 = element("div");
    			div22 = element("div");
    			div22.textContent = "HTTPS (TypeScript)";
    			t26 = space();
    			div23 = element("div");
    			pre4 = element("pre");
    			code4 = element("code");

    			code4.textContent = `function convert(direction: Direction, query: string) {
    let url = \`https://node.dragonfruit.tk/panda_linux/\$${"{direction}"}?query=\$${"{query}"}\`;
    fetch(url).then(response => {
        response.json().then(p => {
            console.log("Original query: " + p.original);
            console.log("Converted: " + p.conversion);
        })
    });
}`;

    			if (script.src !== (script_src_value = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/highlight.min.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file$2, 9, 4, 215);
    			add_location(br, file$2, 16, 107, 636);
    			add_location(samp, file$2, 17, 16, 660);
    			add_location(p, file$2, 16, 16, 545);
    			attr_dev(div0, "class", "col mx-2");
    			add_location(div0, file$2, 15, 12, 505);
    			attr_dev(div1, "class", "row mt-3 mb-2 center-children svelte-1b6ohak");
    			attr_dev(div1, "id", "intro");
    			add_location(div1, file$2, 14, 8, 437);
    			add_location(h20, file$2, 25, 20, 957);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$2, 24, 16, 918);
    			attr_dev(div3, "class", "card-header");
    			add_location(div3, file$2, 30, 28, 1186);
    			attr_dev(code0, "class", "language-ts");
    			add_location(code0, file$2, 32, 37, 1333);
    			add_location(pre0, file$2, 32, 32, 1328);
    			attr_dev(div4, "class", "card-body bg-code svelte-1b6ohak");
    			add_location(div4, file$2, 31, 28, 1263);
    			attr_dev(div5, "class", "card");
    			add_location(div5, file$2, 29, 24, 1138);
    			attr_dev(div6, "class", "col mx-2");
    			add_location(div6, file$2, 28, 20, 1090);
    			attr_dev(div7, "class", "card-header");
    			add_location(div7, file$2, 43, 28, 1899);
    			attr_dev(code1, "class", "language-ts");
    			add_location(code1, file$2, 45, 37, 2045);
    			add_location(pre1, file$2, 45, 32, 2040);
    			attr_dev(div8, "class", "card-body bg-code svelte-1b6ohak");
    			add_location(div8, file$2, 44, 28, 1975);
    			attr_dev(div9, "class", "card");
    			add_location(div9, file$2, 42, 24, 1851);
    			attr_dev(div10, "class", "col mx-2");
    			add_location(div10, file$2, 41, 20, 1803);
    			attr_dev(div11, "class", "card-header");
    			add_location(div11, file$2, 56, 28, 2547);
    			attr_dev(code2, "class", "language-ts");
    			add_location(code2, file$2, 58, 37, 2685);
    			add_location(pre2, file$2, 58, 32, 2680);
    			attr_dev(div12, "class", "card-body bg-code svelte-1b6ohak");
    			add_location(div12, file$2, 57, 28, 2615);
    			attr_dev(div13, "class", "card");
    			add_location(div13, file$2, 55, 24, 2499);
    			attr_dev(div14, "class", "col mx-2");
    			add_location(div14, file$2, 54, 20, 2451);
    			attr_dev(div15, "class", "row mt-1 mb-4");
    			attr_dev(div15, "id", "server-formatting");
    			add_location(div15, file$2, 27, 16, 1018);
    			add_location(h21, file$2, 70, 20, 3148);
    			attr_dev(div16, "class", "row");
    			add_location(div16, file$2, 69, 16, 3109);
    			attr_dev(div17, "class", "card-header");
    			add_location(div17, file$2, 75, 28, 3369);
    			attr_dev(code3, "class", "plaintext");
    			add_location(code3, file$2, 77, 37, 3509);
    			add_location(pre3, file$2, 77, 32, 3504);
    			attr_dev(div18, "class", "card-body bg-code svelte-1b6ohak");
    			add_location(div18, file$2, 76, 28, 3439);
    			attr_dev(div19, "class", "card");
    			add_location(div19, file$2, 74, 24, 3321);
    			attr_dev(div20, "class", "col mx-2");
    			add_location(div20, file$2, 73, 20, 3273);
    			attr_dev(div21, "class", "row mt-1 mb-2");
    			attr_dev(div21, "id", "https");
    			add_location(div21, file$2, 72, 16, 3213);
    			attr_dev(div22, "class", "card-header");
    			add_location(div22, file$2, 87, 28, 3964);
    			attr_dev(code4, "class", "language-ts");
    			add_location(code4, file$2, 89, 37, 4113);
    			add_location(pre4, file$2, 89, 32, 4108);
    			attr_dev(div23, "class", "card-body bg-code svelte-1b6ohak");
    			add_location(div23, file$2, 88, 28, 4043);
    			attr_dev(div24, "class", "card");
    			add_location(div24, file$2, 86, 24, 3916);
    			attr_dev(div25, "class", "col mx-2");
    			add_location(div25, file$2, 85, 20, 3868);
    			attr_dev(div26, "class", "row mt-1 mb-2");
    			attr_dev(div26, "id", "https");
    			add_location(div26, file$2, 84, 16, 3808);
    			attr_dev(div27, "class", "col mx-2");
    			add_location(div27, file$2, 23, 12, 878);
    			attr_dev(div28, "class", "row mb-10");
    			attr_dev(div28, "id", "code-examples");
    			add_location(div28, file$2, 22, 8, 822);
    			attr_dev(div29, "class", "container text-container");
    			set_style(div29, "margin-bottom", "60px");
    			add_location(div29, file$2, 13, 4, 360);
    			add_location(main, file$2, 12, 0, 348);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div29);
    			append_dev(div29, div1);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(p, t1);
    			append_dev(p, br);
    			append_dev(p, t2);
    			append_dev(p, samp);
    			append_dev(div29, t4);
    			append_dev(div29, div28);
    			append_dev(div28, div27);
    			append_dev(div27, div2);
    			append_dev(div2, h20);
    			append_dev(div27, t6);
    			append_dev(div27, div15);
    			append_dev(div15, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, pre0);
    			append_dev(pre0, code0);
    			append_dev(div15, t10);
    			append_dev(div15, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div7);
    			append_dev(div9, t12);
    			append_dev(div9, div8);
    			append_dev(div8, pre1);
    			append_dev(pre1, code1);
    			append_dev(div15, t14);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div11);
    			append_dev(div13, t16);
    			append_dev(div13, div12);
    			append_dev(div12, pre2);
    			append_dev(pre2, code2);
    			append_dev(div27, t18);
    			append_dev(div27, div16);
    			append_dev(div16, h21);
    			append_dev(div27, t20);
    			append_dev(div27, div21);
    			append_dev(div21, div20);
    			append_dev(div20, div19);
    			append_dev(div19, div17);
    			append_dev(div19, t22);
    			append_dev(div19, div18);
    			append_dev(div18, pre3);
    			append_dev(pre3, code3);
    			append_dev(div27, t24);
    			append_dev(div27, div26);
    			append_dev(div26, div25);
    			append_dev(div25, div24);
    			append_dev(div24, div22);
    			append_dev(div24, t26);
    			append_dev(div24, div23);
    			append_dev(div23, pre4);
    			append_dev(pre4, code4);

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*highlight*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("API", slots, []);

    	const highlight = () => {
    		document.querySelectorAll("pre code").forEach(block => {
    			hljs.highlightBlock(block);
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<API> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ highlight });
    	return [highlight];
    }

    class API extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "API",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Base.svelte generated by Svelte v3.31.0 */

    const { console: console_1$1 } = globals;
    const file$3 = "src\\Base.svelte";

    // (40:4) {:else}
    function create_else_block(ctx) {
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "404 Content Not Found";
    			add_location(h1, file$3, 41, 12, 1287);
    			attr_dev(div, "class", "row my-5");
    			set_style(div, "width", "100%");
    			set_style(div, "justify-content", "center");
    			add_location(div, file$3, 40, 8, 1207);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(40:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (38:48) 
    function create_if_block_3$2(ctx) {
    	let main;
    	let current;

    	main = new Main({
    			props: { lang: /*langToShow*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(main.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(main, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const main_changes = {};
    			if (dirty & /*langToShow*/ 2) main_changes.lang = /*langToShow*/ ctx[1];
    			main.$set(main_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(main, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(38:48) ",
    		ctx
    	});

    	return block;
    }

    // (30:4) {#if pageToShow == constants.Page.API}
    function create_if_block_2$2(ctx) {
    	let api;
    	let t;
    	let div;
    	let span;
    	let i;
    	let current;
    	let mounted;
    	let dispose;
    	api = new API({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(api.$$.fragment);
    			t = space();
    			div = element("div");
    			span = element("span");
    			i = element("i");
    			attr_dev(i, "class", "centered-item fas fa-home fa-2x svelte-1557x16");
    			add_location(i, file$3, 34, 18, 1027);
    			add_location(span, file$3, 34, 12, 1021);
    			attr_dev(div, "class", "container float pointer-hover svelte-1557x16");
    			add_location(div, file$3, 33, 8, 942);
    		},
    		m: function mount(target, anchor) {
    			mount_component(api, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, i);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*renderMain*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(api.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(api.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(api, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(30:4) {#if pageToShow == constants.Page.API}",
    		ctx
    	});

    	return block;
    }

    // (47:4) {#if pageToShow == constants.Page.MAIN}
    function create_if_block_1$2(ctx) {
    	let div;
    	let span;
    	let span_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");

    			attr_dev(span, "class", span_class_value = "" + (null_to_empty(/*langToShow*/ ctx[1] == Lang.CHINESE
    			? "icon-en centered-item"
    			: "icon-cn centered-item") + " svelte-1557x16"));

    			add_location(span, file$3, 48, 12, 1517);
    			attr_dev(div, "class", "container float pointer-hover svelte-1557x16");
    			add_location(div, file$3, 47, 8, 1438);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*changeLang*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*langToShow*/ 2 && span_class_value !== (span_class_value = "" + (null_to_empty(/*langToShow*/ ctx[1] == Lang.CHINESE
    			? "icon-en centered-item"
    			: "icon-cn centered-item") + " svelte-1557x16"))) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(47:4) {#if pageToShow == constants.Page.MAIN}",
    		ctx
    	});

    	return block;
    }

    // (54:8) {#if pageToShow != constants.Page.API}
    function create_if_block$2(ctx) {
    	let p;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "API";
    			attr_dev(p, "class", "my-2 text-white p-link svelte-1557x16");
    			add_location(p, file$3, 54, 12, 1769);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);

    			if (!mounted) {
    				dispose = listen_dev(p, "click", /*renderAPI*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(54:8) {#if pageToShow != constants.Page.API}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t1;
    	let current_block_type_index;
    	let if_block0;
    	let t2;
    	let t3;
    	let footer;
    	let t4;
    	let a;
    	let current;
    	const if_block_creators = [create_if_block_2$2, create_if_block_3$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*pageToShow*/ ctx[0] == Page.API) return 0;
    		if (/*pageToShow*/ ctx[0] == Page.MAIN) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*pageToShow*/ ctx[0] == Page.MAIN && create_if_block_1$2(ctx);
    	let if_block2 = /*pageToShow*/ ctx[0] != Page.API && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "PandaCC";
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			footer = element("footer");
    			if (if_block2) if_block2.c();
    			t4 = space();
    			a = element("a");
    			a.textContent = "Github";
    			attr_dev(h1, "class", "my-3 text-white");
    			add_location(h1, file$3, 25, 8, 730);
    			attr_dev(header, "class", "bg-dark text-center p-2 mb-3");
    			add_location(header, file$3, 24, 4, 675);
    			attr_dev(a, "class", "my-2 text-white svelte-1557x16");
    			attr_dev(a, "href", "https://github.com/minghao912/PandaCC");
    			add_location(a, file$3, 56, 8, 1856);
    			attr_dev(footer, "class", "bg-dark text-center p-2 mt-3 svelte-1557x16");
    			add_location(footer, file$3, 52, 4, 1662);
    			add_location(main, file$3, 23, 0, 663);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(main, t1);
    			if_blocks[current_block_type_index].m(main, null);
    			append_dev(main, t2);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t3);
    			append_dev(main, footer);
    			if (if_block2) if_block2.m(footer, null);
    			append_dev(footer, t4);
    			append_dev(footer, a);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(main, t2);
    			}

    			if (/*pageToShow*/ ctx[0] == Page.MAIN) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(main, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*pageToShow*/ ctx[0] != Page.API) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$2(ctx);
    					if_block2.c();
    					if_block2.m(footer, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Base", slots, []);
    	let pageToShow = Page.MAIN;

    	function renderAPI() {
    		$$invalidate(0, pageToShow = Page.API);
    	}

    	function renderMain() {
    		$$invalidate(0, pageToShow = Page.MAIN);
    	}

    	// Switch language
    	let langToShow = Lang.CHINESE;

    	function changeLang() {
    		if (langToShow == Lang.CHINESE) $$invalidate(1, langToShow = Lang.ENGLISH); else $$invalidate(1, langToShow = Lang.CHINESE);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Base> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Main,
    		API,
    		constants,
    		pageToShow,
    		renderAPI,
    		renderMain,
    		langToShow,
    		changeLang
    	});

    	$$self.$inject_state = $$props => {
    		if ("pageToShow" in $$props) $$invalidate(0, pageToShow = $$props.pageToShow);
    		if ("langToShow" in $$props) $$invalidate(1, langToShow = $$props.langToShow);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*pageToShow*/ 1) {
    			 console.log("> Show page " + pageToShow);
    		}

    		if ($$self.$$.dirty & /*langToShow*/ 2) {
    			 console.log("> Show lang " + langToShow);
    		}
    	};

    	return [pageToShow, langToShow, renderAPI, renderMain, changeLang];
    }

    class Base extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Base",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    //import App from './App.svelte';
    const app = new Base({
        target: document.body,
        props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
