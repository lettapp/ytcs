/* 
 * This code is part of Comments Search for Youtube chrome extension
 * 
 */
'use strict';

const CC_NON = 0;
const CC_NEW = -1;
const CC_DIS = -2;
const CC_GLB = -3;

function none()
{
	return null;
}

function keys(object)
{
	return Object.keys(object);
}

function values(object)
{
	return Object.values(object);
}

function unpack(object)
{
	return Object.entries(object).shift();
}

function assign()
{
	return Object.assign(...arguments);
}

function on(s)
{
	return 'on' + s[0].toUpperCase() + s.slice(1);
}

class is
{
	static null(x)
	{
		return x == null;
	}

	static bool(x)
	{
		return this.type(x) == Boolean;
	}

	static string(x)
	{
		return this.type(x) == String;
	}

	static object(x)
	{
		return this.type(x) == Object;
	}

	static function(x)
	{
		return this.type(x) == Function;
	}

	static type(x)
	{
		return x?.constructor;
	}
}

class std
{
	static switch(iterable, c = true)
	{
		for (const [k, v] of iterable) {
			if (k === c) return v;
		}

		return c;
	}
}

class string
{
	static PRE_STRCASE = 1;
	static PRE_NEWLINE = 1;

	static match(ptrn, str)
	{
		return str.match(ptrn) || [];
	}

	static grep(ptrn, str)
	{
		const m = this.match(ptrn, str);

		switch (m.length)
		{
			case 0: return '';
			case 1: return m[0];
			case 2: return m[1];

			default:
				return m.slice(1);
		}
	}

	static replace(str, data)
	{
		return str.replace(/{([a-z]+)}/gi, (s, k) => data[k]);
	}

	static format(str, args)
	{
		args = array.cast(args);

		return str.replace(/%s/g, _ => args.shift());
	}

	static capitalize(str, PRE_STRCASE)
	{
		if (!PRE_STRCASE) {
			str = str.toLowerCase();
		}

		return str.replace(/(^|\s)[a-z]/g, this.toUpperCase);
	}

	static removeWS(str, PRE_NEWLINE)
	{
		if (PRE_NEWLINE) {
			str = str.replace(/\s*\n\s*/g, '\n').replace(/[^\S\n]+/g, ' ');
		}
		else {
			str = str.replace(/\s+/g, ' ');
		}

		return str.trim();
	}

	static count(ptrn, str)
	{
		return this.match(ptrn, str).length;
	}

	static tokenCount(str)
	{
		return this.count(/\s/g, str) + 1;
	}

	static split(str, d = ' ')
	{
		return str ? str.split(d) : [];
	}

	static tokenSplit(str, tokens)
	{
		const r = this.format('(%s)', tokens.join('|'));

		if (r == '()') {
			return [str];
		}

		return str.split(new RegExp(r)).filter(Boolean);
	}

	static toUpperCase(s)
	{
		return s.toUpperCase();
	}

	static toLowerCase(s)
	{
		return s.toLowerCase();
	}

	static isLetter(s)
	{
		return /\p{L}/u.test(s);
	}

	static isNumeric(s)
	{
		return !/[^\d]/.test(s);
	}

	static isAlphanum(s)
	{
		return !/[^\p{L}\p{N}]/u.test(s);
	}

	static isLowerCase(s)
	{
		return !/[A-Z]/.test(s);
	}

	static isUpperCase(s)
	{
		return !/[a-z]/.test(s);
	}

	static isUniCase(s)
	{
		return this.isLowerCase(s) || this.isUpperCase(s);
	}

	static isUnicode(c)
	{
		return c.charCodeAt(0) > 255;
	}
}

class array
{
	static MAP_MODE_SKIP = 1;
	static MAP_MODE_STOP = 2;
	static MAP_MODE_FAIL = 3;

	static cast(x)
	{
		return x instanceof Array ? x : [x];
	}

	static move(arr, from, to = Infinity)
	{
		this.insertAt(
			arr, to, this.removeAt(arr, from)
		);
	}

	static remove(arr, item)
	{
		const i = arr.indexOf(item);

		return this.removeAt(arr, i).pop();
	}

	static replace(item, newItem, arr)
	{
		const i = arr.indexOf(item);

		if (i >= 0) {
			arr[i] = newItem;
		}
	}

	static moveAfter(itemToMoveAfter, itemToMove, arr)
	{
		let posA = arr.indexOf(itemToMove),
			posB = arr.indexOf(itemToMoveAfter);

		if (posA > posB) {
			posB++;
		}

		this.move(arr, posA, posB);
	}

	static insertAt(arr, i, items)
	{
		arr.splice(i, 0, ...items);
	}

	static removeAt(arr, i, n = 1)
	{
		return arr.splice(i, n);
	}

	static unique(arr)
	{
		return [...new Set(arr)];
	}

	static intersect(...arrays)
	{
		return arrays.sort(sort.length).shift().filter(
			item => arrays.every(arr => arr.includes(item))
		);
	}

	static mapskip(arr, fn)
	{
		return this.mapmode(arr, fn, this.MAP_MODE_SKIP);
	}

	static mapstop(arr, fn)
	{
		return this.mapmode(arr, fn, this.MAP_MODE_STOP);
	}

	static mapfail(arr, fn)
	{
		return this.mapmode(arr, fn, this.MAP_MODE_FAIL);
	}

	static mapmode(arr, fn, mode)
	{
		const items = [];

		for (let item, i = 0; i < arr.length; i++)
		{
			item = fn(arr[i], i);

			if (item == null) switch (mode)
			{
				case this.MAP_MODE_SKIP:
					continue;

				case this.MAP_MODE_STOP:
					return items;

				case this.MAP_MODE_FAIL:
					return;
			}

			items.push(item);
		}

		return items;
	}
}

class object
{
	static from(array, k)
	{
		const x = {};

		for (const o of array)
		{
			x[o[k]] = o;
		}

		return x;
	}

	static map(o, callback)
	{
		const x = {};

		for (const k in o)
		{
			x[k] = is.object(o[k]) ? this.map(o[k], callback) : callback(o[k]);
		}

		return x;
	}

	static remap(o, k)
	{
		return this.from(values(o), k);
	}

	static filter(o)
	{
		for (const k in o)
		{
			is.null(o[k]) && delete o[k];
		}

		return o;
	}

	static safeSet(o, items)
	{
		assign(o || {}, this.filter(items));
	}
}

