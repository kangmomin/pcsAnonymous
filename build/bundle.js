
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        }
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function empty() {
        return text('');
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
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor, options.customElement);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.44.2 */

    function create_fragment$9(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.44.2 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.44.2 */
    const file$6 = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$7(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$6, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\component\header.svelte generated by Svelte v3.44.2 */
    const file$5 = "src\\component\\header.svelte";

    // (26:8) {:else}
    function create_else_block$2(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: "login",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(26:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (20:8) {#if tocken}
    function create_if_block$2(ctx) {
    	let link;
    	let t0;
    	let input;
    	let t1;
    	let div;
    	let current;
    	let mounted;
    	let dispose;

    	link = new Link({
    			props: {
    				to: "write-post",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			div = element("div");
    			attr_dev(input, "class", "loginBtn svelte-4tvu3l");
    			attr_dev(input, "type", "button");
    			input.value = "로그아웃";
    			add_location(input, file$5, 23, 8, 1070);
    			attr_dev(div, "class", "vector svelte-4tvu3l");
    			add_location(div, file$5, 24, 8, 1170);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, input, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*deleteTocken*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(20:8) {#if tocken}",
    		ctx
    	});

    	return block;
    }

    // (27:8) <Link to="login">
    function create_default_slot_1$1(ctx) {
    	let input;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "loginBtn svelte-4tvu3l");
    			attr_dev(input, "type", "button");
    			input.value = "로그인";
    			add_location(input, file$5, 27, 12, 1267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(27:8) <Link to=\\\"login\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:8) <Link to="write-post">
    function create_default_slot$3(ctx) {
    	let input;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "loginBtn svelte-4tvu3l");
    			attr_dev(input, "type", "button");
    			input.value = "글 작성";
    			add_location(input, file$5, 21, 12, 979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(21:8) <Link to=\\\"write-post\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let input;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tocken*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			input = element("input");
    			t1 = space();
    			if_block.c();
    			if (!src_url_equal(img.src, img_src_value = "../img/bb963f70a53da7f53e08ae6c28e0f2dd5963a909179a89eb42ad47e202c2281515a57a5b6eb427ae452c38e44f1ff8b76ae7b8a52ae50a9ce7cee9201d676d07d844da82ba298baa50b8326eedfd9ef718efdf.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-4tvu3l");
    			add_location(img, file$5, 15, 8, 591);
    			attr_dev(div0, "class", "logo svelte-4tvu3l");
    			add_location(div0, file$5, 14, 4, 563);
    			attr_dev(input, "class", "searchBtn svelte-4tvu3l");
    			attr_dev(input, "type", "button");
    			input.value = "검색";
    			add_location(input, file$5, 18, 8, 849);
    			attr_dev(div1, "class", "headerBtn svelte-4tvu3l");
    			add_location(div1, file$5, 17, 4, 816);
    			attr_dev(div2, "class", "header svelte-4tvu3l");
    			add_location(div2, file$5, 13, 0, 527);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			append_dev(div1, t1);
    			if_blocks[current_block_type_index].m(div1, null);
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
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let tocken;
    	if (document.cookie.split("; ").find(row => row.startsWith("tocken"))) tocken = document.cookie.split("; ").find(row => row.startsWith("tocken")).split("=")[1];

    	function deleteTocken() {
    		document.cookie = "tocken=";
    		if (document.cookie.split("; ").find(row => row.startsWith("tocken"))) $$invalidate(0, tocken = document.cookie.split("; ").find(row => row.startsWith("tocken")).split("=")[1]);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, tocken, deleteTocken });

    	$$self.$inject_state = $$props => {
    		if ('tocken' in $$props) $$invalidate(0, tocken = $$props.tocken);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tocken, deleteTocken];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\component\postList.svelte generated by Svelte v3.44.2 */
    const file$4 = "src\\component\\postList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i].name;
    	child_ctx[13] = list[i].style;
    	child_ctx[14] = list[i].sort;
    	child_ctx[15] = list[i].isClick;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i].id;
    	child_ctx[19] = list[i].title;
    	child_ctx[20] = list[i].created;
    	child_ctx[21] = list[i].view;
    	child_ctx[22] = list[i].good;
    	return child_ctx;
    }

    // (110:0) {:else}
    function create_else_block_2(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Now Loading...";
    			attr_dev(h2, "id", "loading");
    			attr_dev(h2, "class", "svelte-1x84i5k");
    			add_location(h2, file$4, 110, 4, 3364);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(110:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (72:0) {#if posts}
    function create_if_block$1(ctx) {
    	let li;
    	let t0;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let input0;
    	let t2;
    	let t3;
    	let input1;
    	let current;
    	let each_value_2 = /*posts*/ ctx[1].data;
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value_1 = /*controller*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block = /*posts*/ ctx[1].lastPage > 0 && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div1 = element("div");
    			input0 = element("input");
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			input1 = element("input");
    			attr_dev(li, "class", "main svelte-1x84i5k");
    			add_location(li, file$4, 72, 4, 1827);
    			attr_dev(div0, "class", "svelte-1x84i5k");
    			add_location(div0, file$4, 86, 8, 2368);
    			attr_dev(input0, "type", "button");
    			input0.value = "<";
    			attr_dev(input0, "class", "pageNav svelte-1x84i5k");
    			add_location(input0, file$4, 96, 12, 2791);
    			attr_dev(input1, "type", "button");
    			input1.value = ">";
    			attr_dev(input1, "class", "pageNav svelte-1x84i5k");
    			add_location(input1, file$4, 106, 12, 3261);
    			attr_dev(div1, "class", "rectangle svelte-1x84i5k");
    			add_location(div1, file$4, 95, 8, 2754);
    			attr_dev(div2, "class", "controllerBtn svelte-1x84i5k");
    			add_location(div2, file$4, 85, 4, 2316);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(li, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, input0);
    			append_dev(div1, t2);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t3);
    			append_dev(div1, input1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posts*/ 2) {
    				each_value_2 = /*posts*/ ctx[1].data;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(li, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*controller, sortData*/ 9) {
    				each_value_1 = /*controller*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*posts*/ ctx[1].lastPage > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(div1, t3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(72:0) {#if posts}",
    		ctx
    	});

    	return block;
    }

    // (75:12) <Link to="/post/{id}">
    function create_default_slot$2(ctx) {
    	let ul;
    	let p0;
    	let t0_value = /*id*/ ctx[18] + "";
    	let t0;
    	let t1;
    	let p1;
    	let t2_value = /*title*/ ctx[19] + "";
    	let t2;
    	let t3;
    	let p2;
    	let t4_value = /*created*/ ctx[20] + "";
    	let t4;
    	let t5;
    	let p3;
    	let t6_value = /*view*/ ctx[21] + "";
    	let t6;
    	let t7;
    	let p4;
    	let t8_value = /*good*/ ctx[22] + "";
    	let t8;
    	let t9;

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			p2 = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			p3 = element("p");
    			t6 = text(t6_value);
    			t7 = space();
    			p4 = element("p");
    			t8 = text(t8_value);
    			t9 = space();
    			attr_dev(p0, "class", "id svelte-1x84i5k");
    			add_location(p0, file$4, 76, 20, 2015);
    			attr_dev(p1, "class", "title svelte-1x84i5k");
    			add_location(p1, file$4, 77, 20, 2060);
    			attr_dev(p2, "class", "date svelte-1x84i5k");
    			add_location(p2, file$4, 78, 20, 2111);
    			attr_dev(p3, "class", "view svelte-1x84i5k");
    			add_location(p3, file$4, 79, 20, 2163);
    			attr_dev(p4, "class", "like svelte-1x84i5k");
    			add_location(p4, file$4, 80, 20, 2212);
    			attr_dev(ul, "class", "Group svelte-1x84i5k");
    			add_location(ul, file$4, 75, 16, 1975);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, p0);
    			append_dev(p0, t0);
    			append_dev(ul, t1);
    			append_dev(ul, p1);
    			append_dev(p1, t2);
    			append_dev(ul, t3);
    			append_dev(ul, p2);
    			append_dev(p2, t4);
    			append_dev(ul, t5);
    			append_dev(ul, p3);
    			append_dev(p3, t6);
    			append_dev(ul, t7);
    			append_dev(ul, p4);
    			append_dev(p4, t8);
    			insert_dev(target, t9, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posts*/ 2 && t0_value !== (t0_value = /*id*/ ctx[18] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*posts*/ 2 && t2_value !== (t2_value = /*title*/ ctx[19] + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*posts*/ 2 && t4_value !== (t4_value = /*created*/ ctx[20] + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*posts*/ 2 && t6_value !== (t6_value = /*view*/ ctx[21] + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*posts*/ 2 && t8_value !== (t8_value = /*good*/ ctx[22] + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (detaching) detach_dev(t9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(75:12) <Link to=\\\"/post/{id}\\\">",
    		ctx
    	});

    	return block;
    }

    // (74:8) {#each posts.data as {id, title, created, view, good}}
    function create_each_block_2(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: "/post/" + /*id*/ ctx[18],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*posts*/ 2) link_changes.to = "/post/" + /*id*/ ctx[18];

    			if (dirty & /*$$scope, posts*/ 33554434) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(74:8) {#each posts.data as {id, title, created, view, good}}",
    		ctx
    	});

    	return block;
    }

    // (91:16) {:else}
    function create_else_block_1(ctx) {
    	let input;
    	let input_class_value;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*sort*/ ctx[14]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", input_class_value = "" + (null_to_empty(/*style*/ ctx[13]) + " svelte-1x84i5k"));
    			attr_dev(input, "type", "button");
    			input.value = input_value_value = (/*sort*/ ctx[14], /*name*/ ctx[12]);
    			add_location(input, file$4, 91, 20, 2598);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*controller*/ 1 && input_class_value !== (input_class_value = "" + (null_to_empty(/*style*/ ctx[13]) + " svelte-1x84i5k"))) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*controller*/ 1 && input_value_value !== (input_value_value = (/*sort*/ ctx[14], /*name*/ ctx[12]))) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(91:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (89:16) {#if isClick == true}
    function create_if_block_3(ctx) {
    	let input;
    	let input_value_value;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "clickedBtn svelte-1x84i5k");
    			attr_dev(input, "type", "button");
    			input.value = input_value_value = /*name*/ ctx[12];
    			add_location(input, file$4, 89, 20, 2498);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*controller*/ 1 && input_value_value !== (input_value_value = /*name*/ ctx[12])) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(89:16) {#if isClick == true}",
    		ctx
    	});

    	return block;
    }

    // (88:12) {#each controller as {name, style, sort, isClick}}
    function create_each_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*isClick*/ ctx[15] == true) return create_if_block_3;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(88:12) {#each controller as {name, style, sort, isClick}}",
    		ctx
    	});

    	return block;
    }

    // (98:8) {#if posts.lastPage > 0}
    function create_if_block_1$1(ctx) {
    	let each_1_anchor;
    	let each_value = Array(/*posts*/ ctx[1].lastPage);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posts, pageLoader*/ 6) {
    				each_value = Array(/*posts*/ ctx[1].lastPage);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(98:8) {#if posts.lastPage > 0}",
    		ctx
    	});

    	return block;
    }

    // (102:16) {:else}
    function create_else_block$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "button");
    			input.value = /*i*/ ctx[11] + 1;
    			attr_dev(input, "class", "pageNav svelte-1x84i5k");
    			add_location(input, file$4, 102, 20, 3104);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*pageLoader*/ ctx[2](/*i*/ ctx[11] + 1), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(102:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (100:16) {#if posts.nowPage == i+1}
    function create_if_block_2(ctx) {
    	let input;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "button");
    			input.value = /*i*/ ctx[11] + 1;
    			attr_dev(input, "id", "clickedPageNav");
    			attr_dev(input, "class", "svelte-1x84i5k");
    			add_location(input, file$4, 100, 20, 3002);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(100:16) {#if posts.nowPage == i+1}",
    		ctx
    	});

    	return block;
    }

    // (99:12) {#each Array(posts.lastPage) as _, i}
    function create_each_block(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*posts*/ ctx[1].nowPage == /*i*/ ctx[11] + 1) return create_if_block_2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(99:12) {#each Array(posts.lastPage) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let p2;
    	let t5;
    	let p3;
    	let t7;
    	let p4;
    	let t9;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*posts*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "아이디";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "제목";
    			t3 = space();
    			p2 = element("p");
    			p2.textContent = "작성일";
    			t5 = space();
    			p3 = element("p");
    			p3.textContent = "조회수";
    			t7 = space();
    			p4 = element("p");
    			p4.textContent = "추천수";
    			t9 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(p0, "class", "id svelte-1x84i5k");
    			add_location(p0, file$4, 65, 4, 1663);
    			attr_dev(p1, "class", "title svelte-1x84i5k");
    			add_location(p1, file$4, 66, 4, 1690);
    			attr_dev(p2, "class", "date svelte-1x84i5k");
    			add_location(p2, file$4, 67, 4, 1719);
    			attr_dev(p3, "class", "view svelte-1x84i5k");
    			add_location(p3, file$4, 68, 4, 1748);
    			attr_dev(p4, "class", "like svelte-1x84i5k");
    			add_location(p4, file$4, 69, 4, 1777);
    			attr_dev(div, "class", "info svelte-1x84i5k");
    			add_location(div, file$4, 64, 0, 1620);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(div, t3);
    			append_dev(div, p2);
    			append_dev(div, t5);
    			append_dev(div, p3);
    			append_dev(div, t7);
    			append_dev(div, p4);
    			insert_dev(target, t9, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
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
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t9);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PostList', slots, []);
    	const urlParams = new URLSearchParams(window.location.search);
    	const page = urlParams.get("page");
    	const search = urlParams.get("search") || null;

    	let controller = [
    		{
    			name: "추천순",
    			style: "categoryBtn",
    			sort: "good",
    			isClick: true
    		},
    		{
    			name: "조회순",
    			style: "categoryBtn",
    			sort: "view",
    			isClick: false
    		},
    		{
    			name: "등록순",
    			style: "categoryBtn",
    			sort: "insert",
    			isClick: false
    		}
    	];

    	let links = `http://koldin.myddns.me:3101/post?page=${page}`;
    	let posts = false;
    	if (search != null) links += `&search=${search}`;

    	onMount(async () => {
    		// document.cookie = "tocken="
    		const res = await fetch(links);

    		$$invalidate(1, posts = await res.json());
    	});

    	async function pageLoader(page) {
    		let links = `http://koldin.myddns.me:3101/post?page=${page}`;
    		if (search != null) links += `&search=${search}`;
    		const res = await fetch(links);
    		await res.json();
    	}

    	async function sortData(_sort) {
    		for (let i = 0; i < controller.length; i++) {
    			$$invalidate(0, controller[i].isClick = false, controller);
    			if (controller[i].sort == _sort) $$invalidate(0, controller[i].isClick = true, controller);
    		}

    		if (_sort == "insert") _sort = "id";
    		let links = `http://koldin.myddns.me:3101/post?page=${page}&sort=${_sort}`;
    		if (search != null) links += `&search=${search}`;
    		const res = await fetch(links);
    		$$invalidate(1, posts = await res.json());
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PostList> was created with unknown prop '${key}'`);
    	});

    	const click_handler = sort => sortData(sort);

    	$$self.$capture_state = () => ({
    		Link,
    		onMount,
    		urlParams,
    		page,
    		search,
    		controller,
    		links,
    		posts,
    		pageLoader,
    		sortData
    	});

    	$$self.$inject_state = $$props => {
    		if ('controller' in $$props) $$invalidate(0, controller = $$props.controller);
    		if ('links' in $$props) links = $$props.links;
    		if ('posts' in $$props) $$invalidate(1, posts = $$props.posts);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [controller, posts, pageLoader, sortData, click_handler];
    }

    class PostList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PostList",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\component\eachPost.svelte generated by Svelte v3.44.2 */
    const file$3 = "src\\component\\eachPost.svelte";

    // (52:4) {:else}
    function create_else_block(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Now Loading...";
    			attr_dev(h1, "id", "loading");
    			attr_dev(h1, "class", "svelte-1ink9x8");
    			add_location(h1, file$3, 52, 8, 1810);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(52:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (26:4) {#if post}
    function create_if_block(ctx) {
    	let div0;
    	let p0;
    	let t0_value = /*post*/ ctx[0].description + "";
    	let t0;
    	let t1;
    	let div3;
    	let div1;
    	let t2;
    	let t3_value = /*post*/ ctx[0].ownerId + "";
    	let t3;
    	let t4;
    	let div2;
    	let p1;
    	let t5;
    	let t6_value = /*post*/ ctx[0].view + "";
    	let t6;
    	let t7;
    	let p2;
    	let t8;
    	let t9_value = /*post*/ ctx[0].good + "";
    	let t9;
    	let t10;
    	let p3;
    	let t11;
    	let t12_value = /*post*/ ctx[0].replyCount + "";
    	let t12;
    	let t13;
    	let p4;
    	let t14;
    	let t15_value = /*post*/ ctx[0].created + "";
    	let t15;
    	let t16;
    	let div5;
    	let p5;
    	let t17_value = /*post*/ ctx[0].description + "";
    	let t17;
    	let t18;
    	let div4;
    	let if_block = /*tocken*/ ctx[1].length > 1 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t2 = text("USER-");
    			t3 = text(t3_value);
    			t4 = space();
    			div2 = element("div");
    			p1 = element("p");
    			t5 = text("조회수 ");
    			t6 = text(t6_value);
    			t7 = space();
    			p2 = element("p");
    			t8 = text("추천 ");
    			t9 = text(t9_value);
    			t10 = space();
    			p3 = element("p");
    			t11 = text("댓글 ");
    			t12 = text(t12_value);
    			t13 = space();
    			p4 = element("p");
    			t14 = text("작성일 ");
    			t15 = text(t15_value);
    			t16 = space();
    			div5 = element("div");
    			p5 = element("p");
    			t17 = text(t17_value);
    			t18 = space();
    			div4 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(p0, "class", "svelte-1ink9x8");
    			add_location(p0, file$3, 27, 12, 877);
    			attr_dev(div0, "class", "descriptionTitle svelte-1ink9x8");
    			add_location(div0, file$3, 26, 8, 823);
    			attr_dev(div1, "class", "descriptionId svelte-1ink9x8");
    			add_location(div1, file$3, 30, 12, 990);
    			attr_dev(p1, "class", "svelte-1ink9x8");
    			add_location(p1, file$3, 34, 16, 1173);
    			attr_dev(p2, "class", "svelte-1ink9x8");
    			add_location(p2, file$3, 35, 16, 1213);
    			attr_dev(p3, "class", "svelte-1ink9x8");
    			add_location(p3, file$3, 36, 16, 1252);
    			attr_dev(p4, "class", "svelte-1ink9x8");
    			add_location(p4, file$3, 37, 16, 1297);
    			attr_dev(div2, "class", "descriptionInfomation svelte-1ink9x8");
    			add_location(div2, file$3, 33, 12, 1103);
    			attr_dev(div3, "class", "descriptionInfoArea svelte-1ink9x8");
    			add_location(div3, file$3, 29, 8, 929);
    			attr_dev(p5, "class", "svelte-1ink9x8");
    			add_location(p5, file$3, 41, 12, 1420);
    			attr_dev(div4, "class", "descriptionBtn svelte-1ink9x8");
    			add_location(div4, file$3, 44, 12, 1491);
    			attr_dev(div5, "class", "description svelte-1ink9x8");
    			add_location(div5, file$3, 40, 8, 1368);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, p1);
    			append_dev(p1, t5);
    			append_dev(p1, t6);
    			append_dev(div2, t7);
    			append_dev(div2, p2);
    			append_dev(p2, t8);
    			append_dev(p2, t9);
    			append_dev(div2, t10);
    			append_dev(div2, p3);
    			append_dev(p3, t11);
    			append_dev(p3, t12);
    			append_dev(div2, t13);
    			append_dev(div2, p4);
    			append_dev(p4, t14);
    			append_dev(p4, t15);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, p5);
    			append_dev(p5, t17);
    			append_dev(div5, t18);
    			append_dev(div5, div4);
    			if (if_block) if_block.m(div4, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*post*/ 1 && t0_value !== (t0_value = /*post*/ ctx[0].description + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*post*/ 1 && t3_value !== (t3_value = /*post*/ ctx[0].ownerId + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*post*/ 1 && t6_value !== (t6_value = /*post*/ ctx[0].view + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*post*/ 1 && t9_value !== (t9_value = /*post*/ ctx[0].good + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*post*/ 1 && t12_value !== (t12_value = /*post*/ ctx[0].replyCount + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*post*/ 1 && t15_value !== (t15_value = /*post*/ ctx[0].created + "")) set_data_dev(t15, t15_value);
    			if (dirty & /*post*/ 1 && t17_value !== (t17_value = /*post*/ ctx[0].description + "")) set_data_dev(t17, t17_value);

    			if (/*tocken*/ ctx[1].length > 1) {
    				if (if_block) ; else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div4, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(div5);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(26:4) {#if post}",
    		ctx
    	});

    	return block;
    }

    // (46:16) {#if tocken.length > 1}
    function create_if_block_1(ctx) {
    	let input0;
    	let t;
    	let input1;

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t = space();
    			input1 = element("input");
    			attr_dev(input0, "class", "likeBtn svelte-1ink9x8");
    			attr_dev(input0, "type", "button");
    			input0.value = "추천";
    			add_location(input0, file$3, 46, 20, 1582);
    			attr_dev(input1, "class", "hateBtn svelte-1ink9x8");
    			attr_dev(input1, "type", "button");
    			input1.value = "비추천";
    			add_location(input1, file$3, 47, 20, 1665);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, input1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(input1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(46:16) {#if tocken.length > 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div17;
    	let t0;
    	let div16;
    	let div3;
    	let div0;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let div1;
    	let t6;
    	let div2;
    	let input0;
    	let t7;
    	let input1;
    	let t8;
    	let div7;
    	let div4;
    	let p2;
    	let span;
    	let t10;
    	let t11;
    	let p3;
    	let t13;
    	let div5;
    	let t15;
    	let div6;
    	let input2;
    	let t16;
    	let input3;
    	let t17;
    	let div11;
    	let div8;
    	let p4;
    	let t19;
    	let p5;
    	let t21;
    	let div9;
    	let t23;
    	let div10;
    	let input4;
    	let t24;
    	let input5;
    	let t25;
    	let div15;
    	let div12;
    	let p6;
    	let t27;
    	let p7;
    	let t29;
    	let div13;
    	let t31;
    	let div14;
    	let input6;
    	let t32;
    	let input7;

    	function select_block_type(ctx, dirty) {
    		if (/*post*/ ctx[0]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div17 = element("div");
    			if_block.c();
    			t0 = space();
    			div16 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "US***";
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "21-12-08 04:49";
    			t4 = space();
    			div1 = element("div");
    			div1.textContent = "print(\"hello World\"); ㄹㅇㅋㅋ";
    			t6 = space();
    			div2 = element("div");
    			input0 = element("input");
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			div7 = element("div");
    			div4 = element("div");
    			p2 = element("p");
    			span = element("span");
    			span.textContent = "ㄴ";
    			t10 = text(" US***");
    			t11 = space();
    			p3 = element("p");
    			p3.textContent = "21-12-08 04:49";
    			t13 = space();
    			div5 = element("div");
    			div5.textContent = "잘못 달았누";
    			t15 = space();
    			div6 = element("div");
    			input2 = element("input");
    			t16 = space();
    			input3 = element("input");
    			t17 = space();
    			div11 = element("div");
    			div8 = element("div");
    			p4 = element("p");
    			p4.textContent = "US***";
    			t19 = space();
    			p5 = element("p");
    			p5.textContent = "21-12-08 04:49";
    			t21 = space();
    			div9 = element("div");
    			div9.textContent = "print(\"hello World\"); ㄹㅇㅋㅋ";
    			t23 = space();
    			div10 = element("div");
    			input4 = element("input");
    			t24 = space();
    			input5 = element("input");
    			t25 = space();
    			div15 = element("div");
    			div12 = element("div");
    			p6 = element("p");
    			p6.textContent = "US***";
    			t27 = space();
    			p7 = element("p");
    			p7.textContent = "21-12-08 04:49";
    			t29 = space();
    			div13 = element("div");
    			div13.textContent = "print(\"hello World\"); ㄹㅇㅋㅋ";
    			t31 = space();
    			div14 = element("div");
    			input6 = element("input");
    			t32 = space();
    			input7 = element("input");
    			attr_dev(p0, "class", "id svelte-1ink9x8");
    			add_location(p0, file$3, 57, 16, 2015);
    			attr_dev(p1, "class", "date svelte-1ink9x8");
    			add_location(p1, file$3, 60, 16, 2114);
    			attr_dev(div0, "class", "replyInfo svelte-1ink9x8");
    			add_location(div0, file$3, 56, 12, 1958);
    			attr_dev(div1, "class", "replyText svelte-1ink9x8");
    			add_location(div1, file$3, 64, 12, 2236);
    			attr_dev(input0, "type", "button");
    			attr_dev(input0, "href", "#");
    			attr_dev(input0, "class", "report svelte-1ink9x8");
    			input0.value = "신고";
    			add_location(input0, file$3, 68, 16, 2407);
    			attr_dev(input1, "type", "button");
    			attr_dev(input1, "href", "#");
    			attr_dev(input1, "class", "ref-replyBtn svelte-1ink9x8");
    			input1.value = "답글달기";
    			add_location(input1, file$3, 69, 16, 2493);
    			attr_dev(div2, "class", "otherBtn svelte-1ink9x8");
    			add_location(div2, file$3, 67, 12, 2350);
    			attr_dev(div3, "class", "replyBox svelte-1ink9x8");
    			add_location(div3, file$3, 55, 8, 1908);
    			attr_dev(span, "class", "svelte-1ink9x8");
    			add_location(span, file$3, 75, 19, 2739);
    			attr_dev(p2, "class", "id svelte-1ink9x8");
    			add_location(p2, file$3, 74, 16, 2704);
    			attr_dev(p3, "class", "date svelte-1ink9x8");
    			add_location(p3, file$3, 77, 16, 2799);
    			attr_dev(div4, "class", "replyInfo svelte-1ink9x8");
    			add_location(div4, file$3, 73, 12, 2663);
    			attr_dev(div5, "class", "replyText svelte-1ink9x8");
    			add_location(div5, file$3, 81, 12, 2907);
    			attr_dev(input2, "type", "button");
    			attr_dev(input2, "href", "#");
    			attr_dev(input2, "class", "reportBtn svelte-1ink9x8");
    			input2.value = "신고";
    			add_location(input2, file$3, 85, 16, 3028);
    			attr_dev(input3, "type", "button");
    			attr_dev(input3, "href", "#");
    			attr_dev(input3, "class", "ref-replyBtn svelte-1ink9x8");
    			input3.value = "답글달기";
    			add_location(input3, file$3, 86, 16, 3105);
    			attr_dev(div6, "class", "otherBtn svelte-1ink9x8");
    			add_location(div6, file$3, 84, 12, 2988);
    			attr_dev(div7, "class", "refReply svelte-1ink9x8");
    			add_location(div7, file$3, 72, 8, 2616);
    			attr_dev(p4, "class", "id svelte-1ink9x8");
    			add_location(p4, file$3, 91, 16, 3292);
    			attr_dev(p5, "class", "date svelte-1ink9x8");
    			add_location(p5, file$3, 94, 16, 3373);
    			attr_dev(div8, "class", "replyInfo svelte-1ink9x8");
    			add_location(div8, file$3, 90, 12, 3251);
    			attr_dev(div9, "class", "replyText svelte-1ink9x8");
    			add_location(div9, file$3, 98, 12, 3481);
    			attr_dev(input4, "type", "button");
    			attr_dev(input4, "href", "#");
    			attr_dev(input4, "class", "report svelte-1ink9x8");
    			input4.value = "신고";
    			add_location(input4, file$3, 102, 16, 3622);
    			attr_dev(input5, "type", "button");
    			attr_dev(input5, "href", "#");
    			attr_dev(input5, "class", "ref-replyBtn svelte-1ink9x8");
    			input5.value = "답글달기";
    			add_location(input5, file$3, 103, 16, 3696);
    			attr_dev(div10, "class", "otherBtn svelte-1ink9x8");
    			add_location(div10, file$3, 101, 12, 3582);
    			attr_dev(div11, "class", "replyBox svelte-1ink9x8");
    			add_location(div11, file$3, 89, 8, 3215);
    			attr_dev(p6, "class", "id svelte-1ink9x8");
    			add_location(p6, file$3, 108, 16, 3883);
    			attr_dev(p7, "class", "date svelte-1ink9x8");
    			add_location(p7, file$3, 111, 16, 3964);
    			attr_dev(div12, "class", "replyInfo svelte-1ink9x8");
    			add_location(div12, file$3, 107, 12, 3842);
    			attr_dev(div13, "class", "replyText svelte-1ink9x8");
    			add_location(div13, file$3, 115, 12, 4072);
    			attr_dev(input6, "type", "button");
    			attr_dev(input6, "href", "#");
    			attr_dev(input6, "class", "report svelte-1ink9x8");
    			input6.value = "신고";
    			add_location(input6, file$3, 119, 16, 4213);
    			attr_dev(input7, "type", "button");
    			attr_dev(input7, "href", "#");
    			attr_dev(input7, "class", "ref-replyBtn svelte-1ink9x8");
    			input7.value = "답글달기";
    			add_location(input7, file$3, 120, 16, 4287);
    			attr_dev(div14, "class", "otherBtn svelte-1ink9x8");
    			add_location(div14, file$3, 118, 12, 4173);
    			attr_dev(div15, "class", "replyBox svelte-1ink9x8");
    			add_location(div15, file$3, 106, 8, 3806);
    			attr_dev(div16, "class", "replyArea svelte-1ink9x8");
    			add_location(div16, file$3, 54, 4, 1863);
    			attr_dev(div17, "class", "descriptionArea svelte-1ink9x8");
    			add_location(div17, file$3, 24, 0, 742);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div17, anchor);
    			if_block.m(div17, null);
    			append_dev(div17, t0);
    			append_dev(div17, div16);
    			append_dev(div16, div3);
    			append_dev(div3, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t2);
    			append_dev(div0, p1);
    			append_dev(div3, t4);
    			append_dev(div3, div1);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, input0);
    			append_dev(div2, t7);
    			append_dev(div2, input1);
    			append_dev(div16, t8);
    			append_dev(div16, div7);
    			append_dev(div7, div4);
    			append_dev(div4, p2);
    			append_dev(p2, span);
    			append_dev(p2, t10);
    			append_dev(div4, t11);
    			append_dev(div4, p3);
    			append_dev(div7, t13);
    			append_dev(div7, div5);
    			append_dev(div7, t15);
    			append_dev(div7, div6);
    			append_dev(div6, input2);
    			append_dev(div6, t16);
    			append_dev(div6, input3);
    			append_dev(div16, t17);
    			append_dev(div16, div11);
    			append_dev(div11, div8);
    			append_dev(div8, p4);
    			append_dev(div8, t19);
    			append_dev(div8, p5);
    			append_dev(div11, t21);
    			append_dev(div11, div9);
    			append_dev(div11, t23);
    			append_dev(div11, div10);
    			append_dev(div10, input4);
    			append_dev(div10, t24);
    			append_dev(div10, input5);
    			append_dev(div16, t25);
    			append_dev(div16, div15);
    			append_dev(div15, div12);
    			append_dev(div12, p6);
    			append_dev(div12, t27);
    			append_dev(div12, p7);
    			append_dev(div15, t29);
    			append_dev(div15, div13);
    			append_dev(div15, t31);
    			append_dev(div15, div14);
    			append_dev(div14, input6);
    			append_dev(div14, t32);
    			append_dev(div14, input7);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div17, t0);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div17);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EachPost', slots, []);
    	let { postId } = $$props;
    	let post;
    	let tocken;
    	if (document.cookie.split("; ").find(row => row.startsWith("tocken"))) tocken = document.cookie.split("; ").find(row => row.startsWith("tocken")).split("=")[1];

    	onMount(async () => {
    		let res = await fetch("http://koldin.myddns.me:3101/post/" + postId, {
    			method: "POST",
    			body: JSON.stringify({ tocken })
    		});

    		$$invalidate(0, post = await res.json());
    	});

    	const writable_props = ['postId'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EachPost> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('postId' in $$props) $$invalidate(2, postId = $$props.postId);
    	};

    	$$self.$capture_state = () => ({ onMount, postId, post, tocken });

    	$$self.$inject_state = $$props => {
    		if ('postId' in $$props) $$invalidate(2, postId = $$props.postId);
    		if ('post' in $$props) $$invalidate(0, post = $$props.post);
    		if ('tocken' in $$props) $$invalidate(1, tocken = $$props.tocken);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [post, tocken, postId];
    }

    class EachPost extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { postId: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EachPost",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*postId*/ ctx[2] === undefined && !('postId' in props)) {
    			console.warn("<EachPost> was created without expected prop 'postId'");
    		}
    	}

    	get postId() {
    		throw new Error("<EachPost>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set postId(value) {
    		throw new Error("<EachPost>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\component\login.svelte generated by Svelte v3.44.2 */
    const file$2 = "src\\component\\login.svelte";

    // (50:8) <Link to="sign-up">
    function create_default_slot$1(ctx) {
    	let input;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "button");
    			input.value = "회원가입";
    			attr_dev(input, "class", "svelte-1behz7s");
    			add_location(input, file$2, 50, 12, 1614);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(50:8) <Link to=\\\"sign-up\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div4;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let input0;
    	let t1;
    	let div2;
    	let input1;
    	let t2;
    	let div3;
    	let link;
    	let t3;
    	let input2;
    	let current;
    	let mounted;
    	let dispose;

    	link = new Link({
    			props: {
    				to: "sign-up",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			input0 = element("input");
    			t1 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t2 = space();
    			div3 = element("div");
    			create_component(link.$$.fragment);
    			t3 = space();
    			input2 = element("input");
    			if (!src_url_equal(img.src, img_src_value = "../img/bb963f70a53da7f53e08ae6c28e0f2dd5963a909179a89eb42ad47e202c2281515a57a5b6eb427ae452c38e44f1ff8b76ae7b8a52ae50a9ce7cee9201d676d07d844da82ba298baa50b8326eedfd9ef718efdf.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1behz7s");
    			add_location(img, file$2, 40, 8, 1065);
    			attr_dev(div0, "class", "logo svelte-1behz7s");
    			add_location(div0, file$2, 39, 4, 1037);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "id");
    			attr_dev(input0, "placeholder", "아이디");
    			attr_dev(input0, "class", "svelte-1behz7s");
    			add_location(input0, file$2, 43, 8, 1317);
    			attr_dev(div1, "class", "id svelte-1behz7s");
    			add_location(div1, file$2, 42, 4, 1291);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "placeholder", "비밀번호");
    			attr_dev(input1, "class", "svelte-1behz7s");
    			add_location(input1, file$2, 46, 8, 1439);
    			attr_dev(div2, "class", "password svelte-1behz7s");
    			add_location(div2, file$2, 45, 4, 1407);
    			attr_dev(input2, "type", "button");
    			input2.value = "로그인";
    			attr_dev(input2, "class", "svelte-1behz7s");
    			add_location(input2, file$2, 52, 8, 1690);
    			attr_dev(div3, "class", "controlBtn svelte-1behz7s");
    			add_location(div3, file$2, 48, 4, 1547);
    			attr_dev(div4, "class", "login svelte-1behz7s");
    			add_location(div4, file$2, 38, 0, 1011);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, img);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*id*/ ctx[0]);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div2, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			mount_component(link, div3, null);
    			append_dev(div3, t3);
    			append_dev(div3, input2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(input2, "click", /*login*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 1 && input0.value !== /*id*/ ctx[0]) {
    				set_input_value(input0, /*id*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}

    			const link_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(link);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('Login', slots, []);
    	let id = "";
    	let password = "";

    	async function login() {
    		if (id.length < 1 || password.length < 1) {
    			return alert("아이디 혹은 패스워드는 필수 기입칸입니다.");
    		}

    		let res = await fetch("http://koldin.myddns.me:3101/login", {
    			method: "post",
    			credentials: 'include',
    			body: JSON.stringify({
    				"accountId": id,
    				"accountPassword": password
    			})
    		});

    		res = await res.json();

    		if (res.err) {
    			switch (res.message) {
    				case "id is wrong":
    					alert("존재하지 않는 아이디입니다.");
    					return;
    				case "password is wrong":
    					alert("잘못된 비밀번호입니다.");
    					return;
    			}
    		}

    		document.cookie = "tocken=" + res.tocken;
    		location.href = "/";
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		id = this.value;
    		$$invalidate(0, id);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({ Link, id, password, login });

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, password, login, input0_input_handler, input1_input_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\component\signUp.svelte generated by Svelte v3.44.2 */

    const { console: console_1 } = globals;
    const file$1 = "src\\component\\signUp.svelte";

    function create_fragment$2(ctx) {
    	let div8;
    	let div7;
    	let div2;
    	let div0;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let div1;
    	let input2;
    	let t2;
    	let div3;
    	let input3;
    	let t3;
    	let input4;
    	let t4;
    	let input5;
    	let t5;
    	let div6;
    	let div4;
    	let img;
    	let img_src_value;
    	let t6;
    	let div5;
    	let t7;
    	let br0;
    	let t8;
    	let input6;
    	let t9;
    	let input7;
    	let t10;
    	let br1;
    	let t11;
    	let input8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div7 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			div1 = element("div");
    			input2 = element("input");
    			t2 = space();
    			div3 = element("div");
    			input3 = element("input");
    			t3 = space();
    			input4 = element("input");
    			t4 = space();
    			input5 = element("input");
    			t5 = space();
    			div6 = element("div");
    			div4 = element("div");
    			img = element("img");
    			t6 = space();
    			div5 = element("div");
    			t7 = text("학생증을 업로드 해주세요!\r\n                ");
    			br0 = element("br");
    			t8 = space();
    			input6 = element("input");
    			t9 = space();
    			input7 = element("input");
    			t10 = space();
    			br1 = element("br");
    			t11 = space();
    			input8 = element("input");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "아이디");
    			attr_dev(input0, "class", "svelte-8rf7mw");
    			add_location(input0, file$1, 84, 16, 2338);
    			attr_dev(input1, "type", "button");
    			attr_dev(input1, "class", "duplicate svelte-8rf7mw");
    			input1.value = "중복체크";
    			add_location(input1, file$1, 85, 16, 2409);
    			attr_dev(div0, "class", "id svelte-8rf7mw");
    			add_location(div0, file$1, 83, 12, 2294);
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "placeholder", "비밀번호");
    			attr_dev(input2, "class", "svelte-8rf7mw");
    			add_location(input2, file$1, 88, 16, 2602);
    			attr_dev(div1, "class", "password svelte-8rf7mw");
    			add_location(div1, file$1, 87, 12, 2550);
    			attr_dev(div2, "class", "info svelte-8rf7mw");
    			add_location(div2, file$1, 82, 8, 2262);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "placeholder", "학번 ex)10101");
    			attr_dev(input3, "class", "svelte-8rf7mw");
    			add_location(input3, file$1, 92, 12, 2749);
    			attr_dev(input4, "type", "button");
    			attr_dev(input4, "class", "duplicate svelte-8rf7mw");
    			input4.value = "중복체크";
    			add_location(input4, file$1, 93, 12, 2845);
    			attr_dev(input5, "type", "text");
    			attr_dev(input5, "placeholder", "이름");
    			attr_dev(input5, "class", "svelte-8rf7mw");
    			add_location(input5, file$1, 94, 12, 2959);
    			attr_dev(div3, "class", "otherInfo svelte-8rf7mw");
    			add_location(div3, file$1, 91, 8, 2712);
    			if (!src_url_equal(img.src, img_src_value = /*avatar*/ ctx[4])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "280");
    			attr_dev(img, "height", "370");
    			attr_dev(img, "class", "svelte-8rf7mw");
    			add_location(img, file$1, 98, 16, 3147);
    			attr_dev(div4, "class", "connImg svelte-8rf7mw");
    			add_location(div4, file$1, 97, 12, 3088);
    			attr_dev(br0, "class", "svelte-8rf7mw");
    			add_location(br0, file$1, 102, 16, 3307);
    			attr_dev(input6, "type", "file");
    			attr_dev(input6, "accept", "image/*");
    			attr_dev(input6, "placeholder", "이미지 업로드");
    			attr_dev(input6, "class", "svelte-8rf7mw");
    			add_location(input6, file$1, 103, 16, 3329);
    			attr_dev(input7, "type", "button");
    			input7.value = "이미지 삽입";
    			attr_dev(input7, "class", "svelte-8rf7mw");
    			add_location(input7, file$1, 105, 16, 3479);
    			attr_dev(div5, "class", "controlBtn svelte-8rf7mw");
    			add_location(div5, file$1, 100, 12, 3233);
    			attr_dev(div6, "class", "imgArea svelte-8rf7mw");
    			add_location(div6, file$1, 96, 8, 3053);
    			attr_dev(br1, "class", "svelte-8rf7mw");
    			add_location(br1, file$1, 108, 8, 3599);
    			attr_dev(input8, "type", "button");
    			input8.value = "회원가입";
    			attr_dev(input8, "id", "signUpBtn");
    			attr_dev(input8, "class", "svelte-8rf7mw");
    			add_location(input8, file$1, 109, 8, 3613);
    			attr_dev(div7, "class", "main svelte-8rf7mw");
    			add_location(div7, file$1, 81, 4, 2234);
    			attr_dev(div8, "class", "root svelte-8rf7mw");
    			add_location(div8, file$1, 80, 0, 2210);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div7);
    			append_dev(div7, div2);
    			append_dev(div2, div0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*id*/ ctx[1]);
    			append_dev(div0, t0);
    			append_dev(div0, input1);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, input2);
    			set_input_value(input2, /*password*/ ctx[2]);
    			append_dev(div7, t2);
    			append_dev(div7, div3);
    			append_dev(div3, input3);
    			set_input_value(input3, /*studentId*/ ctx[0]);
    			append_dev(div3, t3);
    			append_dev(div3, input4);
    			append_dev(div3, t4);
    			append_dev(div3, input5);
    			set_input_value(input5, /*name*/ ctx[3]);
    			append_dev(div7, t5);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, img);
    			append_dev(div6, t6);
    			append_dev(div6, div5);
    			append_dev(div5, t7);
    			append_dev(div5, br0);
    			append_dev(div5, t8);
    			append_dev(div5, input6);
    			append_dev(div5, t9);
    			append_dev(div5, input7);
    			append_dev(div7, t10);
    			append_dev(div7, br1);
    			append_dev(div7, t11);
    			append_dev(div7, input8);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "click", /*click_handler*/ ctx[10], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[12]),
    					listen_dev(input4, "click", /*click_handler_1*/ ctx[13], false, false, false),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[14]),
    					listen_dev(input6, "change", /*change_handler*/ ctx[15], false, false, false),
    					listen_dev(input7, "click", /*imgUpload*/ ctx[7], false, false, false),
    					listen_dev(input8, "click", /*signUp*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 2 && input0.value !== /*id*/ ctx[1]) {
    				set_input_value(input0, /*id*/ ctx[1]);
    			}

    			if (dirty & /*password*/ 4 && input2.value !== /*password*/ ctx[2]) {
    				set_input_value(input2, /*password*/ ctx[2]);
    			}

    			if (dirty & /*studentId*/ 1 && input3.value !== /*studentId*/ ctx[0]) {
    				set_input_value(input3, /*studentId*/ ctx[0]);
    			}

    			if (dirty & /*name*/ 8 && input5.value !== /*name*/ ctx[3]) {
    				set_input_value(input5, /*name*/ ctx[3]);
    			}

    			if (dirty & /*avatar*/ 16 && !src_url_equal(img.src, img_src_value = /*avatar*/ ctx[4])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('SignUp', slots, []);
    	let studentId = "", id = "", password = "", name = "", authImgPath = "";
    	let files, avatar;

    	async function overlapChecker(type) {
    		let link = "http://koldin.myddns.me:3101/overlap-check/" + type;
    		let body;

    		if (type === "student-id") {
    			if (studentId.length < 5) return alert("학번을 적어주십시오.");
    			body = JSON.stringify({ studentId });
    		} else if (type === "id") {
    			if (id.length < 1) return alert("아이디를 적어주십시오.");
    			body = JSON.stringify({ id });
    		}

    		let res = await fetch(link, { method: "post", body });
    		let data = await res.json();
    		if (data.IsOverlap) return alert("사용이 불가능합니다.");
    		alert("사용이 가능합니다.");
    	}

    	async function signUp() {
    		if (!id.length || !name.length || !password.length || !studentId.length) {
    			return alert("모든 칸을 채워주십시오");
    		}

    		let body = JSON.stringify({
    			id,
    			name,
    			password,
    			studentId,
    			authImg: authImgPath
    		});

    		console.log(body);
    		let res = await fetch("http://koldin.myddns.me:3101/sign-up", { method: "post", body });

    		if (res) {
    			alert("가입 완료");

    			// location.href = "/login"
    			return;
    		}

    		alert("something is wrong value");
    	}

    	async function imgUpload() {
    		let data = files;
    		let form = new FormData();
    		form.append("image", data);
    		let res = await fetch("http://koldin.myddns.me:3101/upload", { method: "post", body: form });
    		let path = await res.json();
    		authImgPath = path.imgPath;
    		alert("업로드가 완료되었습니다");
    	}

    	const onFileSelected = e => {
    		files = e.target.files[0];
    		let reader = new FileReader();
    		reader.readAsDataURL(files);

    		reader.onload = e => {
    			$$invalidate(4, avatar = e.target.result);
    		};
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<SignUp> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		id = this.value;
    		$$invalidate(1, id);
    	}

    	const click_handler = () => overlapChecker('id');

    	function input2_input_handler() {
    		password = this.value;
    		$$invalidate(2, password);
    	}

    	function input3_input_handler() {
    		studentId = this.value;
    		$$invalidate(0, studentId);
    	}

    	const click_handler_1 = () => overlapChecker('student-id');

    	function input5_input_handler() {
    		name = this.value;
    		$$invalidate(3, name);
    	}

    	const change_handler = e => {
    		onFileSelected(e);
    	};

    	$$self.$capture_state = () => ({
    		studentId,
    		id,
    		password,
    		name,
    		authImgPath,
    		files,
    		avatar,
    		overlapChecker,
    		signUp,
    		imgUpload,
    		onFileSelected
    	});

    	$$self.$inject_state = $$props => {
    		if ('studentId' in $$props) $$invalidate(0, studentId = $$props.studentId);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('password' in $$props) $$invalidate(2, password = $$props.password);
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('authImgPath' in $$props) authImgPath = $$props.authImgPath;
    		if ('files' in $$props) files = $$props.files;
    		if ('avatar' in $$props) $$invalidate(4, avatar = $$props.avatar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		studentId,
    		id,
    		password,
    		name,
    		avatar,
    		overlapChecker,
    		signUp,
    		imgUpload,
    		onFileSelected,
    		input0_input_handler,
    		click_handler,
    		input2_input_handler,
    		input3_input_handler,
    		click_handler_1,
    		input5_input_handler,
    		change_handler
    	];
    }

    class SignUp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SignUp",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\component\writePost.svelte generated by Svelte v3.44.2 */

    const file = "src\\component\\writePost.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let input0;
    	let t0;
    	let div0;
    	let textarea;
    	let t1;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			input0 = element("input");
    			t0 = space();
    			div0 = element("div");
    			textarea = element("textarea");
    			t1 = space();
    			input1 = element("input");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "제목");
    			attr_dev(input0, "id", "title");
    			attr_dev(input0, "class", "svelte-1c704sh");
    			add_location(input0, file, 28, 4, 724);
    			attr_dev(textarea, "class", "svelte-1c704sh");
    			add_location(textarea, file, 30, 8, 843);
    			attr_dev(div0, "class", "post svelte-1c704sh");
    			add_location(div0, file, 29, 4, 798);
    			attr_dev(input1, "class", "writeBtn svelte-1c704sh");
    			attr_dev(input1, "type", "button");
    			input1.value = "글 작성";
    			add_location(input1, file, 34, 4, 1024);
    			attr_dev(div1, "class", "main svelte-1c704sh");
    			add_location(div1, file, 27, 0, 700);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input0);
    			set_input_value(input0, /*title*/ ctx[1]);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, textarea);
    			set_input_value(textarea, /*description*/ ctx[0]);
    			append_dev(div1, t1);
    			append_dev(div1, input1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[4]),
    					listen_dev(input1, "click", /*writePost*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 2 && input0.value !== /*title*/ ctx[1]) {
    				set_input_value(input0, /*title*/ ctx[1]);
    			}

    			if (dirty & /*description*/ 1) {
    				set_input_value(textarea, /*description*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('WritePost', slots, []);
    	let description = "", title = "";

    	async function writePost() {
    		let tocken;
    		if (document.cookie.split("; ").find(row => row.startsWith("tocken"))) tocken = document.cookie.split("; ").find(row => row.startsWith("tocken")).split("=")[1]; else location.href = "/";
    		let body = JSON.stringify({ tocken, description, title });
    		await fetch("http://koldin.myddns.me:3101/post", { method: "post", body });
    		location.href = "/";
    	} // let data = res.json()

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WritePost> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		title = this.value;
    		$$invalidate(1, title);
    	}

    	function textarea_input_handler() {
    		description = this.value;
    		$$invalidate(0, description);
    	}

    	$$self.$capture_state = () => ({ description, title, writePost });

    	$$self.$inject_state = $$props => {
    		if ('description' in $$props) $$invalidate(0, description = $$props.description);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [description, title, writePost, input0_input_handler, textarea_input_handler];
    }

    class WritePost extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WritePost",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.2 */

    // (13:1) <Route path="/">
    function create_default_slot_5(ctx) {
    	let headers;
    	let t;
    	let post;
    	let current;
    	headers = new Header({ $$inline: true });
    	post = new PostList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(headers.$$.fragment);
    			t = space();
    			create_component(post.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headers, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(post, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headers.$$.fragment, local);
    			transition_in(post.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headers.$$.fragment, local);
    			transition_out(post.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headers, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(post, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(13:1) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:1) <Route path="post/:id" let:params >
    function create_default_slot_4(ctx) {
    	let headers;
    	let t;
    	let eachpost;
    	let current;
    	headers = new Header({ $$inline: true });

    	eachpost = new EachPost({
    			props: { postId: /*params*/ ctx[1].id },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(headers.$$.fragment);
    			t = space();
    			create_component(eachpost.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headers, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(eachpost, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const eachpost_changes = {};
    			if (dirty & /*params*/ 2) eachpost_changes.postId = /*params*/ ctx[1].id;
    			eachpost.$set(eachpost_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headers.$$.fragment, local);
    			transition_in(eachpost.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headers.$$.fragment, local);
    			transition_out(eachpost.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headers, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(eachpost, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(17:1) <Route path=\\\"post/:id\\\" let:params >",
    		ctx
    	});

    	return block;
    }

    // (21:1) <Route path="write-post" >
    function create_default_slot_3(ctx) {
    	let headers;
    	let t;
    	let writepost;
    	let current;
    	headers = new Header({ $$inline: true });
    	writepost = new WritePost({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(headers.$$.fragment);
    			t = space();
    			create_component(writepost.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headers, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(writepost, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headers.$$.fragment, local);
    			transition_in(writepost.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headers.$$.fragment, local);
    			transition_out(writepost.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headers, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(writepost, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(21:1) <Route path=\\\"write-post\\\" >",
    		ctx
    	});

    	return block;
    }

    // (25:1) <Route path="login" >
    function create_default_slot_2(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(25:1) <Route path=\\\"login\\\" >",
    		ctx
    	});

    	return block;
    }

    // (28:1) <Route path="sign-up">
    function create_default_slot_1(ctx) {
    	let signup;
    	let current;
    	signup = new SignUp({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(signup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(signup, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(signup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(signup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(signup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(28:1) <Route path=\\\"sign-up\\\">",
    		ctx
    	});

    	return block;
    }

    // (12:0) <Router url={url} >
    function create_default_slot(ctx) {
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let t3;
    	let route4;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "post/:id",
    				$$slots: {
    					default: [
    						create_default_slot_4,
    						({ params }) => ({ 1: params }),
    						({ params }) => params ? 2 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "write-post",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "login",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "sign-up",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			t3 = space();
    			create_component(route4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(route3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(route4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope, params*/ 6) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(route3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(route4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(12:0) <Router url={url} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { url = "" } = $$props;
    	const writable_props = ['url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Headers: Header,
    		Post: PostList,
    		EachPost,
    		Login,
    		SignUp,
    		WritePost,
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
