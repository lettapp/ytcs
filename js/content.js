/*
 * This code is part of Comments Search for Youtube chrome extension
 *
 * LettApp lett.app/ytcs
 * GitHub  @lettapp
 */
'use strict';

const CC_NON = 0;
const CC_DIS = -1;

function none()
{
	return null;
}

function This(This)
{
	return This;
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

function assign()
{
	return Object.assign(...arguments);
}

function unpack(pack, ...moreArgs)
{
	return [...entries(pack)[0], ...moreArgs];
}

function pop(pack)
{
	let [key, object, val] = unpack(pack, null);

	val = object[key];

	return delete object[key] && val;
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

	return value;
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
		return /^\d+$/.test(s);
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
	static from(arrayOfObjects, k)
	{
		const o = {};

		for (const item of arrayOfObjects) {
			o[item[k]] = item;
		}

		return o;
	}

	static map(o, callback)
	{
		const x = {};

		for (const k in o) {
			x[k] = is.object(o[k]) ? this.map(o[k], callback) : callback(o[k]);
		}

		return x;
	}

	static filter(o)
	{
		for (const k in o) {
			null == o[k] && delete o[k];
		}

		return o;
	}

	static safeSet(target, values)
	{
		assign(target || {}, this.filter(values));
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

		return !diff ? 'now' : '';
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

	static hashCode(s)
	{
		let h = 0;

		for (let i = 0; i < s.length; i++) {
			h = Math.imul(31, h) + s.charCodeAt(i) | 0;
		}

		return h;
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
	static file = object.map({
		view:'/html/view.html',
		css:'/html/style.css',
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

	static send(notification)
	{
		let [id, data, catched] = unpack(notification, 0);

		for (const target of this.getChannel(id)) {
			catched |= target[on(id)](data);
		}

		return catched;
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

class PendingPromise extends Promise
{
	constructor(resolve)
	{
		super(e => resolve = e);

		Object.defineProperties(this, {
			constructor: {
				value:Promise
			},
			resolve: {
				value:resolve
			}
		});
	}
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
				[`${k}DataChange`]:this.items[k]
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
				pos:null,
				user:{},
				cache:{},
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

	onMessage(method, data)
	{
		if (!this.didDisconnect) {
			return this[method](data);
		}
	}

	disconnect()
	{
		this.didDisconnect = this.DIS_REQUEST;
	}

	get id()
	{
		return this.port.name;
	}

	onPortMessage(message)
	{
		this.onMessage(
			...unpack(message)
		);
	}

	onDisconnect()
	{
		this.didDisconnect = this.DIS_TIMEOUT;
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

	onConnect(port)
	{
		super.onConnect(port);

		this.workerReady = new PendingPromise;
	}

	didConnect()
	{
		this.workerReady.resolve(true);
	}

	postMessage(message)
	{
		this.canPost && this.workerReady.then(
			_ => this.port.postMessage(message)
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
		if (this.didDisconnect == this.DIS_REQUEST) {
			return;
		}

		if (this.didDisconnect == this.DIS_TIMEOUT) {
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

	onConnect(port)
	{
		super.onConnect(port);

		this.didConnect(true);
	}

	didConnect(didConnect)
	{
		this.postMessage({didConnect});
	}

	postMessage(message)
	{
		if (!this.didDisconnect) {
			this.port.postMessage(message);
		}
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
		const [id, data] = unpack(message);

		this[on(id)]?.(
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

	handleEvent(e, sender)
	{
		const event = e.name;

		if (event in this) {
			return this[event](e, sender);
		}

		if (this.onAnyEvent) {
			return this.onAnyEvent(event, e, sender);
		}

		if (this.sendAction(e)) {
			return;
		}

		this.superview?.handleEvent(e, sender);
	}

	handleAction(action, data, sender)
	{
		let nextResponder;

		if (!sender) {
			[action, data, sender] = unpack(action, this);
		}

		if (action in this && this != sender) {
			return this[action](sender, data);
		}

		if (nextResponder = this.parent || this.superview) {
			return nextResponder.handleAction(action, data, sender);
		}
	}

	nativeEventHandler(e)
	{
		e.stopPropagation();

		this.generateChainOfEvents(e).forEach(
			event => this.handleEvent(event, this)
		);
	}

	generateChainOfEvents(e)
	{
		const arr = [e];

		if (e.type == 'keydown' && e.key == 'Enter' && !e.shiftKey) {
			e.name = 'enter';
		}

		if (e.type == 'input')
		{
			const value = e.data;

			if (e.inputType == 'insertFromPaste') {
				arr.push({name:'paste', value});
			}

			if (e.inputType == 'insertFromDrop') {
				arr.push({name:'drop', value});
			}
		}

		arr.forEach(
			e => e.name = on(e.name || e.type)
		);

		return arr;
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

	create({source, native, ...init})
	{
		const html = this.protos[source];

		if (html) {
			return this.convert(string.replace(html, init));
		}

		if (native) {
			return document.createElement(native);
		}

		return document.createElement(source);
	}

	element(name, text)
	{
		const x = document.createElement(name);

		x.textContent = text;

		return x;
	}

	convert(html)
	{
		const x = document.createElement('div');

		x.innerHTML = html;

		return x.children[0];
	}
}

class UIData
{
	constructor(data)
	{
        this.targets = [];

		setTimeout(
			_ => this.didInit = true
		);

		return new Proxy(this,
		{
			get(self, k)
			{
				if (k in self) {
					return self[k].bind(self);
				}

				return data[k];
            },

			set(self, k, v)
			{
				if (!self.didInit) {
					return 1;
				}

                return self.set(k, v, data) | 1;
			},

			has(self, k)
			{
				return k in data;
			},

            ownKeys()
            {
                return keys(data);
            },

            getOwnPropertyDescriptor()
            {
                return {enumerable:true, configurable:true};
            }
		});
	}

	set(k, v, data)
    {
		if (this.isEqual(data[k], v)) {
			return;
		}

        data[k] = v;

		this.targets.forEach(
			target => target.onDataChange({id:data.id, [k]:v})
		);
    }

    addListener(target)
    {
        this.targets.push(target);
    }

	isEqual(a, b)
	{
		return JSON.stringify(a) == JSON.stringify(b);
	}
}

class UIView extends UIResponder
{
	constructor(init)
	{
		super();

		this.property = {};
		this.subviews = [];
		this.targets = {};

		this.element = UI.create(
			{source:this.constructor.name, ...init}
		);

		this.import(
			'style hidden remove textContent querySelector querySelectorAll addEventListener'
		);

		this.init(init);
	}

	init(init)
	{
		let skip = string.split('source native data styles import events attrib target text superview'),
			attr = string.split(init.attrib || ''),
			data = init.data || {};

		for (const k of attr) {
			init[k] ??= null;
		}

		if (init.data) {
			assign(init, this.data = data) & data.addListener(this);
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
			this.setTargets(...init.target);
		}

		if (init.text) {
			this.textContent = init.text;
		}

		for (const k in init)
		{
			let ignore = skip.includes(k),
				isAttr = attr.includes(k),
				isData = (k in data),
				inThis = (k in this);

			if (ignore) {
				continue;
			}

			if (isAttr || isData && !inThis)
			{
				Object.defineProperty(this, k,
				{
					get() {
						return this.property[k];
					},

					set(v) {
						if (isAttr) {
							this.attr[k] = v;
						}

						if (isData) {
							this.data[k] = v;
						}

						this.property[k] = v;
					}
				});
			}

			this[k] = init[k];
		}

		this.didInit(init);
	}

	didInit({superview})
	{
		superview?.at(0).addSubview(this, superview[1]);
	}

	onDataChange(o)
	{
		assign(this, o);
	}

	append(nameText)
	{
		const [name, text] = unpack(nameText);

		return this.appendChild(
			UI.element(name, text)
		);
	}

	appendChild(child)
	{
		return this.element.appendChild(child.element || child);
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

	tempClass(s, ms)
	{
		this.addClass(s) & setTimeout(_ => this.delClass(s), ms);
	}

	setStyles(obj, unit = '')
	{
		for (const k in obj) {
			this.style[k] = obj[k] + unit;
		}
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

	get attr()
	{
		return this.attr_ ??= new Proxy(this.element,
		{
			get(el, k)
			{
				const v = el.attributes[k]?.value;

				if (v == '') {
					return true;
				}

				return v;
			},

			set(el, k, v)
			{
				if (v) {
					el.setAttribute(k, v === true ? '' : v);
				}
				else {
    				el.removeAttribute(k);
				}

                return true;
			}
		});
	}

	addListener(events)
	{
		const handler = this.nativeEventHandler.bind(this);

		string.split(events).forEach(
			event => this.addEventListener(event, handler)
		);
	}

	setTargets(target, events)
	{
		events = string.split(events);

		for (const eventAction of events)
		{
			let [event, action] = eventAction.split(':');

			if (!action) {
				action = event;
			}

			this.targets[event] = [target, action];
		}
	}

	sendAction(e)
	{
		const [target, action] = this.targets[e.name] ?? [];

		if (target) {
			return !void target.handleAction(action, e, this);
		}
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

	destruct()
	{
		this.removeFromSuperview();

		clone(this.subviews).forEach(
			view => view.destruct()
		);

		this.targets = null;
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

	scrollToTop()
	{
		this.scrollTop = 0;
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

class UIStackView extends UIView
{
	preSegue()
	{
		this.subviews.slice(0, -1).forEach(
			view => view.style.opacity = 0
		);

		this.didPreSegue = this.fadeState(1) | 1;
	}

	segue(view, scrollTop)
	{
		const didPreSegue = pop({didPreSegue:this});
		const viewChanged = view != this.top;

		if (!didPreSegue)
		{
			if (viewChanged) {
				return this.fullSegue(view, scrollTop);
			}

			return;
		}

		if (viewChanged) {
			this.appendChild(view) & array.move(this.subviews, view);
		}

		if (scrollTop) {
			view.scrollToTop();
		}

		this.fadeState(0);
	}

	fullSegue(view, scrollTop)
	{
		this.preSegue() & this.segue(view, scrollTop);
	}

	fadeState(out)
	{
		let frames = [
			{opacity:0},
			{opacity:1},
		];

		if (out) {
			frames = frames.reverse();
		}

		this.top.element.animate(frames, {duration:150, fill:'forwards'});
	}

	get top()
	{
		return this.subviews.at(-1);
	}
}

class UITextInput extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			native:'input',
			import:'focus select blur',
			events:'focus keydown input blur',
			attrib:'name placeholder spellcheck autocomplete',
			spellcheck:'false',
			autocomplete:'off',
		});

		super(init);
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

	caretEnd()
	{
		this.element.setSelectionRange(1e3, 1e3);
	}
}

class UIControl extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			events:'click',
		});

		super(init);
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
			attrib:'active'
		});

		super(init);
	}

	toggleActive()
	{
		return this.active = !this.active;
	}

	onClick(e)
	{
		this.toggleActive() &
			this.sendAction(e);
	}
}

class UIImage extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			native:'img',
			events:'load error',
			attrib:'src loaded',
		});

		super(init);
	}

	onLoad()
	{
		this.loaded = true;
	}

	onError()
	{
		if (this.alterSrc) {
			this.src = pop({alterSrc:this});
		}
	}
}

class UIText extends UIView
{
	constructor(text)
	{
		super({text});
	}
}

class UIAnchor extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			native:'a',
			events:'click',
			attrib:'href',
		});

		super(init);
	}

	didInit(init)
	{
		this.attr.target = '_blank';

		super.didInit(init);
	}
}

class UIResizeBar extends UIView
{
	constructor(resize)
	{
		super({
			events:'pointerdown',
			attrib:'resize',
			resize,
		});
	}

	onPointerdown(e)
	{
		const p = this.resize;

		if (e.which != 1) {
			return;
		}

		this.superview.onResizeBarHold({
			startX:e.clientX,
			startY:e.clientY,
			isMove:p.includes('we'),
			resizeL:p.includes('w'),
			resizeR:p.includes('e'),
			resizeT:p.includes('n'),
		});
	}
}

class UIProgressBar extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			native:'progress-bar',
			attrib:'state',
		});

		super(init);
	}

	get loading()
	{
		this.state = 'loading';
	}

	get fadeout()
	{
		this.element.animate([
			{opacity:1},
			{opacity:0},
		],{
			duration:200
		})
		.finished.then(_ =>
			this.state = 'initial'
		);
	}
}