class regex
{
	static create(pattern, args)
	{
		let ptrn = string.grep(/.(.+)\//, pattern),
			mods = string.grep(/[a-z]+$/, pattern);

		ptrn = string.format(ptrn,
			array.cast(args).map(this.escape)
		);

		return new RegExp(ptrn, mods);
	}

	static escape(s)
	{
		return String(s).replace(/[-()\[\]{}+?*.$^|,:#<!\\]/g, '\\$&');
	}
}

class time
{
	static now()
	{
		return ~~(Date.now() / 1e3);
	}

	static since(str)
	{
		return this.now() - this.toUnix(str);
	}

	static expired(unix = 0)
	{
		return unix < this.now();
	}

	static ago(str)
	{
		let diff = this.since(str);

		for (let [unit, mltp] of this.units)
		{
			mltp = Math.floor(diff / mltp);

			if (mltp > 0) {
				return string.format('%s %s%s ago', [mltp, unit, (mltp > 1) ? 's' : '']);
			}
		}

		return '';
	}

	static hms2int(hms)
	{
		let	x = string.match(/\d+/g, hms),
			i = x.length,
			m = 1,
			n = 0;

		while (i--) {
			n += m * x[i];
			m *= 60;
		}

		return n;
	}

	static int2hms(seconds)
	{
		let arr = [
			(seconds / 3600),
			(seconds %= 3600) && (seconds / 60),
			(seconds % 60)
		];

		arr = arr.map(
			n => String(~~n).padStart(2, 0)
		);

		return arr.join(':').replace(/^[0:]{1,4}/, '');
	}

	static toUnix(str)
	{
		return new Date(str).getTime() / 1e3;
	}

	static units = Object.entries({
		year:	1 * 60 * 60 * 24 * 30 * 12,
		month:	1 * 60 * 60 * 24 * 30,
		week:	1 * 60 * 60 * 24 * 7,
		day:	1 * 60 * 60 * 24,
		hour:	1 * 60 * 60,
		minute:	1 * 60,
		second:	1
	});
}

class math
{
	static randint(len, asString)
	{
		let s = Math.random().toString().slice(2, len + 2);

		if (s[0] == '0' || s.length != len) {
			return this.randint(len, asString);
		}

		return asString ? s : +s;
	}

	static inRange(n, [min, max])
	{
		return min <= n && n <= max;
	}

	static bound(n, [min, max])
	{
		return n < min ? min : n > max ? max : n;
	}

	static sum(d)
	{
		d = is.object(d) ? values(d) : d;

		d = d.reduce(
			(a, b) => a + b, 0
		);

		isNaN(d) &&
			console.error(d = 0);

		return d;
	}

	static avg(arr)
	{
		return this.div(
			this.sum(arr), arr.length
		);
	}

	static div(a, b)
	{
		return (b != 0) ? (a / b) : 0;
	}

	static pct(a, b)
	{
		return this.div(a, b) * 100;
	}

	static inverse(n)
	{
		return this.div(1, n);
	}

	static median(arr)
	{
		let n = arr.length, i = ~~(n / 2);

		if (!n) {
			return 0;
		}

		if (n % 2) {
			return arr[i];
		}

		return (arr[i--] + arr[i]) / 2;
	}
}

class sort
{
	static asc(a, b)
	{
		return a - b;
	}

	static desc(a, b)
	{
		return b - a;
	}

	static length(a, b)
	{
		return a.length - b.length;
	}

	static lengthDesc(a, b)
	{
		return b.length - a.length;
	}

	static alphabet(a, b)
	{
		return a.localeCompare(b);
	}
}

class interval
{
	static set(fn, ms, immediate)
	{
		this.clear(fn);

		if (immediate) {
			fn();
		}

		this.id[fn] = setInterval(fn, ms);
	}

	static setImmediate(fn, ms)
	{
		this.set(fn, ms, true);
	}

	static clear(fn)
	{
		clearInterval(this.id[fn]);
	}

	static id = {};
}

class ext
{
	static CACHE_MAX = 1000;

	static isCachable(n)
	{
		return 0 < n && n < this.CACHE_MAX;
	}

	static isCached(videoId, ttl)
	{
		if (ttl) {
			return mem.cache[videoId] = time.now() + ttl;
		}

		return !time.expired(mem.cache[videoId]);
	}

	static file = object.map({
		view:'/html/view.html',
		svg: {
			auth:'/html/svg/auth.svg',
		}
	}, chrome.runtime.getURL);
}

class notifications
{
	static addListener(target, ids)
	{
		ids = string.split(ids);

		for (const id of ids)
		{
			this.getChannel(id).add(target);
		}
	}

	static removeListener(target, ids)
	{
		ids = string.split(ids);

		if (!ids.length) {
			ids = keys(this.channels);
		}

		for (const id of ids)
		{
			this.getChannel(id).delete(target);
		}
	}

	static send(id, data)
	{
		for (const target of this.getChannel(id))
		{
			target[on(id)](data);
		}
	}

	static getChannel(id)
	{
		return this.channels[id] ||= new Set;
	}

	static channels = {};
}

class Storage
{
	constructor()
	{
		this.items = {};
		this.local = chrome.storage.local;
	}

	get(k)
	{
		clearTimeout(this.commitId);

		this.commitId = setTimeout(
			_ => this.persist(this.items), 10
		);

		return this.items[k];
	}

	set(items)
	{
		assign(this.items, items);

		return this.persist(items);
	}

	persist(items)
	{
		return this.local.set(items);
	}
}

class AppStorage extends Storage
{
	constructor()
	{
		super();

		return new Proxy(this,
		{
			get(self, k)
			{
				if (k in self)
				{
					const any = self[k];

					if (any instanceof Function) {
						return any.bind(self);
					}

					return any;
				}

				return self.get(k);
			},

			set(self, k, v)
			{
				return self.set({[k]:v});
			}
		});
	}

	get load()
	{
		return this.didLoad ||= this.local.get().then(r =>
		{
			if (self.ServiceWorkerGlobalScope) {
				this.upgrade(r);
			}

			this.local.onChanged.addListener(
				this.onChange.bind(this)
			);

			assign(this.items, r);
		});
	}

	onChange(items)
	{
		for (const k in items) {
			this.handleChange(k, items[k]);
		}
	}

	handleChange(k, change)
	{
		this.items[k] = change.newValue;

		notifications.send(
			string.format('%sDataDidChange', k), change
		);
	}

	upgrade(r)
	{
		const newver = chrome.runtime.getManifest().version;
		const appver = r.ver;

		if (appver == newver) {
			return;
		}

		if (!appver)
		{
			assign(r, {
				cache:{},
				user:{},
				pos:{},
			});
		}

		if (appver < 3.1)
		{
			assign(r, {
				cache:{},
				pos:{},
			});
		}

		assign(r, {
			ver:newver
		});

		this.persist(r);
	}
}

class Portable
{
	constructor(port)
	{
		this.DIS_INITIAL = 0;
		this.DIS_TIMEOUT = 1;
		this.DIS_REQUEST = 2;

		this.onConnect(port);
	}

	onConnect(port)
	{
		this.port = port;

		port.onMessage.addListener(
			this.onPortMessage.bind(this)
		);

		port.onDisconnect.addListener(
			this.onDisconnect.bind(this)
		);

		this.didDisconnect = this.DIS_INITIAL;
	}

	onMessage(kind, data)
	{
		if (!this.didDisconnect) {
			return this[kind](data);
		}
	}

	postMessage(message)
	{
		if (this.canPost) {
			this.port.postMessage(message);
		}
	}

	disconnect()
	{
		this.didDisconnect = this.DIS_REQUEST;
	}

	onDisconnect()
	{
		this.didDisconnect = this.DIS_TIMEOUT;
	}

	onPortMessage(message)
	{
		this.onMessage(
			...unpack(message)
		);
	}
}

class MasterPort extends Portable
{
	constructor(name)
	{
		super(
			chrome.runtime.connect({name})
		);
	}

	reconnect()
	{
		this.onConnect(
			chrome.runtime.connect({name:this.port.name})
		);
	}

	get canPost()
	{
		const reason = this.didDisconnect;

		if (reason)
		{
			if (reason == this.DIS_REQUEST) {
				return;
			}

			this.reconnect();
		}

		return true;
	}
}

class WorkerPort extends Portable
{
	constructor(port)
	{
		super(port);
	}

	didConnect(didConnect)
	{
		this.postMessage({didConnect});
	}

	get canPost()
	{
		return !this.didDisconnect;
	}
}

class Main
{
	constructor(waitLoad)
	{
		this.waitLoad = waitLoad || Promise.resolve();

		this.waitLoad.then(
			this.onReady.bind(this)
		);

		this.register({
			onStartup:chrome.runtime.onStartup,
			onMessage:chrome.runtime.onMessage,
			onConnect:chrome.runtime.onConnect,
			onClicked:chrome.action?.onClicked,
			onInstall: {
				addListener: addEventListener.bind(null, 'install')
			}
		});

		this.onInit?.();
	}

	onMessage(message, sender, callback)
	{
		const [kind, data] = unpack(message);

		this[on(kind)]?.(
			data, sender.tab, callback
		);
	}

	sendMessage(message, tabId)
	{
		if (tabId) {
			return chrome.tabs.sendMessage(tabId, message).catch(none);
		}

		return chrome.runtime.sendMessage(message).catch(none);
	}

	register(events)
	{
		const waitLoad = function(event, ...args)
		{
			this.waitLoad.then(
				_ => this[event](...args)
			);

			return true;
		}

		for (const event in events)
		{
			if (event in this)
			{
				events[event].addListener(
					waitLoad.bind(this, event)
				);
			}
		}
	}
}

class UIResponder
{
	setParent(parent)
	{
		this.parent = parent;
	}

	handleEvent(event, sender = this)
	{
		if (sender != this)
		{
			if (event in this) {
				return this[event](sender);
			}

			if (this.onEvent) {
				return this.onEvent(event, sender);
			}
		}

		this.superview?.handleEvent(event, sender);
	}

	handleAction(action, sender = this)
	{
		let nextResponder;

		if (action in this && this != sender)
		{
			return this[action](sender);
		}

		if (nextResponder = this.parent || this.superview)
		{
			return nextResponder.handleAction(action, sender);
		}
	}
}

class UIFactory
{
	constructor(html)
	{
		this.protos = {};

		for (const proto of this.convert(html).children)
		{
			const id = proto.getAttribute('protoid');

			if (id) {
				proto.removeAttribute('protoid');
			}
			else {
				throw proto;
			}

			this.protos[id] = proto.outerHTML;
		}
	}

	create(id, data)
	{
		let html = this.protos[id];

		if (data) {
			html = string.replace(html, data);
		}

		return this.convert(html);
	}

	textNode(text)
	{
		const x = document.createElement('span');

		x.textContent = text;

		return x;
	}

	extend(a, b)
	{
		for (const k in b)
		{
			let ak = a[k], bk = b[k];

			switch (is.type(ak))
			{
				case String:
					bk = ak.concat(' ', bk);
				break;

				case Array:
					bk = ak.concat(bk);
				break;

				case Object:
					bk = this.extend(ak, bk);
				break;
			}

			a[k] = bk;
		}

		return a;
	}

	convert(html)
	{
		const x = document.createElement('div');

		x.innerHTML = html;

		return x.children[0];
	}
}

class UIElement extends UIResponder
{
	constructor(element)
	{
		super();

		this.element = element;

		this.import('style hidden remove textContent querySelector querySelectorAll addEventListener');
	}

	appendChild(child)
	{
		this.element.appendChild(child.element || child);
	}

	setAttribute(key, val)
	{
		const el = this.element;

		if (is.bool(val))
		{
			if (!val) {
				return el.removeAttribute(key);
			}

			val = '';
		}

		el.setAttribute(key, val);
	}

	addClass(s)
	{
		this.element.classList.add(
			...string.split(s)
		);
	}

	delClass(s)
	{
		this.element.classList.remove(
			...string.split(s)
		);
	}

	condClass(s, cond)
	{
		cond ? this.addClass(s) : this.delClass(s);
	}

	addStyles(p)
	{
		assign(this.style, p);
	}

	get rect()
	{
		return this.element.getBoundingClientRect();
	}

	import(s)
	{
		const e = this.element, p = {};

		for (const k of string.split(s))
		{
			if (k in this) {
				throw k;
			}

			if (e[k] instanceof Function)
			{
				p[k] = {
					value: e[k].bind(e)
				};
			}
			else {
				p[k] = {
					get: f => e[k],
					set: v => e[k] = v,
				};
			}
		}

		Object.defineProperties(this, p);
	}
}

class UIView extends UIElement
{
	constructor(init)
	{
		const src = init.source || 'UIView';

		super(
			is.string(src) ? UI.create(src, init.data) : src
		);

		this.superview;
		this.subviews = [];
		this.targets = new Map;

		this.init(init);
	}

	init(init)
	{
		if (init.import) {
			this.import(init.import);
		}

		if (init.events) {
			this.addListener(init.events);
		}

		if (init.target) {
			this.addTarget(...init.target);
		}

		if (init.attrs) {
			for (const k in init.attrs) {
				init.attrs[k] && this.setAttribute(k, init.attrs[k]);
			}
		}

		if (init.styles) {
			this.addClass(init.styles);
		}

		if (init.text) {
			this.textContent = init.text;
		}

		if (init.data) {
			this.data = init.data;
		}

		if (init.superview)
		{
			const [view, domId] = init.superview;

			view.addSubview(this, domId);
		}

		this.didInit(init);
	}

	didInit(init) {
	}

	addSubview(view, domId)
	{
		if (view.superview)
		{
			if (view.superview == this) {
				return;
			}

			view.removeFromSuperview();
		}

		(view.superview = this).subviews.push(view);

		if (domId) {
			this.queryId(domId).appendChild(view.element);
		}
		else {
			this.appendChild(view);
		}
	}

	addSubviews(views, domId)
	{
		for (const view of views) {
			this.addSubview(view, domId);
		}
	}

	removeSubview(view)
	{
		view.superview = null;

		array.remove(this.subviews, view).remove();
	}

	removeFromSuperview()
	{
		this.superview?.removeSubview(this);
	}

	bringSubviewToFront(view)
	{
		this.appendChild(view);
	}

	clear()
	{
		while (this.subviews.length) {
			this.removeSubview(this.subviews[0]);
		}
	}

	hide()
	{
		this.hidden = true;
	}

	show()
	{
		this.hidden = false;
	}

	queryId(id)
	{
		return this.querySelector('#' + id);
	}

	addListener(events)
	{
		const handler = this.eventHandler.bind(this);

		for (const event of string.split(events))
		{
			this.addEventListener(event, handler);
		}
	}

	addTarget(target, events)
	{
		events = string.split(events);

		for (const eventAction of events)
		{
			const [event, action] = eventAction.split(':');

			this.targets.set(event, [target, action]);
		}
	}

	sendAction(event)
	{
		const [target, action] = this.targets.get(event) || [];

		if (target) {
			return target.handleAction(action, this);
		}

		this.handleEvent(event);
	}

	eventHandler(e)
	{
		const event = on(e.type);

		if (event in this) {
			this[event](e);
		}
		else {
			this.sendAction(event);
		}

		e.stopPropagation();
	}
}

class UIText extends UIView
{
	constructor(text)
	{
		super({text});
	}
}

class UIWindow extends UIView
{
	constructor(width, height)
	{
		super({
			source:'UIWindow',
			events:'wheel',
			width:width,
			height:height
		});

		this.minWidth = width;
		this.minHeight = 56;
	}

	didInit(init)
	{
		const [w, h] = [init.width, init.height];

		const x = window.innerHeight - h;
		const y = window.innerWidth - w - 100;

		this.addStyles({
			top:x + 'px',
			left:y + 'px',
			minWidth:w + 'px',
		});

		this.addResizeListeners();
	}

	onWheel(e)
	{
		dom.preventScroll(e);
	}

	setPosition(props)
	{
		for (const k in props)
		{
			this.style[k] = props[k] + (k == 'top' ? 'vh' : 'vw');
		}
	}

	addResizeListeners()
	{
		this.querySelectorAll('[resize], [movable]').forEach(bar =>
		{
			const action = bar.attributes.resize ? 'resize' : 'move';

			bar.addEventListener('pointerdown',
				e => (e.which == 1) && this[action](e)
			);
		});
	}

	resize(e)
	{
		const	towards = e.target.getAttribute('resize'),
				resizeL	= towards.includes('w'),
				resizeR	= towards.includes('e'),
				resizeT	= towards.includes('n');

		const	rect = this.rect,
				minWidth = this.minWidth,
				minHeight = this.minHeight,
				winRightX = window.innerWidth,
				maxTop = window.innerHeight - minHeight,
				startX = e.clientX,
				startY = e.clientY,
				startL = rect.x,
				startT = rect.y,
				startW = rect.width;

		let deltaX = 0,
			deltaY = 0,
			finalT = startT,
			finalL = startL,
			finalW = startW;

		this.onManipulation(e =>
		{
			deltaX = e.clientX - startX;
			deltaY = e.clientY - startY;

			if (resizeT) {
				finalT = math.bound(startT + deltaY, [0, maxTop]);
			}

			if (resizeR)
			{
				finalW = math.bound(startW + deltaX, [minWidth]);

				if (winRightX < e.clientX) {
					finalW = winRightX - startL;
				}
			}

			if (resizeL)
			{
				finalL = math.bound(startL + deltaX, [0]);
				finalW = math.bound(startW - deltaX, [minWidth]);

				if (finalL == 0) {
					finalW = startL + startW;
				}

				if (finalW == minWidth) {
					finalL = startL + (startW - finalW);
				}
			}

			this.addStyles({
				top:finalT + 'px',
				left:finalL + 'px',
				width:finalW + 'px',
			});
		});
	}

	move(e)
	{
		const [startX, startL] = [e.clientX, this.rect.left];

		this.onManipulation(
			e => this.style.left = startL + (e.clientX - startX) + 'px'
		);
	}

	onManipulation(pointerMoveFn)
	{
		dom.handleMoveEvent(pointerMoveFn).then(
			_ => this.onManipulationEnd()
		);
	}

	onManipulationEnd()
	{
		let props, rect = this.rect;

		if (rect.width == 0) {
			return;
		}

		props = {
			top:math.pct(rect.y, window.innerHeight),
			left:math.pct(rect.x, window.innerWidth),
			width:math.pct(rect.width, window.innerWidth),
		};

		this.delegate.didResize(props);
	}
}

class UIScrollView extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			styles:'CSView CSScrollView',
			import:'scrollTop scrollHeight offsetHeight',
			events:'wheel',
		});

