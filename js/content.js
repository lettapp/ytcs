/*
 * This code is part of Comments Search for Youtube chrome extension
 *
 * LettApp lett.app/ytcs
 * GitHub  @lettapp
 */
'use strict';

const CC_NON = 0;
const CC_DIS = -1;
const CC_GLB = -2;

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

function entries(object)
{
	return Object.entries(object);
}

function unpack(object)
{
	return entries(object).shift();
}

function assign()
{
	return Object.assign(...arguments);
}

function clone(array)
{
	return [...array];
}

function on(s)
{
	return 'on' + s[0].toUpperCase() + s.slice(1);
}

function match(value, ...cases)
{
	for (const [k, v] of cases) {
		if (k === value) return v;
	}
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

	static array(x)
	{
		return this.type(x) == Array;
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

class string
{
	static PRE_STRCASE = 1;
	static PRE_NEWLINE = 1;

	static split(str, d = ' ')
	{
		return str ? str.split(d) : [];
	}

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
		return str.replace(/{([a-z]+)}/gi, (_, k) => data[k]);
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
		return is.array(x) ? x : [x];
	}

	static isEqual(a, b)
	{
		return !a.some(
			(v, i) => v !== b[i]
		);
	}

	static move(arr, any, to = Infinity)
	{
		const from = Number.isInteger(any) ? any : arr.indexOf(any);

		this.insertAt(
			arr, to, this.removeAt(arr, from)
		);
	}

	static remove(item, arr)
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

		for (const o of array) {
			x[o[k]] = o;
		}

		return x;
	}

	static map(o, callback)
	{
		const x = {};

		for (const k in o) {
			x[k] = is.object(o[k]) ? this.map(o[k], callback) : callback(o[k]);
		}

		return x;
	}

	static index(o, k)
	{
		const m = new Map;

		values(o).forEach(
			v => m.set(v[k], v)
		);

		return m;
	}

	static filter(o)
	{
		for (const k in o) {
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

	static diff(unix = 0)
	{
		return this.now() - unix;
	}

	static expired(unix = 0)
	{
		return unix < this.now();
	}

	static since(s)
	{
		return this.now() - this.toUnix(s);
	}

	static ago(s)
	{
		let diff = this.since(s);

		for (let [unit, mltp] of this.units)
		{
			mltp = Math.floor(diff / mltp);

			if (mltp > 0) {
				return string.format('%s %s%s ago', [mltp, unit, (mltp > 1) ? 's' : '']);
			}
		}

		return '1 second ago';
	}

	static pt2int(pt)
	{
		const u = {H:3600, M:60, S:1};

		return string.match(/\d+[HMS]/g, pt).reduce(
			(n, x) => n + parseInt(x) * u[x.at(-1)], 0
		);
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

	static toUnix(s)
	{
		if (+s == s) {
			return s;
		}

		return new Date(s).getTime() / 1e3;
	}

	static units = entries({
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
	static randint(n, asString)
	{
		let s = '0';

		if (n !== +n || n < 1 || n > 16) {
			throw 'out of bound';
		}

		while(s[0] == '0' || s.length != n) {
			s = Math.random().toString().slice(2, n + 2);
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
		return this.bound(
			this.div(a, b) * 100, [0, 100]
		);
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

class ext
{
	static isCachable(n)
	{
		return 0 < n && n < 1e3;
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

		for (const id of ids) {
			this.getChannel(id).add(target);
		}
	}

	static removeListener(target, ids)
	{
		ids = string.split(ids);

		if (!ids.length) {
			ids = keys(this.channels);
		}

		for (const id of ids) {
			this.getChannel(id).delete(target);
		}
	}

	static send(pack, confirm)
	{
		const [id, data] = unpack(pack);

		for (const target of this.getChannel(id)) {
			confirm |= target[on(id)](data);
		}

		return confirm;
	}

	static contextInvalidated(isUncaught)
	{
		this.send({contextInvalidated:isUncaught});

		this.channels = {};
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
			_ => this.persist(this.items)
		);

		return this.items[k];
	}

	set(items)
	{
		return assign(this.items, items) && this.persist(items);
	}

	remove(k)
	{
		return delete this.items[k] && this.local.remove(k);
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

			this.items = r;
		});
	}

	onChange(items)
	{
		for (const k in items)
		{
			this.items[k] = items[k].newValue;

			notifications.send({
				[string.format('%sDataChange', k)]:this.items[k]
			});
		}
	}

	upgrade(loaded)
	{
		const oldVer = loaded.ver;
		const newVer = chrome.runtime.getManifest().version;

		if (oldVer != newVer)
		{
			this.restruct(loaded, {
				cache:{},
				user:{},
				pos:{},
				updates:[],
				installed:time.now(),
				commands: {
					start:['ctrlKey', 'KeyS'],
					close:['Escape'],
					highlight:['ctrlKey', 'KeyF'],
					tsSearch:[],
					fsClose:[],
				}
			});

			if (oldVer && newVer == '24.11.22') {
				loaded.updates.unshift({type:'changelog', read:false});
			}

			this.persist(
				assign(loaded, {ver:newVer})
			);
		}
	}

	restruct(origin, struct)
	{
		for (const k in struct)
		{
			!(k in origin) &&
				(origin[k] = struct[k]);

			is.object(struct[k]) &&
				this.restruct(origin[k], struct[k]);
		}
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

		this.didReconnect = true;
	}

	postMessage(message)
	{
		let wait = 0;

		if (this.canPost)
		{
			if (this.didReconnect) {
				wait = 50;
			}

			setTimeout(
				this.port.postMessage(message), wait
			);

			this.didReconnect = false;
		}
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
			onStartup: chrome.runtime.onStartup,
			onMessage: chrome.runtime.onMessage,
			onConnect: chrome.runtime.onConnect,
			onClicked: chrome.action?.onClicked,
			onAlarmed: chrome.alarms?.onAlarm,
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

class Events
{
	constructor()
	{
		this.calls = [];

		notifications.addListener(this, 'contextInvalidated');
	}

	addListener(typeScope, listener, options)
	{
		const [type, scope] = unpack(typeScope);

		scope.addEventListener(type, listener, options);

		this.add(
			[scope, type, listener, options]
		);
	}

	removeListener(typeScope)
	{
		const [type, scope] = unpack(typeScope);

		this.iterator.forEach(
			call => call[0] == scope && call[1] == type && this.remove(call)
		);
	}

	onContextInvalidated()
	{
		this.iterator.forEach(
			call => this.remove(call)
		);
	}

	add(call)
	{
		this.calls.push(call);
	}

	remove(call)
	{
		array.remove(call, this.calls).shift().removeEventListener(...call);
	}

	get iterator()
	{
		return clone(this.calls);
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

	handleAction(action, sender = this, data)
	{
		let nextResponder;

		if (action in this && this != sender) {
			return this[action](sender, data);
		}

		if (nextResponder = this.parent || this.superview) {
			return nextResponder.handleAction(action, sender, data);
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
			const id = proto.attributes.removeNamedItem('protoid').value;

			this.protos[id] = proto.outerHTML;
		}
	}

	create({source, native}, data)
	{
		const html = this.protos[source];

		if (html) {
			return this.createFromSource(html, data);
		}

		if (native) {
			return document.createElement(native);
		}

		return document.createElement(source);
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

	createFromSource(html, data)
	{
		if (data) {
			html = string.replace(html, data);
		}

		return this.convert(html);
	}

	convert(html)
	{
		const x = document.createElement('div');

		x.innerHTML = html;

		return x.children[0];
	}
}

class UIView extends UIResponder
{
	constructor(init)
	{
		super();

		this.superview;
		this.subviews = [];
		this.targets = new Map;

		this.setElement(init) & this.init(init);
	}

	setElement(init)
	{
		this.element = UI.create({
			source:init.source || this.constructor.name,
			native:init.native
		}, init.data);

		this.import(
			'style dataset attributes hidden remove textContent querySelector querySelectorAll addEventListener'
		);
	}

	init(init)
	{
		this.data = init.data;

		if (init.delegate) {
			this.delegate = init.delegate;
		}

		if (init.import) {
			this.import(init.import);
		}

		if (init.styles) {
			this.addClass(init.styles);
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

		if (init.text) {
			this.textContent = init.text;
		}

		this.didInit(init);
	}

	didInit({superview})
	{
		superview?.at(0).addSubview(this, superview[1]);
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

	tempClass(s, ms)
	{
		this.addClass(s) & setTimeout(_ => this.delClass(s), ms);
	}

	addStyles(p)
	{
		assign(this.style, p);
	}

	addSubview(view, targetId)
	{
		if (view.superview)
		{
			if (view.superview == this) {
				return;
			}

			view.removeFromSuperview();
		}

		(view.superview = this).subviews.push(view);

		if (targetId) {
			this.queryId(targetId).appendChild(view.element);
		}
		else {
			this.appendChild(view);
		}
	}

	addSubviews(views, targetId)
	{
		for (const view of views) {
			this.addSubview(view, targetId);
		}
	}

	removeSubview(view)
	{
		view.superview = null;

		array.remove(view, this.subviews).remove();
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
		clone(this.subviews).forEach(
			view => this.removeSubview(view)
		);
	}

	hide(bool)
	{
		this.hidden = bool;
	}

	queryId(id)
	{
		return this.querySelector('#' + id);
	}

	get rect()
	{
		return this.element.getBoundingClientRect();
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

	destruct()
	{
		this.removeFromSuperview();

		clone(this.subviews).forEach(
			view => view.destruct()
		);

		this.targets.clear();
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

class UIText extends UIView
{
	constructor(text)
	{
		super({text});
	}
}

class UIResizeBar extends UIView
{
	constructor(resize)
	{
		super({
			events:'pointerdown',
			attrs: {
				resize
			}
		});
	}

	onPointerdown(e)
	{
		const p = e.target.attributes.resize.value;

		if (e.which != 1) {
			return;
		}

		this.handleAction('resizeBarClicked', this, {
			startX:e.clientX,
			startY:e.clientY,
			isMove:p.includes('we'),
			resizeL:p.includes('w'),
			resizeR:p.includes('e'),
			resizeT:p.includes('n'),
		});
	}
}

class UIWindow extends UIView
{
	constructor(width, height)
	{
		const url = chrome.runtime.getURL('/');

		super({
			data:{url},
			width:width,
			height:height,
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

		string.split('w e n ne nw we').forEach(
			p => this.addSubview(new UIResizeBar(p))
		);

		super.didInit(init);
	}

	setPosition(props)
	{
		for (const k in props)
		{
			this.style[k] = props[k] + (k == 'top' ? 'vh' : 'vw');
		}
	}

	resizeBarClicked(sender, data)
	{
		if (data.isMove) {
			return this.onMoveStart(data.startX);
		}

		this.onResizeStart(data);
	}

	onResizeStart(data)
	{
		const {startX, startY, resizeR, resizeL, resizeT} = data;

		const
			rect = this.rect,
			minWidth = this.minWidth,
			minHeight = this.minHeight,
			winRightX = window.innerWidth,
			maxTop = window.innerHeight - minHeight,
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

	onMoveStart(startX)
	{
		const startL =  this.rect.left;

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
		const rect = this.rect;

		if (rect.width == 0) {
			return;
		}

		this.delegate.didResize({
			top:math.pct(rect.y, window.innerHeight),
			left:math.pct(rect.x, window.innerWidth),
			width:math.pct(rect.width, window.innerWidth),
		});
	}
}

class UIScrollView extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			styles:'CSScroll',
			import:'scrollTop scrollHeight offsetHeight',
			events:'scroll',
		});

		super(init);
	}

	onScroll(e)
	{
		this.didScroll();
	}

	didScroll()
	{
	}

	setOverscroll()
	{
		this.delClass('CSOverscroll');

		if (this.isScrollable) {
			this.addClass('CSOverscroll');
		}
	}

	scrollToBottom()
	{
		this.scrollTop = this.scrollHeight;
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

	renderNextBatch() {
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
		if (this.nextChildNodes.length && this.didPassTriggerPoint) {
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
			native:'img',
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

		super.didInit(init);
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
			native:'input',
			import:'name placeholder focus select blur',
			events:'focus keydown input blur',
			attrs: {
				name:init.name,
				placeholder:init.placeholder,
				spellcheck:'false',
				autocomplete:'off',
			}
		});

		super(init);
	}

	didInit(init)
	{
		this.value = init.value;

		super.didInit(init);
	}

	get value()
	{
		return this.element.value.trim();
	}

	set value(s = '')
	{
		this.element.value = s;
	}

	get rawValue()
	{
		return String.raw`${this.value}`;
	}

	get flush()
	{
		const s = this.value;

		this.value = '';

		this.sendAction('onChange');

		return s;
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

	onFocus()
	{
		this.sendAction('onFocus');
	}
}

class UITextArea extends UIInput
{
	constructor(init)
	{
		UI.extend(init, {
			native:'textarea'
		});

		super(init);
	}

	get value()
	{
		return super.value.replace(/\n\s*\n/g, '\n\n');
	}

	set value(s)
	{
		super.value = s;
	}
}

class UIProgressInput extends UIView
{
	didInit(init)
	{
		this.validator = init.validator;

		this.input = new UIInput({
			placeholder:init.placeholder,
			superview:[this, 'textInput']
		});

		this.progressBar = new UIProgressBar({
			superview:[this, 'textInput']
		});

		this.messageText = new UIView({
			styles:'CSApiKeyInputLog',
			superview:[this]
		});

		super.didInit(init);
	}

	get value()
	{
		return this.input.value;
	}

	focus()
	{
		this.input.focus();
	}

	setState(state, message)
	{
		this.state = state;

		this.progressBar.setState(state);

		this.messageText.textContent = message;
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
			const [pattern, message] = this.validator;

			if (!this.value) {
				return;
			}

			if (!pattern.test(this.value)) {
				return this.setState('error', message);
			}
		}

		this.sendAction(event);
	}
}

class UIControl extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			import:'disabled',
			events:'click',
		});

		super(init);
	}

	didInit(init)
	{
		if (init.state) {
			this[init.state] = true;
		}

		super.didInit(init);
	}

	onClick()
	{
		this.sendAction('onClick');
	}
}

class UIButton extends UIControl
{
	constructor(init)
	{
		UI.extend(init, {
			native:'button'
		});

		super(init);
	}

	didInit(init)
	{
		if (init.image) {
			this.addImage(init.image);
		}

		super.didInit(init);
	}

	addImage(source)
	{
		this.appendChild(
			UI.create({source})
		);
	}
}

class UIToggle extends UIButton
{
	constructor(init)
	{
		UI.extend(init, {
			attrs: {
				active: init.active
			}
		});

		super(init);
	}

	get isActive()
	{
		return !!this.attributes.active;
	}

	set isActive(bool)
	{
		this.setAttribute('active', bool);
	}

	toggleActive()
	{
		return this.isActive = !this.isActive;
	}

	onClick()
	{
		this.toggleActive() & super.onClick();
	}
}

class UIAnchor extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
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

		if (view) {
			this.setView(view, viewDelegate);
		}
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

		array.remove(child, this.children).destruct();

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

	get isVisibleOnScreen()
	{
		return this.isVisible && this.rootController.children.at(-1) == this;
	}

	destruct()
	{
		this.view.destruct();

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
		let visibleNext = this.prevChild,
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

	get prevChild()
	{
		return this.children.at(-2);
	}

	get childCount()
	{
		return this.children.length;
	}

	setBackButtonVisibility()
	{
		this.backBtn.hidden = this.childCount < 2;
	}
}

class AppController extends NavViewController
{
	constructor()
	{
		super(
			new UIWindow(460, 540), AppViewDelegate
		);

		this.setModel(AppModel);

		notifications.addListener(this,
			'command userTrialRequest userDidAuth contextInvalidated'
		);
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

		this.observeContext(view);
	}

	modelDidSet()
	{
		this.view.setPosition(
			this.model.getPosition()
		);
	}

	onCommand(c)
	{
		if (c == 'start' || c == 'tsSearch' && YT.isWatchPage) {
			return this.start(c) | 1;
		}

		if (c == 'close' || c == 'fsClose')
		{
			if (!this.isVisible || c == 'fsClose' && !YT.isFullscreen) {
				return;
			}

			return this.close(c) | 1;
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
		this.addChild(
			new AuthView(this.trialMode = false)
		);
	}

	showSearchView(trialMode)
	{
		this.addChild(
			new SearchView(this.trialMode = trialMode)
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

		this.view.hide(0);

		this.viewDidAppear(sender);
	}

	close(sender)
	{
		if (!this.isVisible) {
			return;
		}

		this.viewWillDisappear(sender);

		this.view.hide(1);

		this.viewDidDisappear(sender);

		if (this.trialMode) {
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

	observeContext(view)
	{
		const observer = new MutationObserver(
			_ => app.contextInvalidated && notifications.contextInvalidated()
		);

		observer.observe(view.element, {attributes:true});
	}

	onContextInvalidated(isUncaught)
	{
		if (isUncaught) {
			return this.addChild(new ErrorView);
		}

		this.view.remove();
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

		mem.pos = css;
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
		notifications.send({userDidAuth:null});
	}

	onTrial()
	{
		notifications.send({userTrialRequest:null});
	}
}

class AuthMainView extends ViewController
{
	constructor()
	{
		super(
			new UIView({source:'UIAuthView'})
		);

		notifications.addListener(this,	'userDataChange');
	}

	viewDidSet(view)
	{
		this.keyInput = new UIProgressInput({
			target:[this, 'onPaste:authUser onEnter:authUser'],
			validator:[/^[A-Za-z0-9_-]{32,}$/, 'invalid key'],
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

		app.authUser(sender.value).then(
			err => err && sender.setState('error', err)
		);
	}

	onUserDataChange(user)
	{
		if (user.key) {
			this.handleAction('onAuth');
		}
	}
}

class AuthHelpView extends ViewController
{
	constructor()
	{
		const usage = 100 - math.pct(
			time.diff(mem.installed), (30 * 86400)
		);

		super(
			new UIView({source:'UIHelpView', data:{usage}})
		);
	}

	viewDidSet(view)
	{
		new UIProgressButton({
			usage:view.data.usage,
			label:'Try it without key',
			target:[this, 'onClick:tryButtonClicked'],
			superview:[view, 'actionBtns'],
		});
	}

	tryButtonClicked()
	{
		this.handleAction('onTrial');
	}
}

class UIProgressButton extends UIButton
{
	constructor(init)
	{
		init.data = {
			label:init.label,
			usage:init.usage,
		};

		super(init);
	}

	onClick()
	{
		if (this.data.usage == 0) {
			return this.tempClass('CSWiggle', 500);
		}

		super.onClick();
	}
}

class SearchView extends ViewController
{
	constructor(trialMode)
	{
		super(
			new UIView({source:'UISearchView'})
		);

		this.didAuth = !trialMode;

		notifications.addListener(this, 'command');
	}

	viewDidSet(view)
	{
		this.searchInput = new UIInput({
			placeholder:'type keywords here..',
			target:[this, 'onFocus:auditContext onEnter:onSubmit onPaste:onPaste onChange:onTyping'],
			superview:[view, 'header']
		});

		this.searchIcons = new UISearchIcons({
			delegate:this,
			superview:[view, 'header']
		});

		this.commentCount = new UICommentCount({
			styles:'CSCommentCount',
			value:'0',
			state:'disabled',
			target:[this, 'onClick:showFeaturesView'],
			superview:[view, 'header']
		});

		this.contentView = new UIView({
			styles:'CSSearchBody CSViewStack',
			superview:[view]
		});

		this.contentView.addSubviews([
			this.messageView = new UISearchMessageView(this),
			this.resultsView = new UISearchResultsView(this),
		]);
	}

	viewWillAppear()
	{
		const updates = mem.updates.some(item => item.read == false);

		if (updates) {
			this.searchIcons.show({Bell:1e3});
		}
		else {
			this.searchIcons.hide({Bell:400});
		}

		this.auditContext();
	}

	viewDidAppear(sender)
	{
		this.searchInput.focus();
	}

	viewDidDisappear()
	{
		this.searchInput.blur();
		this.messageView.clear();
		this.resultsView.pauseInlinePlayer();
	}

	onCommand(c)
	{
		if (c == 'start') {
			return this.searchInput.select();
		}

		if (c == 'tsSearch' && YT.isWatchPage) {
			return this.searchCurrentTime();
		}

		if (c == 'highlight' && this.isVisibleOnScreen) {
			return this.toggleHighlighting(c) | 1;
		}
	}

	onSubmit()
	{
		const q = this.searchTerm();

		if (!q || this.showRoutedView(q)) {
			return;
		}

		if (!YT.isWatchPage) {
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

	onPaste()
	{
		if (this.searchIcons.get({Eye:false})?.isActive) {
			return;
		}

		this.onSubmit();
	}

	onTyping()
	{
		const s = this.searchInput.value;

		this.commentCount.tempState(
			s.startsWith('global:') && 'global'
		);

		this.resultsView.textToHighlight = s;
	}

	onBellIconClicked()
	{
		this.present(new UpdatesView);
	}

	onEyeIconClicked()
	{
		this.toggleHighlighting();
	}

	onMessageDidSet()
	{
		this.showView(this.messageView);
	}

	getAllComments()
	{
		if (!YT.isWatchPage) {
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

	showRoutedView(k)
	{
		const view = {
			'/commands':CommandsView,
		}[k];

		if (!view) {
			return false;
		}

		return this.present(new view) | 1;
	}

	auditContext()
	{
		const newId = (this.videoId != YT.videoId) && (this.videoId = YT.videoId);

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
			time.int2hms(YT.player.currentTime)
		);
	}

	searchTerm(q)
	{
		if (q == null) {
			return this.searchInput.rawValue;
		}

		this.searchInput.value = q;
	}

	autoSearch(q)
	{
		this.searchTerm(q);
		this.execSearch(q);

		this.searchInput.focus();
	}

	toggleHighlighting(isCommand)
	{
		const icon = this.searchIcons.get({Eye:true});

		if (isCommand) {
			icon.toggleActive();
		}

		if (icon.isActive) {
			this.searchIcons.show({Eye:0});
		}
		else {
			this.searchIcons.hide({Eye:0});
		}

		this.resultsView.setHighlightState(icon.isActive);
		this.searchInput.focus();
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

class UICommentCount extends UIButton
{
	constructor(init)
	{
		init.import = 'innerHTML firstChild';

		super(init);
	}

	didInit(init)
	{
		this.innerHTML = `<text>${init.value}</text>`;

		super.didInit(init);
	}

	get value()
	{
		return this.firstChild.textContent;
	}

	set value(s)
	{
		if (s == this.value) {
			return;
		}

		this.firstChild.animate([
			{opacity:1},
			{opacity:0},
		],{
			fill:'forwards',
			duration:240,
		})
		.finished.then(anim => {
			this.firstChild.textContent = s;
			this.style.width = `${String(s).length}ch`;
			anim.reverse();
		});
	}

	tempState(s)
	{
		if (!s) {
			return this.prevState && assign(this, this.prevState) & (this.prevState = null);
		}

		if (s == this.value) {
			return;
		}

		this.prevState = {
			value:this.value,
			disabled:this.disabled,
		};

		this.value = s;
		this.disabled = true;
	}
}

class UISearchIcons extends UIView
{
	constructor(init)
	{
		super(init);
	}

	get(nameRender)
	{
		const [name, render] = unpack(nameRender);

		if (this[name]) {
			return this[name];
		}

		if (render) {
			return this.show({[name]:0});
		}
	}

	show(nameDelay)
	{
		const [name, delay] = unpack(nameDelay);

		this.showIcon(
			this[name] ?? this.render(name), delay
		);

		return this[name];
	}

	hide(nameDelay)
	{
		const [name, delay] = unpack(nameDelay);

		if (this[name]) {
			this.hideIcon(this[name], delay);
		}
	}

	render(name)
	{
		return this[name] = this.initIcon(name, {
			styles:'CSSearchHeaderIcon',
			image:`UIIcon${name}`,
			target:[this.delegate, `onClick:on${name}IconClicked`],
			superview:[this],
		});
	}

	initIcon(name, init)
	{
		if (name == 'Eye') {
			return new UIToggle(init);
		}

		return new UIButton(init);
	}

	showIcon(icon, delay)
	{
		setTimeout(_ => icon.addClass('CSAppear'), delay);
	}

	hideIcon(icon, delay)
	{
		setTimeout(_ => icon.delClass('CSAppear'), delay);
	}
}

class UISearchMessageView extends UIView
{
	constructor(delegate)
	{
		super({styles:'CSDialogMessage', delegate});

		this.messages = {
			emptyResponse:			'No results match your query',
			searchRequestSent:		'Searching...',
			errAwaitingResponse:	'Searching still...',
			errNotWatchPage:		'You are not watching any video',
			errEmptyQuery:			'Empty search query',
			errInvalidRegex:		'Invalid RegExp',
			errZeroComments:		'No comments to search',
			errNetwork:				'Network error',
			errServerDown:			'Service down for maintenance',
			errRequestTimeout:		'Request timeout',
			errUnsupportedFeature:	'Feature not supported for this video',
			errParseError:			'Invalid response from server, try again',
			errUnknown:				'An unexpected error occured',

			accessNotConfigured:	'Access not configured',
			rateLimitExceeded:		'Rate limit exceeded',
			quotaExceeded:			'Quota exceeded',
			processingFailure:		'Processing failure',
			videoNotFound:			'Video not found',
			forbidden:				'Request could not be processed',
			commentsDisabled:		'Comments are turned off',
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

		this.delegate.onMessageDidSet();
	}
}

class UISearchResultsView extends UITableView
{
	constructor(dataSource)
	{
		super(dataSource);
	}

	onEmbedRequest()
	{
		return this.inlinePlayer ||= new UIEmbeddedPlayer;
	}

	setVideoTime(sender)
	{
		YT.playerSetCurrentTime(sender.data.startAt);
	}

	pauseInlinePlayer()
	{
		this.inlinePlayer?.pause();
	}

	setHighlightState(bool)
	{
		this.highlight = bool;

		if (bool) {
			this.highlightText();
		}
		else {
			this.unhighlightText();
		}
	}

	set textToHighlight(s)
	{
		this.textToHighlight_ = s;

		if (!this.highlight) {
			return;
		}

		if (!s) {
			return this.unhighlightText();
		}

		this.highlightText();
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

	addSubviews(views, targetId)
	{
		super.addSubviews(views, targetId);

		this.highlight &&
			this.highlightText();
	}

	highlightText()
	{
		const r = regex.create('/%s/gi', this.textToHighlight_);

		this.highlightable.forEach(
			el => el.innerHTML = el.textContent.replace(r, m => `<mark>${m}</mark>`)
		);
	}

	unhighlightText()
	{
		this.highlightable.forEach(
			el => el.textContent = el.textContent
		);
	}

	get highlightable()
	{
		return this.querySelectorAll('text > span');
	}
}

class UIComment extends UIView
{
	constructor(comment)
	{
		super({data:comment});
	}

	didInit(init)
	{
		const comment = init.data;

		for (const k in comment)
		{
			(comment[k] === true) &&
				this.setAttribute(k, true);
		}

		this.renderImageView(comment);
		this.renderTextView(comment);

		super.didInit(init);
	}

	embedVideo(sender)
	{
		const {videoId, startAt} = sender.data;

		this.addSubview(
			this.handleAction('onEmbedRequest').load(videoId, startAt), 'main'
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
			native:'text',
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

class UIEmbeddedPlayer extends UIView
{
	constructor()
	{
		super({
			native:'iframe',
			import:'src contentDocument',
			events:'load',
			attrs: {
				allowfullscreen:true
			}
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

function SearchModelDelegate(self)
{
	return {
		onCommentCount(n)
		{
			if (n == CC_GLB) {
				return;
			}

			self.commentCount.value = match(n,
				[CC_NON, 'zero'],
				[CC_DIS, 'off'],
				[n, n],
			);

			self.commentCount.disabled = !ext.isCachable(n);
		},

		onResults(count, p)
		{
			this.onCommentCount(p);

			if (count) {
				return self.resultsView.pushInitialBatch() & self.showView(self.resultsView);
			}

			if (p < 1) {
				return self.messageView.showMessage(match(p,
					[CC_NON, 'errZeroComments'],
					[CC_DIS, 'commentsDisabled'],
					[CC_GLB, 'emptyResponse'],
				));
			}

			if (p < 150) {
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

class UpdatesView extends ViewController
{
	constructor()
	{
		super();

		this.setView(
			new UIUpdatesView(structuredClone(mem.updates), UpdatesViewDelegate(this))
		);
	}
}

class UIUpdatesView extends UIView
{
	constructor(items, delegate)
	{
		super({items, delegate});
	}

	didInit(init)
	{
		for (const data of init.items)
		{
			assign(data, this.constructor.map[data.type]);

			this.addSubview(
				new UIUpdate(data, this.delegate)
			);
		}
	}

	static map = {
		changelog: {
			header:'Version Update',
			detail:'Review changes in the latest release'
		}
	}
}

class UIUpdate extends UIView
{
	constructor(data, delegate)
	{
		super({events:'click', data, delegate});
	}

	onClick()
	{
		this.setChange({read:true});

		this.delegate.onUpdateClicked(this.data.type);
	}

	setChange(change)
	{
		const [k, v] = unpack(change);

		this.dataset[k] = v;

		this.delegate.onDataMutation(this.data.id, change);
	}
}

function UpdatesViewDelegate(self)
{
	return {
		onUpdateClicked(type)
		{
			if (type == 'changelog') {
				return self.present(new ChangelogView);
			}
		},

		onDataMutation(id, change)
		{
			assign(
				mem.updates.find(item => item.id == id), change
			);
		}
	}
}

class CommandsView extends ViewController
{
	constructor()
	{
		const commands = mem.commands;

		const items = [{
			name:'start',
			title:'Start the extension',
			value:commands.start
		},{
			name:'close',
			title:'Close the extension',
			accept:{Escape:'Esc'},
			value:commands.close,
		},{
			name:'highlight',
			title:'Highlight keywords in results',
			value:commands.highlight,
		},{
			name:'tsSearch',
			title:'Search current video time',
			value:commands.tsSearch,
		},{
			name:'fsClose',
			title:'Close while in fullscreen',
			reject:{Escape:'Escape is reserved in fullscreen'},
			value:commands.fsClose,
		}];

		super(
			new UICommandsView(items)
		);
	}

	onCommandChange(_, change)
	{
		assign(mem.commands, change);
	}

	onEditState(_, newState)
	{
		notifications.send({commandEdit:newState});
	}
}

class UICommandsView extends UIView
{
	constructor(items)
	{
		super({items});
	}

	didInit(init)
	{
		for (const data of init.items)
		{
			this.addSubview(
				new UICommand(data)
			);
		}

		super.didInit(init);
	}

	onCommandChange({name}, keys)
	{
		this.handleAction('onCommandChange', this, {[name]:keys});

		if (!keys.length) {
			return;
		}

		this.subviews.some(
			({input}) => (input.name != name) && array.isEqual(input.value, keys) && input.newValue([])
		);
	}

	onFocus()
	{
		this.handleAction('onEditState', this, 1);
	}

	onBlur()
	{
		this.handleAction('onEditState', this, 0);
	}
}

class UICommand extends UIView
{
	constructor(data)
	{
		super({data});
	}

	didInit(init)
	{
		this.addSubview(
			this.input = new UICommandInput(init.data), 'commandInput'
		);

		this.error = this.querySelector('error');

		super.didInit(init);
	}

	onError(sender, message)
	{
		this.error.textContent = message;
	}

	onBlur()
	{
		this.error.textContent = '';

		this.handleAction('onBlur', this);
	}
}

class UICommandInput extends UIInput
{
	constructor(init)
	{
		super(init);
	}

	didInit(init)
	{
		this.placeholder = 'none';

		this.accept = init.accept ?? {};
		this.reject = init.reject ?? {};

		super.didInit(init);
	}

	onFocus()
	{
		this.newValue([]) & super.onFocus();
	}

	onKeydown(e)
	{
		e.preventDefault();

		this.evaluate(e, e.key, e.code);
	}

	evaluate(e, key, code)
	{
		let keys = [];

		if (['Control', 'Alt', 'Meta', 'Shift'].includes(key)) {
			return;
		}

		if (this.reject[code]) {
			return this.error(this.reject[code]);
		}

		if (code == 'Escape' && !this.accept[code]) {
			return this.blur();
		}

		if (!this.accept[code])
		{
			keys = ['ctrlKey', 'metaKey', 'altKey', 'shiftKey'].filter(k => e[k]);

			if (keys.length == 0) {
				return this.error('Must start with Ctrl/Alt/Shift');
			}
		}

		keys.push(code) & this.newValue(keys) & this.blur();
	}

	newValue(keys)
	{
		this.value = keys;

		this.handleAction('onCommandChange', this, keys);
	}

	error(message)
	{
		this.handleAction('onError', this, message);
	}

	set value(keys)
	{
		this.inner = keys;

		keys = keys.map(
			s => string.capitalize(s.replace(/Key|Digit/, ''), string.PRE_STRCASE)
		);

		super.value = keys.join(' + ');
	}

	get value()
	{
		return this.inner;
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

class ChangelogView extends ViewController
{
	constructor()
	{
		super(
			new UIView({source:'UIChangelogView'})
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

class UIDocument
{
	constructor()
	{
		this.el = document.documentElement;

		if (location.pathname.startsWith('/embed/')) {
			this.setDarkModeState(true);
		}

		events.addListener({fullscreenchange:document},
			_ => this.setFullscreenState()
		);
	}

	insertAppView({element})
	{
		const prev = this.el.querySelector(element.nodeName);

		if (prev) {
			prev.setAttribute('reloaded', true) & prev.remove();
		}

		this.el.appendChild(element);
	}

	handleMoveEvent(pointerMoveFn)
	{
		return new Promise(resolve =>
		{
			window.onpointermove = pointerMoveFn;

			window.onpointerup = e =>
			{
				this.el.classList.remove('CSOnMove');

				resolve(
					window.onpointermove = onpointerup = null
				);
			};

			this.el.classList.add('CSOnMove');
		});
	}

	get isFullscreen()
	{
		return !!document.fullscreenElement;
	}

	setDarkModeState(bool)
	{
		this.el.setAttribute('dark', bool);
	}

	setFullscreenState()
	{
		this.el.setAttribute('fullscreen', this.isFullscreen);
	}
}

class Shortcuts
{
	constructor(commands)
	{
		this.interpret(commands);

		this.setListenerState(true);

		notifications.addListener(this,
			'commandEdit commandsDataChange'
		);
	}

	onKeydown(e)
	{
		const {mods, command} = this.map[e.code] || {};

		if (!command) {
			return;
		}

		for (const mod of mods) {
			if (!e[mod]) return;
		}

		notifications.send({command}) &&
			e.preventDefault() & e.stopPropagation();
	}

	onCommandEdit(bool)
	{
		this.setListenerState(!bool);
	}

	onCommandsDataChange(newValue)
	{
		this.interpret(newValue);
	}

	setListenerState(bool)
	{
		if (bool) {
			events.addListener({keydown:window}, this.onKeydown.bind(this), true);
		}
		else {
			events.removeListener({keydown:window});
		}
	}

	interpret(commands)
	{
		this.map = {};

		for (const [command, keys] of entries(commands))
		{
			if (keys.length == 0) {
				continue;
			}

			const [key, mods] = [
				keys.slice(-1)[0],
				keys.slice(0, -1),
			];

			this.map[key] = {mods, command};
		}
	}
}

class YT
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
		string.split('error unhandledrejection').forEach(
			event => addEventListener(event, this.onUncaughtError.bind(this))
		);
	}

	onReady()
	{
		self.events = new Events;

		this.sendMessage({clientLoad:true}).then(html =>
		{
			self.UI = new UIFactory(html);
			self.dom = new UIDocument;
			self.appController = new AppController;

			dom.insertAppView(appController.view);
		});

		new Shortcuts(mem.commands);
	}

	authUser(apiKey)
	{
		return this.sendMessage({userAuth:apiKey});
	}

	onActivate()
	{
		appController.start();
	}

	get contextInvalidated()
	{
		return !chrome.runtime?.id;
	}

	onUncaughtError(e)
	{
		if (this.contextInvalidated) {
			e.preventDefault() & notifications.contextInvalidated(true);
		}
	}
}

let app = new App;