class UIProgressInput extends UIView
{
	didInit(init)
	{
		this.input = new UITextInput({
			placeholder:init.placeholder,
			superview:[this]
		});

		this.progressBar = new UIProgressBar({
			superview:[this]
		});

		this.messageText = new UIView({
			native:'text',
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
		this.progressBar.state = state;
		this.messageText.textContent = message;
	}

	onAnyEvent(name, e, sender)
	{
		if (this.state == 'loading') {
			return;
		}

		if (name == 'onInput') {
			this.setState('initial');
		}

		if ('onPaste.onEnter'.includes(name))
		{
			const [pattern, message] = this.validator;

			if (!this.value) {
				return;
			}

			if (!pattern.test(this.value)) {
				return this.setState('error', message);
			}
		}

		this.sendAction(e);
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
		if (modelDelegate) {
			model.delegate = modelDelegate(this);
		}

		this.modelDidSet(
			this.model = model
		);
	}

	viewDidSet(view) {
	}

	modelDidSet(model) {
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
			target:[this, 'onClick:removeChild'],
			superview:[view],
			hidden:true,
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
			new UIAppView(460, 56), This
		);

		notifications.addListener(this,
			'command userAuth contextInvalidated'
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
			this.onUserAuth(true);
		}
		else {
			this.onAuthRequired();
		}

		this.observeContext(view);
	}

	viewWillAppear()
	{
		super.viewWillAppear();

		this.view.setPosition();
	}

	getPosition()
	{
		return mem.pos || {
			x:innerWidth - 460 - 100,
			y:0,
			w:460,
			h:540,
		};
	}

	didPosition()
	{
		const rect = this.view.rect;

		mem.pos = {
			x:rect.x,
			y:rect.y,
			w:rect.width,
			h:rect.height,
		};
	}

	onCommand(c)
	{
		if (c == 'start' || c == 'tsSearch' && YT.isWatchPage) {
			return this.start(c) | 1;
		}

		if (c == 'close' || c == 'fsClose')
		{
			if (!this.isVisible || c == 'fsClose' && !dom.isFullscreen) {
				return;
			}

			return this.close(c) | 1;
		}
	}

	onAuthRequired()
	{
		this.addChild(
			new AuthView(this.didAuth = false)
		);
	}

	onUserAuth(didAuth)
	{
		this.showSearchView(didAuth);
	}

	showSearchView(didAuth)
	{
		this.addChild(
			new SearchView(this.didAuth = didAuth)
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

		if (!this.didAuth) {
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

class UIAppView extends UIView
{
	constructor(minWidth, minHeight)
	{
		super({
			style:ext.file.css,
			minWidth,
			minHeight,
		});
	}

	didInit(init)
	{
		events.addListener({resize:window},
			_ => this.setPosition()
		);

		string.split('w e n ne nw we').forEach(
			resize => this.addSubview(new UIResizeBar(resize))
		);

		super.didInit(init);
	}

	setPosition()
	{
		let {w, h, x, y} = this.delegate.getPosition();

		w = math.bound(w, [this.minWidth, innerWidth]);
		x = math.bound(x, [0, innerWidth - w]);
		y = math.bound(innerHeight - h, [0]);

		this.setStyles({
			top:y,
			left:x,
			width:w,
			minWidth:this.minWidth,
		}, 'px');
	}

	onResizeBarHold(data)
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

			this.setStyles({
				top:finalT,
				left:finalL,
				width:finalW,
			}, 'px');
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
		if (this.hidden) {
			return;
		}

		this.delegate.didPosition();
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

	onAuth(sender, userAuth)
	{
		notifications.send({userAuth});
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
			superview:[view]
		});

		new UIImage({
			src:ext.file.svg.auth,
			superview:[view]
		});

		new UIAnchor({
			text:'What is Youtube API key?',
			target:[this, 'onClick:showHelpView'],
			superview:[view]
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
			this.handleAction({onAuth:true});
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
			new UIView({source:'UIHelpView', usage})
		);
	}

	viewDidSet(view)
	{
		new UIProgressButton({
			styles:'CSStickBottom',
			label:'Try it without key',
			target:[this, 'onClick:tryButtonClicked'],
			superview:[view],
			usage:view.usage,
		});
	}

	tryButtonClicked()
	{
		this.handleAction({onAuth:false});
	}
}

class UIProgressButton extends UIButton
{
	onClick(e)
	{
		if (this.usage == 0) {
			return this.tempClass('CSWiggle', 500);
		}

		this.sendAction(e);
	}
}

class SearchView extends ViewController
{
	constructor(didAuth)
	{
		super(
			new UIView({source:'UISearchView'})
		);

		this.didAuth = didAuth;

		notifications.addListener(this, 'command');
	}

	viewDidSet(view)
	{
		this.searchInput = new UITextInput({
			placeholder:'type keywords here..',
			target:[this, 'onFocus:recontext onEnter:onSubmit onInput onDrop onPaste'],
			superview:[view, 'header']
		});

		this.searchIcons = new UISearchIcons({
			delegate:this,
			superview:[view, 'header']
		});

		this.commentCount = new UICommentCount({
			styles:'CSCommentCount',
			attrib:'disabled',
			disabled:true,
			target:[this, 'onClick:showFeaturesView'],
			superview:[view, 'header']
		});

		this.progressBar = new UIProgressBar({
			superview:[view, 'header']
		});

		this.contentView = new UIStackView({
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
		const updates = mem.updates.some(item => item.new);

		if (updates) {
			this.searchIcons.show({Bell:1e3});
		}
		else {
			this.searchIcons.hide({Bell:400});
		}

		this.recontext();
	}

	viewDidAppear()
	{
		this.focusInput();
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
			return this.focusInput(true);
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

		this.execSearch(q);
	}

	onInput(e)
	{
		this.resultsView.textToHighlight = e.value;

		this.commentCount.toggleTempState(
			this.isGlobalMode && 'global'
		);

		this.warmup();
	}

	onPaste()
	{
		if (this.searchIcons.get({Eye:false})?.active) {
			return;
		}

		this.onSubmit();
	}

	onDrop(_, {value})
	{
		this.autoSearch(value);
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
		this.autoSearch(':all');
	}

	showView(view, scrollTop)
	{
		this.progressBar.fadeout;
		this.contentView.segue(view, scrollTop);
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

	execSearch(q)
	{
		this.model.search(q);

		if (this.contentView.top != this.messageView) {
			this.contentView.preSegue();
		}

		this.progressBar.loading;
	}

	searchCurrentTime()
	{
		const t = time.int2hms(YT.player.currentTime);

		setTimeout(
			_ => this.autoSearch(t)
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
		this.focusInput();
		this.onSubmit();
	}

	toggleHighlighting(isCommand)
	{
		const icon = this.searchIcons.get({Eye:true});

		if (isCommand) {
			icon.toggleActive();
		}

		if (icon.active) {
			this.searchIcons.show({Eye:0});
		}
		else {
			this.searchIcons.hide({Eye:0});
		}

		this.resultsView.setHighlightState(icon.active);
		this.focusInput();
	}

	focusInput(select)
	{
		const input = this.searchInput;

		if (select) {
			input.select();
		}
		else {
			input.caretEnd();
		}

		input.focus();
	}

	recontext()
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

	warmup()
	{
		const port = this.model;

		if (!this.didTimeout || !port) {
			return;
		}

		if (port.id == YT.videoId) {
			port.reconnect();
		}
		else {
			this.recontext();
		}

		this.didTimeout = false;
	}

	get nextBatch()
	{
		return this.model.nextBatch(25);
	}

	get isGlobalMode()
	{
		return this.searchInput.value.startsWith('global:');
	}
}

class SearchModel extends MasterPort
{
	search(q)
	{
		this.postMessage({searchRequest:q});
	}

	nextBatch(size)
	{
		return this.lastResults.splice(0, size);
	}

	onContextLoad(context)
	{
		this.delegate.onContextLoad(context);
	}

	onDisconnect()
	{
		super.onDisconnect();

		this.delegate.onTimeout();
	}

	searchRequest(r)
	{
		this.lastResults = r.threads;

		this.delegate.onResults(r.threads.length);
	}

	error(errorId)
	{
		this.delegate.onError(errorId);
	}
}

class UICommentCount extends UIButton
{
	didInit(init)
	{
		this.curval = 0;
		this.ticker = this.append({text:0});

		super.didInit(init);
	}

	set value([value, disabled])
	{
		if (this.inTempState) {
			return this.mainState = [value, disabled];
		}

		if (value == this.curval) {
			return;
		}

		this.ticker.animate([
			{opacity:1},
			{opacity:0},
		],{
			fill:'forwards',
			duration:240,
		})
		.finished.then(anim => {
			this.disabled = disabled
			this.ticker.textContent = value;
			this.style.width = `${String(value).length}ch`;
			anim.reverse();
		});

		this.curval = value;
	}

	toggleTempState(tempVal)
	{
		if (!tempVal && this.inTempState) {
			this.value = pop({mainState:this});
		}

		if (tempVal && !this.inTempState)
		{
			const mainState = [this.value, this.disabled];

			this.value = [tempVal, true];
			this.mainState = mainState;
		}
	}

	get inTempState()
	{
		return !!this.mainState;
	}

	get value()
	{
		return this.curval;
	}
}

class UISearchIcons extends UIView
{
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
			emptyResponse:		'No results match your query',
			errNotWatchPage:	'You are not watching any video',
			errEmptyQuery:		'Empty search query',
			errInvalidRegex:	'Invalid RegExp',
			errNoComments:		'No comments to search',
			errCommentsOff:		'Comments are turned off',
			errLimitedFeature:	'Feature not available for this video',
			errServerDown:		'Service down for maintenance',
			errParsing:			'Invalid response from server',
			errNetwork:			'You seem to be offline',
			errUnknown:			'An unexpected error occured',
		};
	}

	showMessage(id)
	{
		this.setMessage(
			this.messages[id] || string.grep(/^\w+$/, id) || this.messages.errUnknown
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
		YT.playerSetCurrentTime(sender.startAt);
	}

	pauseInlinePlayer()
	{
		this.inlinePlayer?.pause();
	}

	setHighlightState(bool)
	{
		this.highlightText(
			(this.highlight = bool) ? this.userText : null
		);
	}

	set textToHighlight(s)
	{
		this.userText = s;

		if (this.highlight) {
			this.highlightText(s);
		}
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

		if (this.highlight) {
			this.highlightText(this.userText);
		}
	}

	highlightText(s)
	{
		const nodes = this.querySelectorAll('text > s');

		if (!s) {
			nodes.forEach(el => el.textContent = el.textContent);
		}
		else {
			const r = regex.create('/%s/gi', s);

			nodes.forEach(
				el => el.innerHTML = el.textContent.replace(r, m => `<mark>${m}</mark>`)
			);
		}
	}
}

class UIComment extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			attrib:'isReply isChained isUploader'
		});

		super(init);
	}

	didInit(init)
	{
		this.renderImageView(init);
		this.renderTextView(init);

		super.didInit(init);
	}

	embedVideo({videoId, startAt})
	{
		this.addSubview(
			this.handleAction({onEmbedRequest:0}).load(videoId, startAt)
		);
	}

	renderImageView(comment)
	{
		const imageUrl = comment.authorImgUrl;
		const largeUrl = imageUrl.replace(
			/=s\d+/, string.format('=s%s', comment.isReply ? 48 : 80)
		);

		new UIImage({
			src:largeUrl,
			alterSrc:imageUrl,
			superview:[this, 'userImage']
		});
	}

	renderTextView(comment)
	{
		const textView = new UIView({
			native:'text',
			attrib:'lang dir',
			superview:[this],
			... comment.locale
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

			textView.append({s});
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
		if (x.type == 'TimeTag') {
			x.target = [this, 'onClick:setVideoTime'];
		}

		if (x.type == 'EmbedLink') {
			x.target = [this, 'onClick:embedVideo'];
		}

		return new UIAnchor(x);
	}
}

class UIEmbeddedPlayer extends UIView
{
	constructor()
	{
		super({
			native:'iframe',
			import:'contentDocument',
			events:'load',
			attrib:'src allowfullscreen',
			allowfullscreen:true
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
		onContextLoad({maxCount, cachable})
		{
			self.maxCount = maxCount;

			const n = match(maxCount,
				[CC_NON, 'zero'],
				[CC_DIS, 'off'],
			);

			self.commentCount.value = [n, !cachable];
		},

		onResults(size)
		{
			const {resultsView, messageView, maxCount:p} = self;

			if (size) {
				return resultsView.pushInitialBatch() & self.showView(resultsView, true);
			}

			if (p > 150 || self.isGlobalMode) {
				return messageView.showMessage('emptyResponse');
			}

			if (p < 1) {
				return messageView.showMessage(match(p,
					[CC_NON, 'errNoComments'],
					[CC_DIS, 'errCommentsOff'],
				));
			}

			if (p <= 150) {
				return messageView.showCustomMessage('Nothing found in ',
					new UIAnchor({text:`${p} comments`, target:[self, 'onClick:getAllComments']}
				));
			}
		},

		onError(errorId)
		{
			self.messageView.showMessage(errorId);
		},

		onTimeout()
		{
			self.didTimeout = true;
		}
	}
}

class UpdatesView extends ViewController
{
	constructor()
	{
		const items = structuredClone(mem.updates).map(
			data => new UIData(data)
		);

		super(
			new UIUpdatesView(items), This
		);

		items.forEach(
			data => data.addListener(this)
		);
	}

	onDataChange({id, ...change})
	{
		assign(
			mem.updates.find(item => item.id == id), change
		);
	}

	onUpdateClicked(type)
	{
		if (type == 'changelog') {
			return this.present(new ChangelogView);
		}
	}
}

class UIUpdatesView extends UIView
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
				new UIUpdate(data, this.constructor.map[data.type])
			);
		}
	}

	onClick(sender)
	{
		this.delegate.onUpdateClicked(sender.type);
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
	constructor(data, init)
	{
		super({
			data, events:'click', attrib:'new', ...init
		});
	}

	onClick()
	{
		this.new = false;

		this.superview.onClick(this);
	}
}

class CommandsView extends ViewController
{
	constructor()
	{
		const items = [{
			name:'start',
			title:'Start the extension',
		},{
			name:'close',
			title:'Close the extension',
			accept:{Escape:'Esc'},
		},{
			name:'highlight',
			title:'Highlight keywords in results',
		},{
			name:'tsSearch',
			title:'Search current video time',
		},{
			name:'fsClose',
			title:'Close while in fullscreen',
			reject:{Escape:'Esc is reserved in fullscreen'},
		}];

		items.forEach(
			item => item.data = new UIData({id:item.name, keys:mem.commands[item.name]})
		);

		super(
			new UICommandsView(items), This
		);

		items.forEach(
			({data}) => data.addListener(this)
		);

		this.items = items;
	}

	onDataChange({id, keys})
	{
		const c = {};

		for (const {data} of this.items)
		{
			let cflct = keys.length && (data.id != id) && array.isEqual(data.keys, keys);

			if (cflct) {
				data.keys = [];
			}

			c[data.id] = data.keys;
		}

		mem.commands = c;
	}

	onEditState(newState)
	{
		notifications.send({commandEdit:newState});
	}
}

class UICommandsView extends UIView
{
	constructor(items)
	{
		super({events:'focusin focusout', items});
	}

	didInit(init)
	{
		for (const item of init.items)
		{
			this.addSubview(
				new UICommand(item)
			);
		}

		super.didInit(init);
	}

	onFocusin(e)
	{
		this.delegate.onEditState(true);
	}

	onFocusout(e)
	{
		this.delegate.onEditState(false);
	}
}

class UICommand extends UIView
{
	didInit(item)
	{
		this.error = this.append({error:null});

		this.input = new UICommandInput(
			item.data,
			item.accept,
			item.reject, {
				placeholder:'none',
				delegate:this,
				superview:[this],
			}
		);

		super.didInit(item);
	}

	onInputReject(reason)
	{
		this.error.textContent = reason;
	}

	onBlur(e)
	{
		this.error.textContent = '';
	}
}

class UICommandInput extends UITextInput
{
	constructor(data, accept = {}, reject = {}, init)
	{
		super({data, accept, reject, ...init});
	}

	onFocus(e)
	{
		this.keys = [];
	}

	onKeydown(e)
	{
		e.preventDefault() & this.evaluate(e, e);
	}

	error(msg)
	{
		this.delegate.onInputReject(msg);
	}

	evaluate({key, code}, e)
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

		keys.push(code) & (this.keys = keys) & this.blur();
	}

	set keys(arr)
	{
		this.data.keys = arr;

		arr = arr.map(
			s => string.capitalize(s.replace(/Key|Digit/, ''), string.PRE_STRCASE)
		);

		super.value = arr.join(' + ');
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
		this.setBoolAttribute('dark', bool);
	}

	setFullscreenState()
	{
		this.setBoolAttribute('fullscreen', this.isFullscreen);
	}

	setBoolAttribute(k, v)
	{
		if (v) {
			this.el.setAttribute(k, '');
		}
		else {
			this.el.removeAttribute(k);
		}
	}
}

class Shortcuts
{
	constructor(commands)
	{
		this.interpret(commands);
		this.keydownEvents(true);

		notifications.addListener(this,
			'commandEdit commandsDataChange'
		);
	}

	onKeydown(e)
	{
		const command = this.map[this.generateId(e)];

		if (command) {
			notifications.send({command}) && e.preventDefault() & e.stopPropagation();
		}
	}

	onCommandEdit(isEditing)
	{
		this.keydownEvents(!isEditing);
	}

	onCommandsDataChange(newValue)
	{
		this.interpret(newValue);
	}

	interpret(commands)
	{
		this.map = {};

		for (const [command, keys] of entries(commands))
		{
			if (keys.length == 0) {
				continue;
			}

			const id = this.generateId({
				code:keys.at(-1),
				altKey:keys.includes('altKey'),
				ctrlKey:keys.includes('ctrlKey'),
				metaKey:keys.includes('metaKey'),
				shiftKey:keys.includes('shiftKey'),
			});

			this.map[id] = command;
		}
	}

	generateId(e)
	{
		return [e.code, +e.altKey, +e.ctrlKey, +e.metaKey, +e.shiftKey].toString();
	}

	keydownEvents(listen)
	{
		if (listen) {
			events.addListener({keydown:window}, this.onKeydown.bind(this), true);
		}
		else {
			events.removeListener({keydown:window});
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