		super(init);
	}

	onWheel(e)
	{
		dom.preventScroll(e);

		if (this.isScrollable) {
			this.didScroll(this.scrollTop += e.deltaY);
		}
	}

	didScroll(scrollTop)
	{
	}

	setOverscroll()
	{
		this.delClass('CSOverscroll');

		if (this.isScrollable) {
			this.addClass('CSOverscroll');
		}
	}

	get isScrollable()
	{
		return this.offsetHeight < this.scrollHeight;
	}

	get didPassTriggerPoint()
	{
		return this.scrollTop > .3 * (this.scrollHeight - this.offsetHeight);
	}
}

class UITableView extends UIScrollView
{
	constructor(dataSource)
	{
		super({});

		this.dataSource = dataSource;

		this.nextChildNodes = [];
	}

	renderNextBatch()
	{
	}

	pushInitialBatch()
	{
		this.clear();
		this.loadNextBatch();
		this.pushNextBatch();

		this.setOverscroll();
	}

	didScroll()
	{
		if (this.nextChildNodes.length && this.didPassTriggerPoint)
		{
			this.pushNextBatch();
		}
	}

	loadNextBatch()
	{
		this.nextChildNodes = this.renderNextBatch(this.dataSource.nextBatch);
	}

	pushNextBatch()
	{
		this.addSubviews(this.nextChildNodes) & this.loadNextBatch();
	}
}

class UIImage extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			source:'UIImage',
			import:'src',
			events:'error',
			attrs: {
				src: init.imageUrl
			}
		});

		super(init);
	}

	didInit(init)
	{
		this.fallbackUrl = init.fallbackUrl;
	}

	onError()
	{
		if (this.fallbackUrl) {
			(this.src = this.fallbackUrl) & (this.fallbackUrl = null);
		}
	}
}

class UIInput extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			import:'placeholder focus select',
			events:'focus keydown input',
			attrs: {
				placeholder: init.placeholder
			}
		});

		super(init);
	}

	onFocus(e)
	{
		this.sendAction('onFocus');
	}

	onKeydown(e)
	{
		if (e.key == 'Enter' && !e.shiftKey) {
			return this.sendAction('onEnter');
		}

		this.sendAction('onKeydown');
	}

	onInput(e)
	{
		this.sendAction('onChange');

		if (e.inputType == 'insertFromPaste') {
			this.sendAction('onPaste');
		}
	}
}

class UITextInput extends UIInput
{
	constructor(init)
	{
		UI.extend(init, {
			source:'UITextInput'
		});

		super(init);
	}

	get value()
	{
		return this.element.value.trim();
	}

	set value(s)
	{
		this.element.value = s;
	}
}

class UIProgressInput extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			source:'UIProgressInput'
		});

		super(init);
	}

	didInit(init)
	{
		this.valueTester = init.valueTester;

		this.messageText = this.queryId('messageText');

		this.input = new UITextInput({
			placeholder:init.placeholder,
			superview:[this, 'textInput']
		});

		this.progressBar = new UIProgressBar({
			superview:[this, 'textInput']
		});

		this.setState('normal');
	}

	get value()
	{
		return this.input.value;
	}

	focus()
	{
		this.input.focus();
	}

	setState(state, text = '')
	{
		this.state = state;

		this.progressBar.setState(state);

		this.messageText.textContent = text;
	}

	onEvent(event)
	{
		if (this.state == 'loading') {
			return;
		}

		if (event == 'onChange') {
			this.setState('normal');
		}

		if ('onPaste onEnter'.includes(event))
		{
			const [test, text] = this.valueTester;

			if (!this.value) {
				return;
			}

			if (!test.test(this.value)) {
				return this.setState('error', text);
			}
		}

		this.sendAction(event);
	}
}

class UIControl extends UIView
{
	constructor(init)
	{
		super(init);
	}

	didInit(init)
	{
		this.setState(init.state || 'normal');
	}

	setState(state)
	{
		this.state = state;

		this.setAttribute('state', state);
	}

	get isSelected()
	{
		return this.state == 'selected';
	}
}

class UIButton extends UIControl
{
	constructor(init)
	{
		UI.extend(init, {
			events:'click'
		});

		super(init);
	}

	didInit(init)
	{
		super.didInit(init);

		if (init.label) {
			this.setLabel(init.label);
		}

		if (init.image) {
			this.addImage(init.image);
		}

		this.value = init.value;
	}

	setLabel(text)
	{
		this.textContent = text;
	}

	addImage(protoId)
	{
		this.appendChild(
			UI.create(protoId)
		);
	}
}

class UIAnchor extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			source:'UIAnchor',
			events:'click',
			attrs: {
				href: init.href
			}
		});

		super(init);
	}
}

class UIProgressBar extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			styles:'CSProgressBar'
		});

		super(init);
	}

	setState(state)
	{
		this.setAttribute('state', state);
	}
}

class ViewController extends UIResponder
{
	constructor(view, viewDelegate)
	{
		super();

		this.view;
		this.model;
		this.parent;
		this.children = [];

		this.setView(view, viewDelegate);
	}

	setView(view, viewDelegate)
	{
		view.setParent(this);

		if (viewDelegate) {
			view.delegate = viewDelegate(this);
		}

		this.viewDidSet(
			this.view = view
		);
	}

	setModel(model, modelDelegate)
	{
		if (is.function(model)) {
			model = new model;
		}

		if (modelDelegate) {
			model.delegate = modelDelegate(this);
		}

		this.modelDidSet(
			this.model = model
		);
	}

	viewDidSet(view)
	{
	}

	modelDidSet(model)
	{
	}

	viewWillAppear(sender)
	{
		this.leafController?.viewWillAppear(sender);
	}

	viewDidAppear(sender)
	{
		this.leafController?.viewDidAppear(sender);
	}

	viewWillDisappear(sender)
	{
		this.leafController?.viewWillDisappear(sender);
	}

	viewDidDisappear(sender)
	{
		this.leafController?.viewDidDisappear(sender);
	}

	addChild(child, domId)
	{
		child.setParent(this);

		if (this.isVisible) {
			child.viewWillAppear();
		}

		this.children.push(child);

		this.view.addSubview(child.view, domId);

		if (this.isVisible) {
			child.viewDidAppear();
		}
	}

	removeChild(child)
	{
		if (this.isVisible) {
			child.viewWillDisappear();
		}

		array.remove(this.children, child).destruct();

		if (this.isVisible) {
			child.viewDidDisappear();
		}
	}

	present(viewController)
	{
		this.rootController.present(viewController);
	}

	get rootController()
	{
		return this.parent?.rootController || this;
	}

	get leafController()
	{
		return this.lastChild;
	}

	get isVisible()
	{
		return this.view.rect.width > 0;
	}

	destruct()
	{
		this.view.remove();

		for (const child of this.children) {
			child.destruct();
		}

		notifications.removeListener(this);
	}
}

class NavViewController extends ViewController
{
	constructor(view, viewDelegate)
	{
		super(view || new UIView({source:'UINavView'}), viewDelegate);
	}

	viewDidSet(view)
	{
		this.backBtn = new UIButton({
			styles:'CSNavButton CSBackButton',
			image:'UIIconArrowLeft',
			state:'hidden',
			target:[this, 'onClick:removeChild'],
			superview:[view]
		});
	}

	addChild(child)
	{
		let visibleView = this.lastChild,
			visibleThis = this.isVisible && visibleView;

		if (visibleThis) {
			visibleView.viewWillDisappear();
		}

		super.addChild(child, 'views');

		if (visibleThis) {
			visibleView.viewDidDisappear();
		}

		this.setBackButtonVisibility();
	}

	removeChild()
	{
		let visibleNext = this.nextChild,
			visibleThis = this.isVisible && visibleNext;

		if (visibleThis) {
			visibleNext.viewWillAppear();
		}

		super.removeChild(this.lastChild);

		if (visibleThis) {
			visibleNext.viewDidAppear();
		}

		this.setBackButtonVisibility();
	}

	get lastChild()
	{
		return this.children.at(-1);
	}

	get nextChild()
	{
		return this.children.at(-2);
	}

	get childCount()
	{
		return this.children.length;
	}

	setBackButtonVisibility()
	{
		this.backBtn.setState(
			this.childCount > 1 ? 'normal' : 'hidden'
		);
	}
}

class AppController extends NavViewController
{
	constructor()
	{
		const view = new UIWindow(460, 480);

		super(view, AppViewDelegate);

		this.setModel(AppModel);

		notifications.addListener(this, 'actionKeyPress userTrialRequest userDidAuth contextInvalidated');
	}

	viewDidSet(view)
	{
		super.viewDidSet(view);

		new UIButton({
			styles:'CSNavButton CSAppCloseButton',
			image:'UIIconCross',
			target:[this, 'onClick:close'],
			superview:[view]
		});

		if (mem.user.key) {
			this.onUserDidAuth();
		}
		else {
			this.onAuthRequired();
		}

		dom.appendChild(view);
	}

	modelDidSet()
	{
		this.view.setPosition(
			this.model.getPosition()
		);
	}

	onActionKeyPress(code)
	{
		if (code == 'KeyS' || code == 'KeyE') {
			return this.start(code);
		}

		if (code == 'Escape') {
			return this.close();
		}
	}

	onUserTrialRequest()
	{
		this.showSearchView(true);
	}

	onUserDidAuth()
	{
		this.showSearchView(false);
	}

	onAuthRequired()
	{
		this.addChild(new AuthView);
	}

	showSearchView(trialMode)
	{
		this.addChild(
			new SearchView(this.inTrialMode = trialMode)
		);
	}

	present(viewController)
	{
		this.addChild(viewController, true);
	}

	start(sender)
	{
		if (this.isVisible) {
			return;
		}

		this.viewWillAppear(sender);

		this.view.show();

		this.viewDidAppear(sender);
	}

	close()
	{
		if (!this.isVisible) {
			return;
		}

		this.viewWillDisappear();

		this.view.hide();

		this.viewDidDisappear();

		if (this.inTrialMode) {
			this.onAuthRequired();
		}
	}

	addChild(child, isPresentation)
	{
		if (!isPresentation) {
			this.removeAllChilds();
		}

		super.addChild(child);
	}

	removeAllChilds()
	{
		while (this.childCount) {
			this.removeChild();
		}
	}

	onContextInvalidated()
	{
		this.addChild(new ErrorView);
	}
}

class AppModel
{
	getPosition()
	{
		return mem.pos;
	}

	setPosition(css)
	{
		(css.width > 100) && (css.width = 100);

		(css.left < 0) && (css.left = 0);

		(css.left + css.width > 100) && (css.left = 100 - css.width);

		mem.set({pos:css});
	}
}

function AppViewDelegate(self)
{
	return {
		didResize(css)
		{
			self.model.setPosition(css);
		}
	}
}

class AuthView extends NavViewController
{
	viewDidSet(view)
	{
		super.viewDidSet(view);

		this.addChild(new AuthMainView);
	}

	showHelpView()
	{
		this.addChild(new AuthHelpView);
	}

	onAuth()
	{
		notifications.send('userDidAuth');
	}

	onTrial()
	{
		notifications.send('userTrialRequest');
	}
}

class AuthMainView extends ViewController
{
	constructor()
	{
		super(
			new UIView({source:'UIAuthView'})
		);
	}

	viewDidSet(view)
	{
		this.keyInput = new UIProgressInput({
			target:[this, 'onPaste:authUser onEnter:authUser'],
			valueTester:[/^[A-Za-z0-9_-]{32,}$/, 'invalid key'],
			superview:[view, 'keyInput']
		});

		new UIImage({
			imageUrl:ext.file.svg.auth,
			superview:[view, 'artwork']
		});

		new UIAnchor({
			styles:'CSFooterLink',
			text:'What is Youtube API key?',
			target:[this, 'onClick:showHelpView'],
			superview:[view, 'footer']
		});
	}

	viewDidAppear()
	{
		this.keyInput.focus();
	}

	authUser(sender)
	{
		sender.setState('loading');

		app.authUser(sender.value).then(err =>
		{
			if (err) {
				return sender.setState('error', err);
			}

			this.handleAction('onAuth');
		});
	}
}

class AuthHelpView extends ViewController
{
	constructor()
	{
		super(
			new UIView({source:'UIHelpView'})
		);
	}

	viewDidSet(view)
	{
		new UIButton({
			styles:'CSButton',
			label:'try it without key',
			target:[this, 'onClick:onTrial'],
			superview:[view, 'actionBtns']
		});
	}
}

class SearchView extends ViewController
{
	constructor(trialMode)
	{
		super(
			new UIView({source:'UISearchView'})
		);

		this.userDidAuth = !trialMode;

		notifications.addListener(this, 'actionKeyPress');
	}

	viewDidSet(view)
	{
		this.input = new UITextInput({
			placeholder:'type keywords here..',
			target:[this, 'onFocus:auditContext onPaste:onSubmit onEnter:onSubmit'],
			superview:[view, 'header']
		});

		this.commentCounter = new UIButton({
			styles:'CSCommentCount',
			label:'0',
			state:'disabled',
			target:[this, 'onClick:showFeaturesView'],
			superview:[view, 'header']
		});

		this.contentView = new UIView({
			source:view.queryId('content')
		});

		this.contentView.addSubviews([
			this.messageView = new UISearchMessageView,
			this.resultsView = new UISearchResultsView(this)
		]);

		this.messageView.delegate = SearchMessageDelegate(this);
	}

	viewWillAppear()
	{
		interval.setImmediate(
			_ => this.auditContext(), this.userDidAuth ? 250 : 2e8
		);
	}

	viewDidAppear(sender)
	{
		this.input.focus();
	}

	viewDidDisappear()
	{
		interval.clear(
			_ => this.auditContext()
		);

		this.messageView.clear();
		this.resultsView.pauseInlinePlayer();
	}

	onActionKeyPress(code)
	{
		if (code == 'KeyE') {
			return this.searchCurrentTime();
		}

		if (code == 'KeyS') {
			return this.input.select();
		}
	}

	onSubmit()
	{
		const q = this.searchTerm();

		if (!q) {
			return;
		}

		if (!yt.isWatchPage) {
			return this.messageView.showMessage('errNotWatchPage');
		}

		if (!this.model.available)
		{
			if (!this.model.awaitingResponse) {
				return;
			}

			if (q == this.model.lastRequestQuery) {
				return this.messageView.showMessage('errAwaitingResponse');
			}
		}

		this.execSearch(q);
	}

	getAllComments()
	{
		if (!yt.isWatchPage) {
			return this.messageView.showMessage('errNotWatchPage');
		}

		this.autoSearch(':all');
	}

	showView(view)
	{
		this.contentView.bringSubviewToFront(view);
	}

	showFeaturesView()
	{
		this.present(new FeaturesView);
	}

	auditContext()
	{
		const newId = this.videoDidChange;

		if (newId)
		{
			this.model?.disconnect();

			this.setModel(
				new SearchModel(newId), SearchModelDelegate
			);
		}
	}

	get nextBatch()
	{
		return this.model.nextBatch(25);
	}

	execSearch(q)
	{
		this.model.search(q);

		this.messageView.showMessage('searchRequestSent');
	}

	searchCurrentTime()
	{
		this.autoSearch(
			time.int2hms(yt.player.currentTime)
		);
	}

	searchTerm(q)
	{
		if (q == null) {
			return this.input.value;
		}

		this.input.value = q;
	}

	autoSearch(q)
	{
		this.input.focus();

		this.searchTerm(q);
		this.execSearch(q);
	}

	get videoDidChange()
	{
		return (this.videoId != yt.videoId) && (this.videoId = yt.videoId);
	}
}

class SearchModel extends MasterPort
{
	constructor(videoId)
	{
		super(videoId);

		this.lastRequestQuery	= '';
		this.lastRequestTime	= 0;
		this.lastResultsTime	= 0;
		this.minHandlingTime	= 300;
		this.awaitingResponse	= false;
		this.lastResultsEmpty	= false;
		this.lastResults		= [];
	}

	didConnect(n)
	{
		this.delegate.onCommentCount(n);
	}

	nextBatch(count)
	{
		return this.lastResults.splice(0, count);
	}

	search(q)
	{
		this.lockPipe(q);

		this.postMessage({searchRequest:q});
	}

	get available()
	{
		return !this.awaitingResponse && this.getTime('lastResultsTime') > 500;
	}

	searchRequest(r)
	{
		let delay = 200, count = r.threads.length;

		if (count) {
			delay = this.minHandlingTime - this.getTime('lastRequestTime');
		}

		this.lastResults = r.threads;
		this.lastResultsEmpty = !count;

		setTimeout(
			_ => this.delegate.onResults(count, r.potential),
		delay);

		this.releasePipe();
	}

	commentCount(n)
	{
		this.delegate.onCommentCount(n);
	}

	error(errorId)
	{
		this.releasePipe();

		this.delegate.onError(errorId);
	}

	setTime(eventName)
	{
		this[eventName] = Date.now();
	}

	getTime(eventName)
	{
		return Date.now() - this[eventName];
	}

	lockPipe(q)
	{
		this.lastRequestQuery = q;
		this.awaitingResponse = true;

		this.setTime('lastRequestTime');
	}

	releasePipe()
	{
		this.awaitingResponse = false;

		this.setTime('lastResultsTime');
	}
}

class UISearchMessageView extends UIView
{
	constructor()
	{
		super({
			styles:'CSView CSDialogMessage'
		});

		this.messages = {
			emptyResponse:			'no results match your query',
			searchRequestSent:		'Searching...',
			errAwaitingResponse:	'Searching still...',
			errNotWatchPage:		'You are not watching any video',
			errInvalidRequest:		'Invalid request',
			errZeroComments:		'This video has no comments',
			errCommentsDisabled:	'Comments are disabled for this video.',
			errNetwork:				'check your internet connection',
			errServerDown:			'service down for maintenance',
			errRequestTimeout:		'request timeout, try again',
			errUnsupportedFeature:	'feature not supported for this video',
			errParseError:			'invalid response from server, try again',
			errUnknown:				'unexpected error occured',

			accessNotConfigured:	'the provided API key is not valid',
			rateLimitExceeded:		'daily rate limit exceeded',
			quotaExceeded:			'quota exceeded',
			processingFailure:		'comments server is not responding',
			videoNotFound:			'video not found',
			forbidden:				'your query could not be processed',
			commentsDisabled:		'Comments are disabled for this video.'
		};
	}

	showMessage(id)
	{
		this.setMessage(
			this.messages[id] || this.messages.errUnknown
		);
	}

	showCustomMessage(...parts)
	{
		this.setMessage(...parts);
	}

	setMessage(...parts)
	{
		this.clear();

		for (const x of parts)
		{
			this.addSubview(
				is.string(x) ? new UIText(x) : x
			);
		}

		this.delegate.messageDidSet();
	}
}

class UISearchResultsView extends UITableView
{
	constructor(dataSource)
	{
		super(dataSource);
	}

	setVideoTime(sender)
	{
		yt.playerSetCurrentTime(sender.data.startAt);
	}

	embedVideo(sender)
	{
		return this.inlinePlayer ||= new UIEmbeddedPlayer;
	}

	pauseInlinePlayer()
	{
		this.inlinePlayer?.pause();
	}

	renderNextBatch(threads)
	{
		const batch = [];

		for (const thread of threads)
		{
			const threadView = new UIView({styles:'CSThread'});

			thread.forEach((reply, i, prev) =>
			{
				if (reply.hidden || !reply.parentId) {
					return;
				}

				while (prev = thread[--i])
				{
					prev.isChained = true;

					if (prev.id == reply.parentId) {
						return;
					}
				}
			});

			for (const comment of thread)
			{
				threadView.addSubview(
					new UIComment(comment)
				);
			}

			batch.push(threadView);
		}

		return batch;
	}
}

function SearchModelDelegate(self)
{
	return {
		onCommentCount(n)
		{
			self.commentCounter.setLabel(
				std.switch([
					[CC_NON, 'zero'],
					[CC_DIS, 'off'],
					[CC_GLB, 'global'],
				], n)
			);

			self.commentCounter.setState(
				ext.isCachable(n) ? 'normal' : 'disabled'
			);
		},

		onResults(count, p)
		{
			this.onCommentCount(p);

			if (count) {
				return self.resultsView.pushInitialBatch() & self.showView(self.resultsView);
			}

			if (p < 1)
			{
				const id = std.switch([
					[CC_NON, 'errZeroComments'],
					[CC_DIS, 'errCommentsDisabled'],
					[CC_GLB, 'emptyResponse'],
				], p);

				return self.messageView.showMessage(id);
			}

			if (p < 150)
			{
				const action = new UIAnchor({
					text:string.format('%s comments', p),
					target:[self, 'onClick:getAllComments']
				});

				return self.messageView.showCustomMessage('Nothing found in ', action);
			}

			self.messageView.showMessage('emptyResponse');
		},

		onError(errorId)
		{
			self.messageView.showMessage(errorId);
		}
	}
}

function SearchMessageDelegate(self)
{
	return {
		messageDidSet()
		{
			self.showView(self.messageView);
		}
	}
}

class UIEmbeddedPlayer extends UIView
{
	constructor()
	{
		super({
			source:'UIEmbeddedPlayer',
			import:'src contentDocument',
			events:'load',
		});

		this.player = document.createElement('video');
	}

	onLoad()
	{
		const doc = this.contentDocument;

		object.safeSet(this, {
			player:doc.querySelector('video')
		});

		object.safeSet(
			doc.querySelector('.ytp-pause-overlay-container'), {hidden:true}
		);
	}

	load(videoId, startAt)
	{
		if (videoId != this.videoId)
		{
			const p = {
				start:startAt,
				autoplay:1,
				modestbranding:1,
				iv_load_policy:3,
			};

			this.src = string.format(
				'https://www.youtube.com/embed/%s?%s', [videoId, new URLSearchParams(p)]
			);

			this.videoId = videoId;
		}
		else {
			this.player.currentTime = startAt;
			this.player.play();
		}

		return this;
	}

	pause()
	{
		this.player.pause();
	}
}

class UIComment extends UIView
{
	constructor(comment)
	{
		super({source:'UIComment', data:comment});
	}

	didInit(init)
	{
		const comment = init.data;

		if (comment.isReply)
		{
			if (comment.isChained) {
				this.addClass('CSChained');
			}

			if (comment.hidden) {
				this.hide();
			}
		}

		if (comment.isUploader)
		{
			new UIView({
				source:'UIIconVerified',
				styles:'CSOwnerBadge',
				superview:[this, 'meta']
			});

			this.addClass('CSByUploader');
		}

		this.renderImageView(comment);
		this.renderTextView(comment);
	}

	embedVideo(sender)
	{
		const {videoId, startAt} = sender.data;

		this.addSubview(
			this.handleAction('embedVideo').load(videoId, startAt), 'main'
		);
	}

	renderImageView(comment)
	{
		const imageUrl = comment.authorImgUrl;

		const largeUrl = imageUrl.replace(
			/=s\d+/, string.format('=s%s', comment.isReply ? 48 : 80)
		);

		new UIImage({
			imageUrl:largeUrl,
			fallbackUrl:imageUrl,
			superview:[this, 'userImage']
		});
	}

	renderTextView(comment)
	{
		const textView = new UIView({
			styles:'CSCommentText',
			attrs: comment.locale,
			superview:[this, 'main']
		});

		const tokens = comment.structured.map(item => item.id);

		string.tokenSplit(comment.displayText, tokens).forEach(s =>
		{
			const isItem = tokens.includes(s) && comment.structured.shift();

			if (isItem) {
				return textView.addSubview(
					this.createAnchor(isItem)
				);
			}

			textView.appendChild(
				UI.textNode(s)
			);
		});

		if (comment.isReply && !comment.isUploader)
		{
			textView.addClass('CSTrim');

			textView.addEventListener('click',
				e => textView.delClass('CSTrim')
			);
		}
	}

	createAnchor(x)
	{
		const {type, text, href} = x;

		switch (type)
		{
			case 'TimeTag':
				return new UIAnchor({
					text,
					data: {
						startAt:x.startAt
					},
					target:[this, 'onClick:setVideoTime']
				});

			case 'EmbedLink':
				return new UIAnchor({
					text,
					data: {
						videoId:x.videoId,
						startAt:x.startAt
					},
					target:[this, 'onClick:embedVideo']
				});

			default:
				return new UIAnchor({text, href});
		}
	}
}

class FeaturesView extends ViewController
{
	constructor()
	{
		super(
			new UIView({source:'UIFeaturesView'})
		);
	}
}

class ErrorView extends ViewController
{
	constructor()
	{
		super(
			new UIView({source:'UIErrorView'})
		);
	}
}

class UIDocument extends UIElement
{
	constructor()
	{
		super(document.documentElement);

		if (location.pathname.startsWith('/embed/')) {
			this.setDarkModeState(true);
		}

		document.addEventListener('fullscreenchange',
			_ => this.setFullscreenState()
		);
	}

	get isFullscreen()
	{
		return !!document.fullscreenElement;
	}

	preventScroll(e)
	{
		if (e.ctrlKey) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();
	}

	handleMoveEvent(pointerMoveFn)
	{
		return new Promise(resolve =>
		{
			window.onpointermove = pointerMoveFn;

			window.onpointerup = e =>
			{
				this.delClass('CSOnmove');

				resolve(
					window.onpointermove = onpointerup = null
				);
			};

			this.addClass('CSOnmove');
		});
	}

	setDarkModeState(bool)
	{
		this.setAttribute('dark', bool);
	}

	setFullscreenState()
	{
		this.setAttribute('fullscreen', this.isFullscreen);
	}
}

class ActionKeyHandler
{
	constructor()
	{
		window.addEventListener('keydown', this.onKeydown.bind(this), true);
	}

	onKeydown(e)
	{
		const key = e.code;

		if (!e.shiftKey && (e.ctrlKey + e.altKey + e.metaKey) == 1)
		{
			if (key == 'KeyS' || key == 'KeyE' && yt.isWatchPage) {
				return e.preventDefault() & this.notification(key);
			}

			if (key == 'KeyX' && dom.isFullscreen) {
				return this.notification('Escape');
			}
		}

		if (key == 'Escape') {
			return this.notification(key);
		}
	}

	notification(code)
	{
		notifications.send('actionKeyPress', code);
	}
}

class yt
{
	static get isWatchPage()
	{
		return !!this.videoId;
	}

	static get videoId()
	{
		return string.grep(/\b(?:live|shorts|embed|v)[\/=]([\w-]{11})\b/, location.href);
	}

	static get player()
	{
		return document.querySelector('video[src]') || document.createElement('video');
	}

	static playerSetCurrentTime(time)
	{
		this.player.currentTime = time;
		this.player.play();
	}
}

class App extends Main
{
	constructor()
	{
		self.mem = new AppStorage;

		super(mem.load);
	}

	onInit()
	{
		addEventListener('error',
			this.onUncaughtError.bind(this)
		);

		addEventListener('unhandledrejection',
			this.onUncaughtError.bind(this)
		);

		new ActionKeyHandler;
	}

	onReady()
	{
		this.sendMessage({clientLoad:true}).then(html => {
			self.UI = new UIFactory(html);
			self.dom = new UIDocument;
			self.appController = new AppController;
		});
	}

	authUser(apiKey)
	{
		return this.sendMessage({userAuth:apiKey});
	}

	onActivate()
	{
		appController.start();
	}

	onUncaughtError(e)
	{
		if (!chrome.runtime?.id) {
			e.preventDefault() & this.onContextInvalidated();
		}
	}

	onContextInvalidated()
	{
		notifications.send('contextInvalidated');
	}
}

let app = new App;