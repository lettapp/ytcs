/*
 * This code is part of Comments Search for Youtube chrome extension
 *
 * LettApp lett.app/ytcs
 * GitHub  @lettapp
 */
'use strict';

const CommentCount = {
	Non:0,
	Off:-1,
}

void function()
{
	const define = {
		Object: {
			keys:0,
			values:0,
			assign:0,
			entries:0,
			defineProperty:0,
			defineProperties:0,
		},
		CSS: {
			px:0,
		}
	}

	for (const k in define)
	{
		if (k in self) for (const f in define[k]) {
			self[f] = self[k][f];
		}
	}

	self.tmp = null;
}()

async function thenable(any)
{
	return any;
}

function none()
{
	return null;
}

function unpack(pack)
{
	return entries(pack)[0];
}

function bare(data = {})
{
	return assign(
		Object.create(null), data
	);
}

function match(value, ...cases)
{
	for (const [k, v] of cases) {
		if (k === value) return v;
	}

	return value;
}

function pop(property)
{
	const [key, object] = unpack(property);

	return [object[key], delete object[key]][0];
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

	static int(x)
	{
		return Number.isInteger(x);
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

	static populate(str, data)
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
		str = str.replace(/[\u200B-\u200D\uFEFF]/g, ' ');

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

	static PRE_STRCASE = 1;
	static PRE_NEWLINE = 1;
}

class array
{
	static cast(x)
	{
		return is.array(x) ? x : [x];
	}

	static move(arr, any, to = Infinity)
	{
		const from = is.int(any) ? any : arr.indexOf(any);

		this.insertAt(arr, to,
			this.removeAt(arr, from)
		);

		return any;
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

	static isEqual(a, b)
	{
		return a.every(
			(v, i) => v === b[i]
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

	static MAP_MODE_SKIP = 1;
	static MAP_MODE_STOP = 2;
	static MAP_MODE_FAIL = 3;
}

class object
{
	static from(arrayOfObjects, k)
	{
		const o = bare();

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

	static fromUnix(unix)
	{
		const s = new Date(unix * 1e3).toLocaleString('en', {
			year:'numeric',
			month:'short',
			day:'2-digit',
			hour:'2-digit',
			minute:'2-digit',
			hour12:true,
		});

		return s.replace(/(\d{4}), 0?/, '$1 at ');
	}

	static toUnix(s)
	{
		if (+s == s) {
			return +s;
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

		if (!is.int(n) || n < 1 || n > 16) {
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

	static wrap(n, [min, max])
	{
		return n < min ? max : n > max ? min : n;
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

	static length(a, b)
	{
		return a.length - b.length;
	}
}

class throttle
{
	static reset(fn, delay = 0)
	{
		clearTimeout(this[fn]);

		this[fn] = setTimeout(fn, delay);
	}

	static retry(fn, [delay, i])
	{
		setTimeout(_ =>
			!fn() && i-- && this.retry(fn, [delay, i]), delay
		);
	}
}

class ext
{
	static file = object.map({
		view:'/html/view.html',
		css:'/html/style.css',
		svg: {
			auth:'/html/svg/auth.svg',
			code:'/html/svg/code.svg',
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
		let catched, [id, data] = unpack(notification);

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

		defineProperties(this, {
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
		throttle.reset(
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

	postMessage(message)
	{
		this.port.postMessage(message);
	}

	onPortMessage(message)
	{
		this.onMessage(
			...unpack(message)
		);
	}

	onMessage(id, data)
	{
		if (!this.didDisconnect) {
			return this[on(id)](data);
		}
	}

	onDisconnect()
	{
		this.didDisconnect = this.DIS_TIMEOUT;
	}

	disconnect()
	{
		this.didDisconnect = this.DIS_REQUEST;
	}

	get id()
	{
		return this.port.name;
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

	onWorkerReady()
	{
		this.workerReady.resolve(true);
	}

	reconnect()
	{
		this.onConnect(
			chrome.runtime.connect({name:this.port.name})
		);
	}

	postMessage(message)
	{
		this.canPost && this.workerReady.then(_ =>
			super.postMessage(message)
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

class TopComment
{
	constructor()
	{
		this.id			= null;
		this.videoId	= null;
		this.authorId	= null;
		this.replyCount	= null;
		this.isReply	= null;
		this.sourceName	= null;
		this.sourceText	= null;
	}

	static from(source)
	{
		const self = new this;

		if (tmp = source.topLevelComment)
		{
			assign(self,
				new YTComment(tmp)
			);

			self.isReply	= false;
			self.videoId	= source.videoId;
			self.replyCount	= source.totalReplyCount;
		}
		else {
			for (const k in self) {
				self[k] = source[k] ?? '';
			}
		}

		return self;
	}
}

class Main
{
	constructor(waitLoad)
	{
		waitLoad.then(
			this.onReady.bind(this)
		);

		this.register(waitLoad, {
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

	register(waitLoad, events)
	{
		const handler = function(event, ...args)
		{
			waitLoad.then(_ =>
				this[event](...args)
			);

			return true;
		}

		for (const event in events)
		{
			this[event] && events[event].addListener(
				handler.bind(this, event)
			);
		}
	}
}

class UIResponder
{
	setParent(parent)
	{
		this.parent = parent;

		if (this instanceof UIView) {
			this.delegate = parent;
		}
	}

	onUIEvent(event, e)
	{
		event = on(event);

		if (event in this) {
			return this[event](e);
		}

		this.sendAction(event);
	}

	onEvent(event, data, sender)
	{
		if (event in this) {
			return this[event](data, sender);
		}

		this.next?.onEvent(event, data, sender);
	}

	dispatch(eventData, sender = this)
	{
		this.next.onEvent(
			...unpack(eventData), sender
		);
	}

	get next()
	{
		return this.parent || this.superview;
	}
}

class UIData
{
	constructor(data)
	{
		this.targets = [];

		setTimeout(_ =>
			this.didInit = true
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

class gc
{
	static collect(view)
	{
		throttle.reset(
			gcan => this.empty(), 3e3
		);

		this.gcan.push(view);
	}

	static empty()
	{
		for (const view of this.gcan) {
			this.destruct(view);
		}

		this.gcan = [];
	}

	static destruct(view)
	{
		UI.unregisterEvents(view);

		for (const subview of view.subviews) {
			this.destruct(subview);
		}

		for (const x in view) {
			view[x] = null;
		}
	}

	static gcan = [];
}

class UI
{
	static construct(html)
	{
		this.html = document.createElement('div');

		this.UIEvents = {
			onClick:'click',
			onError:'error',
			onFocus:'focus',
			onFocusin:'focusin',
			onFocusout:'focusout',
			onInput:'input',
			onKeydown:'keydown',
			onLoad:'load',
			onMouseleave:'mouseleave',
			onMousemove:'mousemove',
			onPointerdown:'pointerdown',
			onScroll:'scroll',
			onWheel:'wheel',
		};

		this.Event = {
			ArrowDir({code})
			{
				const dir = {
					ArrowDown:1,
					ArrowUp:-1,
				};

				return dir[code];
			}
		};

		this.protos = {};

		for (const el of this.convert(html).children)
		{
			this.protos[el.attributes.removeNamedItem('protoid').value] = el.outerHTML;
		}
	}

	static create({source, native, ...init})
	{
		const html = this.protos[source];

		if (html) {
			return this.convert(string.populate(html, init));
		}

		return document.createElement(
			native || source.substr(2).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
		);
	}

	static custom(name, textContent)
	{
		return assign(
			document.createElement(name), {textContent}
		);
	}

	static extend(a, b)
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

	static addEventListener(view, k)
	{
		view.element.addEventListener(
			this.UIEvents[k], view.eventHandler
		);
	}

	static removeEventListener(view, k)
	{
		view.element.removeEventListener(
			this.UIEvents[k], view.eventHandler
		);
	}

	static lazyRegisterEvent(view, k)
	{
		if (this.UIEvents[k]) {
			this.addEventListener(view, k);
		}
	}

	static registerEvents(view, init)
	{
		view.eventHandler = e => {
			e.stopPropagation() & view.onUIEvent(e.type, e)
		};

		for (const k in this.UIEvents)
		{
			if (k in view || k in init) {
				this.addEventListener(view, k);
			}

			if (k in init) {
				const [event, superview] = unpack(init[k]);

				view.targets[k] = [null,
					(event in superview)
						? _ => superview[event](view)
						: _ => superview.dispatch({[event]:superview}, view)
				];

				delete init[k];
			}
		}
	}

	static unregisterEvents(view)
	{
		for (const k in this.UIEvents) {
			this.removeEventListener(view, k);
		}
	}

	static convert(innerHTML)
	{
		return assign(this.html, {innerHTML}).firstChild;
	}
}

class UIView extends UIResponder
{
	constructor(init = {})
	{
		super();

		this.property = {};
		this.subviews = [];
		this.targets = {};

		this.element = UI.create(
			{source:this.constructor.name, ...init}
		);

		this.import(
			'animate hidden querySelector querySelectorAll remove style textContent'
		);

		UI.registerEvents(this, init);

		this.init(init);
	}

	init(init)
	{
		let skip = string.split('attrib data import native source styles subviews superview target text'),
			attr = string.split(init.attrib),
			data = init.data || {};

		for (const k of attr) {
			init[k] ??= null;
		}

		if (init.data) {
			this.makeDataCompatible(init, init.data);
		}

		if (init.import) {
			this.import(init.import);
		}

		if (init.target) {
			this.setTargets(...init.target);
		}

		if (init.styles) {
			this.addClass(init.styles);
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
				defineProperty(this, k,
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
					},
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

	append(nameText)
	{
		const [name, text] = unpack(nameText);

		return this.appendChild(
			UI.custom(name, text)
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

	addStyle(rules)
	{
		assign(this.style, rules);
	}

	addSubview(view, selector)
	{
		if (view.superview)
		{
			if (view.superview == this) {
				return;
			}

			view.removeFromSuperview();
		}

		(view.superview = this).subviews.push(view);

		if (selector) {
			this.querySelector(selector).appendChild(view.element);
		}
		else {
			this.appendChild(view);
		}

		return view;
	}

	addSubviews(views, selector)
	{
		for (const view of views) {
			this.addSubview(view, selector);
		}

		return views;
	}

	removeFromSuperview()
	{
		const subviews = this.superview?.subviews;

		if (subviews) {
			this.superview = void array.remove(this, subviews);
		}

		this.remove();
	}

	clear()
	{
		let i = this.subviews.length;

		while (i--) {
			this.subviews[i].destruct();
		}
	}

	hide(bool)
	{
		this.hidden = bool;
	}

	get rect()
	{
		return this.element.getBoundingClientRect();
	}

	get attr()
	{
		const value = new Proxy(this.element,
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

		return defineProperty(this, 'attr', {value}).attr;
	}

	get isVisible()
	{
		let {x, y, width:w, height:h} = this.rect;

		x = x + (w / 2);
		y = y + (h / 2);

		return this.element.contains(
			document.elementFromPoint(x, y)
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

			UI.lazyRegisterEvent(this, event);
		}
	}

	sendAction(event)
	{
		const [target, action] = this.targets[event] ?? [];

		if (target) {
			return target.onEvent(action, this, this);
		}

		action && action();
	}

	makeDataCompatible(init, data)
	{
		assign(init, this.data = data);

		if (!this.onDataChange) {
			defineProperty(this, 'onDataChange', {
				value: assign.bind(null, this)
			});
		}

		data.addListener(this);
	}

	import(s)
	{
		const e = this.element, p = {};

		for (const k of string.split(s))
		{
			if (k in this) {
				continue;
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

		defineProperties(this, p);
	}

	destruct()
	{
		this.removeFromSuperview();

		gc.collect(this);
	}
}

class UIViewStack extends UIView
{
	constructor(init = {})
	{
		UI.extend(init, {
			native:'view-stack'
		});

		super(init);
	}

	didInit(init)
	{
		if (init.subviews) {
			this.addSubviews(init.subviews);
		}

		super.didInit(init);
	}

	preSegue()
	{
		this.subviews.slice(0, -1).forEach(
			view => view.style.opacity = 0
		);

		this.didPreSegue = this.fadeout();
	}

	preSegueIfNot(view)
	{
		!this.isTop(view) && this.preSegue();
	}

	segue(view)
	{
		const didPreSegue = pop({didPreSegue:this});
		const viewChanged = !this.isTop(view);

		if (!didPreSegue)
		{
			if (viewChanged) {
				return this.fullSegue(view);
			}

			return view.everSegued ||= this.fadein();
		}

		if (viewChanged) {
			this.toTop(view);
		}

		view.everSegued = this.fadein();
	}

	fullSegue(view)
	{
		this.preSegue() & this.segue(view);
	}

	fadeout()
	{
		const view = this.top;

		return !!UX.fadeout(view).then(
			animEnd => view.didDisappear?.()
		);
	}

	fadein()
	{
		return !!UX.fadein(this.top);
	}

	toTop(view)
	{
		this.appendChild(
			array.move(this.subviews, view)
		);
	}

	isTop(view)
	{
		return this.top == view;
	}

	get top()
	{
		return this.subviews.at(-1);
	}
}

class UIScrollView extends UIView
{
	constructor(init = {}, attributeFilter = [])
	{
		UI.extend(init, {
			native:'scroll-view',
			import:'scrollTop scrollHeight offsetHeight',
			attrib:'tabindex overscroll',
			tabindex:1,
		});

		super(init);

		new MutationObserver(
			this.onMutation.bind(this)
		)
		.observe(this.element, {
			childList:true,
			attributes:true,
			subtree:true,
			attributeFilter,
		});
	}

	focus(scrollDir)
	{
		this.element.focus();

		if (scrollDir) {
			this.scroll(scrollDir);
		}
	}

	scrollToTop()
	{
		this.scrollTop = 0;
	}

	scrollToBottom()
	{
		this.element.scrollTo(
			{top:this.scrollHeight, behavior:'smooth'}
		);
	}

	onKeydown(e)
	{
		const dir = UI.Event.ArrowDir(e);

		if (dir || e.code == 'Space') {
			e.preventDefault();
		}

		if (dir) {
			this.scroll(dir);
		}
	}

	onWheel(e)
	{
		this.preventWheel && e.preventDefault();
	}

	scroll(dir, x = 40, tick = 5)
	{
		requestAnimationFrame(_ =>
		{
			this.scrollTop += tick * dir;

			(x -= tick) > 0 &&
				this.scroll(dir, x);
		});
	}

	onMutation()
	{
		requestAnimationFrame(_ => {
			this.overscroll = false;

			if (this.isScrollable) {
				this.overscroll = true;
			}

			this.scrollToBottomOnMutation &&=
				this.scrollToBottom();

			this.preventWheel = !this.overscroll;
		});
	}

	get isScrollable()
	{
		return this.scrollHeight > this.offsetHeight;
	}
}

class UITableView extends UIScrollView
{
	constructor(dataSource, itemHeight, attributeFilter)
	{
		super({}, attributeFilter);

		this.dataSource = dataSource;
		this.itemHeight = itemHeight;
	}

	pushInitialBatch()
	{
		this.clear();
		this.pushNextBatch();
	}

	onScroll(e)
	{
		if (this.dataSource.canNext && this.didPassTriggerPoint) {
			this.pushNextBatch();
		}
	}

	pushNextBatch()
	{
		const batch = this.dataSource.next(this.batchSize);

		this.addSubviews(
			this.renderNextBatch(batch)
		);
	}

	renderNextBatch() {

	}

	get batchSize()
	{
		const size = (this.offsetHeight / this.itemHeight) * 2;

		if (size < 1) {
			return 15;
		}

		return size;
	}

	get didPassTriggerPoint()
	{
		return this.scrollTop > this.scrollHeight - 2 * this.offsetHeight;
	}
}

class UIInput extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			native:'input',
			import:'blur',
			attrib:'placeholder spellcheck autocomplete',
			spellcheck:'false',
			autocomplete:'off',
		});

		super(init);
	}

	onFocus()
	{
		this.dispatch({onInputFocus:this});
	}

	onKeydown(e)
	{
		const {code} = e;

		if (code == 'Enter' && !e.shiftKey) {
			return this.didSubmit(code);
		}

		if (code == 'Tab') {
			return this.dispatch({onInputTab:e});
		}

		if (code.startsWith('Arrow')) {
			return this.dispatch({onInputArrow:e});
		}
	}

	onInput(e)
	{
		this.dispatch({onInputChange:this});

		if (e.inputType == 'insertFromPaste') {
			return this.didSubmit('Paste');
		}

		if (e.inputType == 'insertFromDrop') {
			this.onDrop(e.data);
		}
	}

	onDrop(dropValue)
	{
		this.swapValue(dropValue);
		this.focus();
		this.didSubmit('Drop');
	}

	didSubmit(from)
	{
		this.value &&
			this.dispatch({onInputSubmit:from});
	}

	swapValue(s, dispatch = true)
	{
		[s, this.value] = [this.value, s];

		if (dispatch) {
			this.dispatch({onInputChange:this});
		}

		return s;
	}

	focus(andSelect)
	{
		const input = this.element;

		if (andSelect) {
			input.select();
		}
		else {
			input.setSelectionRange(1e3, 1e3);
		}

		input.focus();
	}

	clear()
	{
		this.value = '';
	}

	set value(s)
	{
		this.element.value = s;
	}

	get value()
	{
		return this.element.value.trim();
	}

	get rawValue()
	{
		return String.raw`${this.value}`;
	}
}

class UITextArea extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			native:'textarea',
			import:'focus',
			attrib:'placeholder spellcheck',
			spellcheck:'false',
		});

		super(init);
	}

	onKeydown(e)
	{
		if (e.code == 'Enter' && !e.shiftKey) {
			return this.dispatch({onInputEnter:e});
		}
	}

	onInput(e)
	{
		this.dispatch({onInputChange:this});
	}

	get value()
	{
		return string.removeWS(
			this.element.value, string.PRE_NEWLINE
		);
	}

	set value(s)
	{
		this.element.value = s;
	}

	get flush()
	{
		return UIInput.prototype.swapValue.call(this, '');
	}
}

class UIButton extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			native:'button',
			attrib:'disabled',
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
			this.sendAction('onClick');
	}
}

class UIImage extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			native:'img',
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

class UIText extends UIView {

}

class UIAnchor extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			native:'a',
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
	constructor(init = {})
	{
		UI.extend(init, {
			attrib:'state',
		});

		super(init);
	}

	get isLoading()
	{
		return (this.state == 'loading') && !this.isFadingOut;
	}

	set isLoading(bool)
	{
		if (bool) {
			return this.state = 'loading';;
		}

		this.fadeout;
	}

	get fadeout()
	{
		this.isFadingOut = true;

		UX.fadeout(this, 200, {fill:'none'}).then(_ => {
			this.isFadingOut = false;
			this.state = null;
		});
	}
}

class UIProgressInput extends UIView
{
	didInit(init)
	{
		this.input = new UIInput({
			placeholder:init.placeholder,
			superview:[this]
		});

		this.progressBar = new UIProgressBar({
			superview:[this]
		});

		this.messageText = new UIText({
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

	onEvent(name)
	{
		if (this.state == 'loading') {
			return;
		}

		if (name == 'onInputChange') {
			this.setState('initial');
		}

		if (name == 'onInputSubmit')
		{
			const [pattern, message] = this.validator;

			if (!pattern.test(this.value)) {
				return this.setState('error', message);
			}

			this.sendAction('validInput');
		}
	}
}

class UX
{
	static detach(view)
	{
		view.element.replaceWith(
			view.replacedWith = view.element.cloneNode(true)
		);

		return (view.attr.detached = true) && view;
	}

	static attach(view)
	{
		view.element.replaceWith(
			view.element.cloneNode(true)
		);

		view.replacedWith.replaceWith(
			view.element
		);

		view.attr.detached = false;
	}

	static fadein(view, duration, opt)
	{
		return this.fade(0, view, duration, opt);
	}

	static fadeout(view, duration, opt)
	{
		return this.fade(1, view, duration, opt);
	}

	static scaleIn(view, duration, opt)
	{
		return this.scale(0, view, duration, opt);
	}

	static scaleOut(view, duration, opt)
	{
		return this.scale(1, view, duration, opt);
	}

	static fromBottom(view)
	{
		const Y = this.calcDistanceToOffscreen(view);

		const frames = [
			{transform:`translateY(${Y}px)`},
			{transform:`translateY(0)`},
		];

		return this.animate(view, frames);
	}

	static toBottom(view)
	{
		const Y = this.calcDistanceToOffscreen(view);

		const frames = [
			{transform:`translateY(${Y}px)`}
		];

		return this.animate(view, frames);
	}

	static scale(out, view, duration, opt)
	{
		const frames = [
			{transform:'scale(0)'},
			{transform:'scale(1)'},
		];

		if (out) {
			frames.reverse();
		}

		return this.animate(view, frames, duration, opt);
	}

	static fade(out, view, duration, opt)
	{
		const frames = [
			{opacity:0},
			{opacity:1},
		];

		if (out) {
			frames.reverse();
		}

		return this.animate(view, frames, duration, opt);
	}

	static async animate(view, frames, duration = 200, opt = {})
	{
		opt.duration = duration;
		opt.fill ??= 'both';

		if (opt.once) {
			const id = JSON.stringify(frames);

			if (view.lastAnim == id) {
				return;
			}

			view.lastAnim = id;
		}

		return view.animate(frames, opt).finished;
	}

	static calcDistanceToOffscreen(view)
	{
		const {top, bottom, height} = view.rect;

		return height + (bottom - top) / 2;
	}
}

class ViewController extends UIResponder
{
	constructor(view)
	{
		super();

		this.view;
		this.model;
		this.parent;
		this.children = [];

		this.setView(view);
	}

	setView(view)
	{
		view.setParent(this);

		this.viewDidSet(
			this.view = view
		);
	}

	setModel(model)
	{
		model.delegate = this;

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
		this.lastChild?.viewWillAppear(sender);
	}

	viewDidAppear(sender)
	{
		this.lastChild?.viewDidAppear(sender);
	}

	viewWillDisappear(sender)
	{
		this.lastChild?.viewWillDisappear(sender);
	}

	viewDidDisappear(sender)
	{
		this.lastChild?.viewDidDisappear(sender);
	}

	addChild(child, anim = {})
	{
		if (child instanceof Function) {
			child = new child;
		}

		this.addChildToParent(child);
		this.addViewToSuper(child.view);

		if (this.isVisible)
		{
			ViewControllerLifecycleAnim(anim);

			const curr = this.nextToLastChild;
			const next = child;

			if (curr) {
				curr.viewWillDisappear();
				anim.viewWillDisappear(curr.view).then(_ =>
					curr.viewDidDisappear()
				);
			}

			next.viewWillAppear();
			anim.viewWillAppear(next.view).then(_ =>
				next.viewDidAppear()
			);
		}

		return child;
	}

	removeChild(child, anim = {})
	{
		this.removeFromParent(child);

		if (this.isVisible)
		{
			ViewControllerLifecycleAnim(anim);

			const curr = child;
			const next = this.lastChild;

			curr.viewWillDisappear();
			anim.viewWillDisappear(curr.view).then(_ => {
				curr.destruct();
				curr.viewDidDisappear();
			});

			if (next) {
				next.viewWillAppear();
				anim.viewWillAppear(next.view).then(_ =>
					next.viewDidAppear(child.constructor)
				);
			}
		}
		else {
			child.destruct();
		}
	}

	present(viewController)
	{
		this.rootController.present(viewController);
	}

	addChildToParent(child)
	{
		child.setParent(this) & this.children.push(child);
	}

	removeFromParent(child)
	{
		child.setParent(null) & array.remove(child, this.children);
	}

	addViewToSuper(view)
	{
		this.view.addSubview(view);
	}

	get rootController()
	{
		return this.parent?.rootController || this;
	}

	get leafChild()
	{
		return this.lastChild?.leafChild || this;
	}

	get lastChild()
	{
		return this.children.at(-1);
	}

	get nextToLastChild()
	{
		return this.children.at(-2);
	}

	get isVisible()
	{
		return this.view.isVisible;
	}

	destruct(isTop = true)
	{
		if (isTop) {
			this.view.destruct();
		}

		for (const child of this.children) {
			child.destruct(!isTop);
		}

		notifications.removeListener(this);
	}
}

class NavViewController extends ViewController
{
	constructor(view, viewDelegate)
	{
		super(view || new UIView, viewDelegate);
	}

	viewDidSet(view)
	{
		this.backBtn = new UIButton({
			styles:'CSNavButton CSBackButton',
			image:'UIIconArrowLeft',
			superview:[view],
			hidden:true,
			onClick:{back:this}
		});

		view.addSubview(
			new UIViewStack
		);
	}

	onEsc()
	{
		if (this.isNavigable) {
			return this.back() | 1;
		}
	}

	pushChild(child, anim)
	{
		super.addChild(child, anim);
		this.updateNavigation();

		return child;
	}

	popChild(anim)
	{
		super.removeChild(this.lastChild, anim);
		this.updateNavigation();
	}

	addViewToSuper(view)
	{
		this.view.addSubview(view, 'view-stack');
	}

	updateNavigation()
	{
		this.backBtn.hidden = this.childCount < 2;
	}

	back()
	{
		this.popChild();
	}

	get childCount()
	{
		return this.children.length;
	}

	get isNavigable()
	{
		return this.childCount > 1;
	}
}

function ViewControllerLifecycleAnim(anim)
{
	const events = {
		viewWillAppear:null,
		viewWillDisappear:null,
	};

	for (const k in events) {
		anim[k] ||= thenable;
	}
}

class DataSource extends Array
{
	constructor(items)
	{
		super(...items);
	}

	next(size)
	{
		return this.splice(0, size);
	}

	get canNext()
	{
		return this.length > 0;
	}

	static get [Symbol.species]()
	{
		return Array;
	}
}

class AppController extends NavViewController
{
	constructor()
	{
		super(
			new UIAppView(460, 56)
		);

		if (mem.user.key) {
			this.onUserAuth(true);
		}
		else {
			this.onAuthRequired();
		}

		notifications.addListener(this,
			'command userAuth windowResize contextInvalidated'
		);
	}

	viewWillAppear(sender)
	{
		this.view.setPosition();

		super.viewWillAppear(sender);
	}

	start(sender)
	{
		if (!this.didStart) {
			return this.doInitialStart(sender);
		}

		if (this.isVisible) {
			return this.viewDidAppear(sender);
		}

		this.viewWillAppear(sender);

		this.view.hide(0);

		this.viewDidAppear(sender);
	}

	close(sender)
	{
		this.viewWillDisappear(sender);

		this.view.hide(1);

		this.viewDidDisappear(sender);

		if (!this.didAuth) {
			this.onAuthRequired();
		}
	}

	present(child)
	{
		if (child.preload)
		{
			this.view.isNetworking = 1;

			child.preload(true).then(({error, data}) =>
			{
				this.view.isNetworking = 0;

				if (error) {
					return;
				}

				this.pushChild(
					new child(data.items), true
				);
			});
		}
		else {
			this.pushChild(child, true);
		}
	}

	pushChild(child, isPresentation)
	{
		while (!isPresentation && this.childCount) {
			this.popChild();
		}

		super.pushChild(child);
	}

	onCommand(c)
	{
		if ('start.tsSearch'.includes(c)) {
			return this.start(c) | 1;
		}

		if ('close.fsClose'.includes(c) && this.isVisible)
		{
			if (c == 'close') {
				return this.onEscEvent(this.leafChild.view) | 1;
			}

			if (dom.isFullscreen) {
				return this.close() | 1;
			}
		}
	}

	onAuthRequired()
	{
		this.didAuth = false;

		this.pushChild(
			new AuthView
		);
	}

	onUserAuth(didAuth)
	{
		this.pushChild(
			new SearchController(this.didAuth = didAuth)
		);
	}

	onEsc()
	{
		this.isNavigable
			? this.popChild()
			: this.close();

		return 1;
	}

	onEscEvent(responder)
	{
		responder.onEsc?.() || this.onEscEvent(responder.next);
	}

	onWindowResize()
	{
		this.view.setPosition();
	}

	onContextInvalidated(isUncaught)
	{
		if (isUncaught) {
			return this.pushChild(ErrorView);
		}

		this.destruct();
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

	didPosition(rect)
	{
		mem.pos = {
			x:rect.x,
			y:rect.y,
			w:rect.width,
			h:rect.height,
		};
	}

	doInitialStart(sender)
	{
		this.view.onStyleLoad(_ =>
			(this.didStart = 1) && this.start(sender)
		);

		dom.insertAppView(this.view);
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
		string.split('w e n ne nw we').forEach(
			s => this.addSubview(new UIResizeBar(s))
		);

		new UIButton({
			styles:'CSNavButton CSAppCloseButton',
			image:'UIIconCross',
			superview:[this],
			onClick:{close:this}
		});

		super.didInit(init);
	}

	onStyleLoad(fn)
	{
		this.querySelector('[rel=stylesheet]').onload = fn;
	}

	setPosition()
	{
		let {w, h, x, y} = this.delegate.getPosition();

		w = math.bound(w, [this.minWidth, innerWidth]);
		x = math.bound(x, [0, innerWidth - w]);
		y = math.bound(innerHeight - h, [0]);

		this.addStyle({
			top:px(y),
			left:px(x),
			width:px(w),
			minWidth:px(this.minWidth),
		});
	}

	get isVisible()
	{
		return !this.hidden;
	}

	set isNetworking(bool)
	{
		this.progressBar.isLoading = bool;
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

			this.addStyle({
				top:px(finalT),
				left:px(finalL),
				width:px(finalW),
			});
		});
	}

	onMoveStart(startX)
	{
		const startL = this.rect.left;

		this.onManipulation(
			e => this.style.left = px(startL + e.clientX - startX)
		);
	}

	onManipulation(pointerMoveFn)
	{
		dom.handleMoveEvent(pointerMoveFn).then(_ =>
			this.onManipulationEnd()
		);
	}

	onManipulationEnd()
	{
		this.isVisible && this.delegate.didPosition(this.rect);
	}

	onWheel(e)
	{
		e.preventDefault();
	}

	get progressBar()
	{
		return this.ProgressBar ||= this.addSubview(
			new UIProgressBar, 'progress-bar-wrap'
		);
	}
}

class AuthView extends NavViewController
{
	constructor()
	{
		super();

		this.pushChild(AuthMainView);
	}

	showHelpView()
	{
		this.pushChild(AuthHelpView);
	}

	onAuth(userAuth)
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
			target:[this, 'validInput:authUser'],
			validator:[/^[A-Za-z0-9_-]{32,}$/, 'invalid key'],
			superview:[view]
		});

		new UIImage({
			src:ext.file.svg.auth,
			superview:[view]
		});

		new UIAnchor({
			text:'What is Youtube API key?',
			superview:[view],
			onClick:{showHelpView:this}
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
			this.dispatch({onAuth:true});
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
			target:[this, 'didClick:skipAuth'],
			superview:[view],
			usage:view.usage,
		});
	}

	skipAuth()
	{
		this.dispatch({onAuth:false});
	}
}

class UIProgressButton extends UIButton
{
	onClick(e)
	{
		if (this.usage > 0) {
			return this.sendAction('didClick');
		}

		this.element.addEventListener('animationend', _ =>
			this.delClass('wiggle'), {once:true}
		);

		this.addClass('wiggle');
	}
}

class SearchController extends NavViewController
{
	constructor(didAuth)
	{
		super();

		this.searchView = this.pushChild(
			new SearchView(this)
		);

		this.navigate = [{
			id:'/commands',
			header:'Commands',
			detail:'Change keyboard shortcuts',
			constructor:CommandsView,
		}];

		if (didAuth) {
			this.navigate.push({
				id:'/contact',
				header:'Contact',
				detail:'Send Feedback / Report an issue',
				constructor:ContactView,
			});
		}

		this.didAuth = didAuth;
	}

	viewWillAppear(sender)
	{
		this.recontext();

		this.searchView.onUpdates(
			mem.updates.some(item => item.new)
		);

		super.viewWillAppear(sender);
	}

	viewDidAppear(sender)
	{
		notifications.addListener(this, 'urlChange');

		super.viewDidAppear(sender);
	}

	viewDidDisappear(sender)
	{
		notifications.removeListener(this, 'urlChange');

		super.viewDidDisappear(sender);
	}

	onUrlChange()
	{
		if (this.didAuth) {
			this.recontext();
		}
	}

	onInputFocus()
	{
		this.recontext();
	}

	onInputChange()
	{
		this.warmup();
	}

	onSearchRequest(q)
	{
		const appView = this.navigate.find(view => view.id == q);

		if (appView) {
			return this.present(appView.constructor);
		}

		if (!this.videoId) {
			return this.onError('errNotWatchPage');
		}

		return this.model.commentSearch(q) | 1;
	}

	onContextLoad(context)
	{
		this.searchView.onContextLoad(context);
	}

	onResults(threads)
	{
		this.searchView.onResults(threads);
	}

	onReplies(replies)
	{
		this.repliesView.onReplies(replies);
	}

	onError(id)
	{
		this.lastChild.onError(id);
	}

	onTimeout()
	{
		this.didTimeout = true;
	}

	getSuggestions(q)
	{
		if (q[0] != '/') {
			return [];
		}

		const items = this.navigate.filter(
			item => item.id.startsWith(q)
		);

		items.forEach(
			item => item.constructor.preload?.()
		);

		return items;
	}

	getReplies(topComment)
	{
		this.model.commentReplies(
			TopComment.from(topComment)
		);

		this.showRepliesView(topComment);
	}

	showRepliesView(topComment)
	{
		const child = new RepliesView(
			UX.detach(topComment)
		);

		this.pushChild(child, {
			viewWillAppear:view => UX.fadein(view, 150),
			viewWillDisappear:view => UX.fadeout(view, 150),
		});

		this.repliesView = child;
	}

	exitRepliesView()
	{
		UX.attach(this.repliesView.topComment);

		this.popChild({
			viewWillAppear:view => UX.fadein(view, 150),
			viewWillDisappear:view => UX.fadeout(view, 150),
		});

		this.repliesView = this.model.abort();
	}

	recontext()
	{
		const newId = (this.videoId != YT.videoId) && (this.videoId = YT.videoId);

		if (newId)
		{
			this.model?.disconnect();

			this.setModel(
				new SearchModel(newId)
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

	back()
	{
		this.exitRepliesView();
	}

	destruct()
	{
		this.model?.disconnect();

		super.destruct();
	}
}

class SearchModel extends MasterPort
{
	commentSearch(q)
	{
		this.postMessage({commentSearch:q});
	}

	commentReplies(topComment)
	{
		this.postMessage({commentReplies:topComment});
	}

	abort()
	{
		if (this.didDisconnect) {
			return;
		}

		this.postMessage({abort:null});
	}

	onContextLoad(context)
	{
		this.delegate.onContextLoad(context);
	}

	onCommentSearch({threads})
	{
		this.delegate.onResults(threads);
	}

	onCommentReplies({thread})
	{
		this.delegate.onReplies(thread);
	}

	onError(id)
	{
		this.delegate.onError(id);
	}

	postMessage(message)
	{
		this.aborted = void super.postMessage(message);
	}

	onPortMessage(message)
	{
		if (!this.aborted) {
			super.onPortMessage(message);
		}
	}

	onDisconnect()
	{
		super.onDisconnect();

		this.delegate.onTimeout();
	}
}

class UIMessageView extends UIView
{
	constructor(messages)
	{
		super({native:'message-view'});

		this.messages = {
			errNetwork:'No Internet Connection',
			errParsing:'Invalid response from server',
			errUnknown:'An unexpected error occured',
		};

		this.addMessages(messages);
	}

	addMessages(added)
	{
		assign(this.messages, added);
	}

	showMessage(id)
	{
		id = String(id);

		this.setMessage(
			this.messages[id] || string.grep(/^\w+$/, id) || this.messages.errUnknown
		);
	}

	setMessage(...args)
	{
		this.clear();

		for (const _ of args)
		{
			this.addSubview(
				is.string(_) ? new UIText({text:_}) : _
			);
		}
	}
}

class SearchView extends ViewController
{
	constructor(delegate)
	{
		super(
			new UISearchView
		);

		this.delegate = delegate;

		notifications.addListener(this, 'command');
	}

	viewDidAppear(sender)
	{
		if (sender == 'tsSearch') {
			this.searchCurrentTime();
		}

		if (sender == RepliesView) {
			this.view.focusResults();
		}
		else {
			this.view.focusInput(sender == 'start');
		}
	}

	viewDidDisappear()
	{
		this.view.didDisappear();
	}

	searchCurrentTime()
	{
		this.view.onAutoSubmit(
			time.int2hms(YT.player.currentTime)
		);
	}

	getSuggestions(q)
	{
		return this.delegate.getSuggestions(q);
	}

	onSearchRequest(value)
	{
		return this.delegate.onSearchRequest(value);
	}

	onCommentCountClick()
	{
		this.present(FeaturesView);
	}

	onBellIconClick()
	{
		this.present(UpdatesView);
	}

	onUpdates(newUpdates)
	{
		this.view.onUpdates(newUpdates);
	}

	onResults(threads)
	{
		this.view.onResults(threads);
	}

	onContextLoad(context)
	{
		this.view.onContextLoad(context);
	}

	onError(id)
	{
		this.view.onError(id);
	}

	onCommand(c)
	{
		if (c == 'highlight' && this.isVisible) {
			return this.view.toggleHighlighting(true) | 1;
		}
	}
}

class UISearchView extends UIView
{
	constructor()
	{
		super({native:'search'});
	}

	didInit(init)
	{
		this.append({header:null});

		this.searchInput = new UIInput({
			placeholder:'type keywords here..',
			superview:[this, 'header']
		});

		this.searchIcons = new UISearchIcons({
			superview:[this, 'header']
		});

		this.commentCount = new UICommentCount({
			styles:'CSCommentCount',
			disabled:true,
			superview:[this, 'header'],
			onClick:{onCommentCountClick:this}
		});

		this.progressBar = new UIProgressBar({
			superview:[this, 'header']
		});

		this.contentView = new UIViewStack({
			subviews:[
				this.resultsView = new UISearchResults,
				this.messageView = new UISearchMessage,
			],
			superview:[this]
		});

		this.suggestView = new UISuggestView({
			superview:[this]
		});

		super.didInit(init);
	}

	onAutoSubmit(value)
	{
		this.onSubmit(
			this.searchInput.value = value
		);
	}

	onInputSubmit(from, {rawValue})
	{
		if (from == 'Enter' && (tmp = this.suggestView.selectedItem)) {
			return this.onSuggestionSelect(tmp);
		}

		if (from == 'Paste' && this.inFindMode) {
			return;
		}

		this.onSubmit(rawValue)
	}

	onInputChange({value})
	{
		this.resultsView.textToHighlight = value;

		this.commentCount.toggleTempState(
			this.isGlobalMode(value) && 'global'
		);

		this.suggestView.render(
			this.delegate.getSuggestions(value)
		);

		this.dispatch({onInputChange:value});
	}

	onInputArrow(e)
	{
		const dir = UI.Event.ArrowDir(e);

		if (dir && this.isSuggesting) {
			return e.preventDefault() & this.suggestView.onArrow(dir);
		}

		if (dir == 1 && this.isResults) {
			return e.preventDefault() & this.focusResults(dir);
		}
	}

	onInputTab(e)
	{
		if (this.isSuggesting) {
			return e.preventDefault() & this.suggestView.onTab();
		}

		if (this.isResults) {
			return e.preventDefault() & this.focusResults();
		}
	}

	onSuggestionSelect({id})
	{
		this.onAutoSubmit(id);
		this.suggestView.clear();
		this.searchInput.clear();
	}

	onSubmit(value)
	{
		this.isNetworking = this.delegate.onSearchRequest(value);
	}

	onEyeIconClick()
	{
		this.toggleHighlighting();
	}

	onUpdates(newUpdates)
	{
		if (newUpdates) {
			this.searchIcons.show({Bell:1e3});
		}
		else {
			this.searchIcons.hide({Bell:400});
		}
	}

	onResults(threads)
	{
		if (threads.length) {
			return this.showResults(threads);
		}

		this.showMessage('emptyResult');
	}

	onContextLoad({maxCount, cachable})
	{
		this.maxCount = maxCount;

		const n = match(maxCount,
			[CommentCount.Non, 'zero'],
			[CommentCount.Off, 'off'],
		);

		this.commentCount.value = [n, !cachable];
	}

	onError(id)
	{
		this.showMessage(id);
	}

	onEsc()
	{
		if (this.inFindMode) {
			return this.toggleHighlighting(true) | 1;
		}

		if (this.isSuggesting) {
			return this.suggestView.clear() | 1;
		}
	}

	showMessage(id)
	{
		const messageView = this.messageView;

		if (id == 'emptyResult') {
			messageView.onEmptyResult(this);
		}
		else {
			messageView.showMessage(id);
		}

		this.showView(messageView);
	}

	showResults(threads)
	{
		this.resultsView.setDataSource(threads);
		this.showView(this.resultsView);
	}

	showView(view)
	{
		this.isNetworking = 0;
		this.contentView.segue(view);
	}

	getAllComments()
	{
		this.onAutoSubmit(':all');
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

	focusInput(andSelect)
	{
		this.searchInput.focus(andSelect);
	}

	focusResults(andScroll)
	{
		this.resultsView.focus(andScroll);
	}

	didDisappear()
	{
		this.searchInput.blur();
		this.messageView.clear();
		this.resultsView.didDisappear();
	}

	isGlobalMode(s)
	{
		return this.globalMode = s.startsWith('global:');
	}

	get inFindMode()
	{
		return this.searchIcons.get({Eye:false})?.active;
	}

	get isSuggesting()
	{
		return this.suggestView.isVisible;
	}

	get isResults()
	{
		return this.resultsView.isVisible;
	}

	get isNetworking()
	{
		return this.progressBar.isLoading;
	}

	set isNetworking(bool)
	{
		this.progressBar.isLoading = bool;

		if (bool) {
			this.contentView.preSegueIfNot(this.messageView);
		}
	}
}

class UISearchIcons extends UIView
{
	get(idRender)
	{
		const [id, render] = unpack(idRender);

		if (this[id]) {
			return this[id];
		}

		if (render) {
			return this.show({[id]:0});
		}
	}

	show(idDelay)
	{
		const [id, delay] = unpack(idDelay);

		this.animate(
			this[id] ?? this.render(id), delay
		);

		return this[id];
	}

	hide(idDelay)
	{
		const [id, delay] = unpack(idDelay);

		if (this[id]) {
			this.animate(this[id], delay, 1);
		}
	}

	render(id)
	{
		return this[id] = this.renderIcon(id);
	}

	renderIcon(id)
	{
		const init = {
			styles:'CSSearchHeaderIcon',
			image:`UIIcon${id}`,
			superview:[this],
			onClick:{[`on${id}IconClick`]:this},
		};

		return (id == 'Eye')
			? new UIToggle(init)
			: new UIButton(init);
	}

	animate(icon, delay, out)
	{
		UX.scale(out, icon, 200, {delay, once:true});
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

		UX.fadeout(this.ticker, 240).then(anim => {
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

class UISearchResults extends UITableView
{
	constructor()
	{
		super(null, 78, ['trim']);
	}

	didDisappear()
	{
		this.inlinePlayer?.pause();
	}

	setDataSource(threads)
	{
		this.dataSource = new DataSource(threads);
		this.pushInitialBatch();
	}

	embedVideo(sender, {videoId, startAt})
	{
		const player = this.inlinePlayer ||= new UIEmbeddedPlayer;

		if (tmp = player.superview != sender) {
			sender.addSubview(player);
		}

		player.load(videoId, startAt, tmp);
	}

	setVideoTime(sender, data)
	{
		YT.playerSetCurrentTime(data.startAt);
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
		return threads.map(thread =>
		{
			this.addChains(thread);

			const threadView = new UIView({
				styles:'CSThread'
			});

			for (const struct of thread)
			{
				const view = new UIComment(struct);

				math.inRange(struct.replyCount, [thread.length, 100]) &&
					view.renderReplyCount();

				threadView.addSubview(view);
			}

			return threadView;
		});
	}

	addChains(thread)
	{
		thread.forEach((item, i, prev) =>
		{
			item.trim = !item.isUploader;

			if (!item.parentId) {
				return;
			}

			while (prev = thread[--i])
			{
				prev.isChained = true;

				if (prev.id == item.parentId) {
					return;
				}
			}
		});
	}

	addSubviews(views)
	{
		super.addSubviews(views);

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

	clear()
	{
		this.inlinePlayer = null;

		super.clear();
	}
}

class UISearchMessage extends UIMessageView
{
	constructor()
	{
		super({
			emptyResult:		'No results match your query',
			errNotWatchPage:	'You are not watching any video',
			errEmptyQuery:		'Empty search query',
			errInvalidRegex:	'Invalid RegExp',
			errNoComments:		'No comments to search',
			errCommentsOff:		'Comments are turned off',
			errLimitedFeature:	'Feature not available for this video',
		});
	}

	onEmptyResult({maxCount:p, globalMode})
	{
		if (p > 150 || globalMode) {
			return this.showMessage('emptyResult');
		}

		if (p < 1) {
			return this.showMessage(match(p,
				[CommentCount.Non, 'errNoComments'],
				[CommentCount.Off, 'errCommentsOff'],
			));
		}

		if (p <= 150) {
			this.setMessage('Nothing found in ',
				new UIAnchor({text:`${p} comments`, onClick:{getAllComments:this}}
			));
		}
	}
}

class UISuggestView extends UIView
{
	render(items)
	{
		this.clear();

		for (const item of items)
		{
			const view = new UIView({
				source:'UISuggestItem',
				attrib:'selected',
				onClick:{didSubmit:this},
				onMousemove:{onItemHover:this},
				...item
			});

			this.addSubview(view);
		}

		if (items.length) {
			this.selectFirstItem();
		}
	}

	clear()
	{
		this.selected = null;

		super.clear();
	}

	onArrow(dir)
	{
		this.selectNextItem(dir);
	}

	onTab()
	{
		this.selectNextItem(1);

		if (this.itemCount == 1) {
			this.didSubmit();
		}
	}

	onItemHover(sender)
	{
		this.selected = sender;
	}

	onMouseleave(e)
	{
		this.selected = null;
	}

	get itemCount()
	{
		return this.subviews.length;
	}

	get isVisible()
	{
		return this.itemCount > 0;
	}

	selectFirstItem()
	{
		this.selected = this.itemAt(0);
	}

	selectNextItem(dir)
	{
		this.selected = this.itemAt(
			this.subviews.indexOf(this.selected) + dir
		);
	}

	itemAt(i)
	{
		return this.subviews[
			math.wrap(i, [0, this.itemCount - 1])
		];
	}

	didSubmit()
	{
		this.dispatch({
			onSuggestionSelect:this.selected
		});
	}

	set selected(view)
	{
		const curr = this.selectedItem;

		if (curr == view) {
			return;
		}

		if (curr) {
			curr.selected = false;
		}

		if (!view) {
			return this.selectedItem = null;
		}

		(this.selectedItem = view).selected = true;
	}

	get selected()
	{
		return this.selectedItem;
	}
}

class UIComment extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			attrib:'isReply isChained isUploader',
		});

		super(init);
	}

	didInit(init)
	{
		this.renderImageView(init);
		this.renderTextView(init);

		super.didInit(init);
	}

	untrim(textView)
	{
		textView.trim = false;
	}

	renderImageView({authorImgUrl, isReply})
	{
		const largeUrl = authorImgUrl.replace(
			/=s\d+/, string.format('=s%s', isReply ? 48 : 80)
		);

		new UIImage({
			src:largeUrl,
			alterSrc:authorImgUrl,
			superview:[this, 'side > a'],
		});
	}

	renderTextView({structured, displayText, locale, trim})
	{
		const textView = new UIText({
			attrib:'lang dir trim',
			superview:[this],
			trim,
			...locale,
			onClick:{untrim:this},
		});

		const items = object.from(structured, 'id');

		string.tokenSplit(displayText, keys(items)).forEach(s =>
		{
			if (s in items) {
				return textView.addSubview(
					this.createAnchor(items[s])
				);
			}

			textView.append({s});
		});
	}

	renderReplyCount()
	{
		new UIView({
			native:'reply-count',
			text:this.replyCount,
			superview:[this, 'side'],
			onClick:{getReplies:this}
		});
	}

	createAnchor(x)
	{
		if (x.type == 'TimeTag') {
			x.onClick = {setVideoTime:this};
		}

		if (x.type == 'EmbedLink') {
			x.onClick = {embedVideo:this};
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
			attrib:'src allowfullscreen',
			allowfullscreen:true
		});
	}

	onLoad()
	{
		const fn = _ => {
			const player = this.contentDocument.querySelector('video');

			player?.addEventListener('pause',
				_ => window.focus()
			);

			return this.player = player;
		};

		throttle.retry(fn, [50, 20]);
	}

	load(videoId, startAt, didMove)
	{
		const newVid = this.videoId != videoId;

		if (newVid || didMove) {
			this.catchReadyState();
		}

		if (newVid) {
			this.src = string.format(
				'https://www.youtube.com/embed/%s?autoplay=1&start=%s', [videoId, startAt]
			);

			this.videoId = videoId;
		}
		else {
			this.play(startAt);
		}
	}

	play(startAt)
	{
		const player = this.player;

		if (!player) {
			return;
		}

		if (startAt >= 0) {
			player.currentTime = startAt
		}

		return player.play();
	}

	pause()
	{
		this.player?.pause();
	}

	catchReadyState()
	{
		const fn = _ => {
			const doc = this.contentDocument;

			if (doc?.body && doc.location.host) {
				return this.declutter(doc) | 1;
			}
		};

		throttle.retry(fn, [50, 20]);
	}

	declutter(doc)
	{
		const s = document.createElement('style');

		s.textContent = `
			[class^=ytp-tooltip],
			.ytp-chrome-top,
			.ytp-contextmenu,
			.ytp-gradient-top,
			.ytp-pause-overlay,
			.ytp-player-content,
			.ytp-impression-link,
			.ytp-subtitles-button,
			.ytp-fullscreen-button {
				display:none !important;
			}
		`;

		doc.documentElement.appendChild(s);
	}
}

class RepliesView extends ViewController
{
	constructor(topComment)
	{
		super(
			new UIRepliesView(topComment)
		);

		this.topComment = topComment;
		this.didAppear = new PendingPromise;
	}

	viewDidAppear()
	{
		setTimeout(_ =>
			this.didAppear.resolve(true), 100
		);
	}

	onReplies(replies)
	{
		this.didAppear.then(_ =>
			this.view.onReplies(replies)
		);
	}

	onError(id)
	{
		this.didAppear.then(_ =>
			this.view.onError(id)
		);
	}
}

class UIRepliesView extends UIView
{
	constructor(topComment)
	{
		super({native:'replies', topComment});
	}

	didInit({topComment})
	{
		this.append({header:'Replies'});

		this.appendChild(topComment).onwheel =
			this.forwardScrollEvent.bind(this);

		this.contentView = new UIViewStack({
			subviews:[
				this.repliesView = new UIRepliesFeed,
				this.messageView = new UIMessageView,
			],
			superview:[this]
		});

		this.messageView.addMessages({
			errFiltered:'No replies to display'
		});
	}

	onReplies(replies)
	{
		this.repliesView.setDataSource(replies);
		this.contentView.segue(this.repliesView);
		this.repliesView.focus();
	}

	onError(id)
	{
		this.messageView.showMessage(id);
		this.contentView.segue(this.messageView);
	}

	forwardScrollEvent({deltaY})
	{
		const isTouch = !is.int(deltaY);

		if (isTouch) {
			return this.repliesView.scrollTop += deltaY;
		}

		this.repliesView.scroll(
			Math.sign(deltaY), 60
		);
	}

	destruct()
	{
		this.topComment.element.onwheel = null;

		super.destruct();
	}
}

class UIRepliesFeed extends UISearchResults
{
	setDataSource(replies)
	{
		this.addChains(
			this.dataSource = new DataSource(replies)
		);

		this.pushInitialBatch();
	}

	renderNextBatch(arr)
	{
		return arr.map(
			struct => new UIComment(struct)
		);
	}
}

class UpdatesView extends ViewController
{
	constructor()
	{
		const views = {
			changelog: {
				header:'Version Update',
				detail:'Review changes in the latest release',
				constructor:ChangelogView,
			},
			message: {
				header:'Message',
				detail:'You have received a new message',
				constructor:ContactView,
			}
		};

		const items = structuredClone(mem.updates).map(item =>
		{
			views[item.type].constructor.preload?.();

			return assign(
				{data: new UIData(item)}, views[item.type]
			);
		});

		super(
			new UIUpdatesView(items)
		);

		items.forEach(
			item => item.data.addListener(this)
		);
	}

	onDataChange({id, ...change})
	{
		assign(
			mem.updates.find(item => item.id == id), change
		);
	}

	onItemClick(item)
	{
		this.present(item.constructor);
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
		for (const item of init.items)
		{
			this.addSubview(
				new UIUpdate(item)
			);
		}
	}
}

class UIUpdate extends UIView
{
	constructor(init)
	{
		UI.extend(init, {
			attrib:'new'
		});

		super(init);
	}

	onClick(e)
	{
		this.new = false;
		this.dispatch({onItemClick:this});
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
			new UICommandsView(items)
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
			const release = (data.id != id) && array.isEqual(data.keys, keys);

			if (release) {
				data.keys = [];
			}

			c[data.id] = data.keys;
		}

		mem.commands = c;
	}

	onEdit(bool)
	{
		notifications.send({commandEdit:bool});
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
		for (const item of init.items)
		{
			this.addSubview(
				new UICommand(item)
			);
		}

		super.didInit(init);
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
				superview:[this],
			}
		);

		super.didInit(item);
	}

	onFocusin(e)
	{
		this.input.keys = [];
		this.dispatch({onEdit:true});
	}

	onFocusout(e)
	{
		this.error.textContent = '';
		this.dispatch({onEdit:false});
	}

	onInputReject(reason)
	{
		this.error.textContent = reason;
	}
}

class UICommandInput extends UIInput
{
	constructor(data, accept = {}, reject = {}, init)
	{
		super({data, accept, reject, ...init});
	}

	onKeydown(e)
	{
		e.preventDefault() & this.validate(e, e);
	}

	validate({key, code}, e)
	{
		let keys = [];

		if (['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
			return;
		}

		if (this.reject[code]) {
			return this.error(this.reject[code]);
		}

		if (code == 'Escape' && !this.accept.Escape) {
			return this.blur();
		}

		if (!this.accept[code])
		{
			keys = ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].filter(k => e[k]);

			if (keys.length == 0) {
				return this.error('Must start with Ctrl/Alt/Shift');
			}
		}

		keys.push(code) & (this.keys = keys) & this.blur();
	}

	error(s)
	{
		this.superview.onInputReject(s);
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

class ContactView extends ViewController
{
	constructor(messages)
	{
		super(
			new UIContactView(messages)
		);
	}

	postMessage(text)
	{
		app.postUserMessage(text);
	}

	static preload(realize)
	{
		return app.preempt('getUserMessages', realize);
	}
}

class UIContactMessage extends UIView
{
	constructor(init)
	{
		init.body = pop({text:init});
		init.time = time.fromUnix(init.time);

		UI.extend(init, {
			attrib:'isUser',
		});

		super(init);
	}
}

class UIContactView extends UIView
{
	constructor(messages)
	{
		super({
			styles:'CSBasicView CSContact',
			messages,
		});
	}

	didInit(init)
	{
		this.append({title:'Contact'});

		[this.content, this.footer] = this.addSubviews([
			new UIView({native:'content'}),
			new UIView({native:'footer'}),
		]);

		if (init.messages.length) {
			this.renderNormal(init.messages);
		}
		else {
			this.renderPhased();
		}

		super.didInit(init);
	}

	renderPhased()
	{
		const view = new UIView({styles:'CSIntro'});

		view.append({h1:"Let's Talk"});
		view.append({h2:"Send your feedback, questions or report an issue!"});

		new UIImage({
			src:ext.file.svg.code,
			superview:[view]
		});

		new UIButton({
			styles:'CSPillButton',
			text:'Send Message',
			superview:[this.footer],
			onClick:{beginTransition:this}
		});

		this.intro = this.content.addSubview(view);
	}

	renderNormal(messages)
	{
		this.renderScrollFeed().then(_ =>
			this.renderMessages(messages)
		);

		this.renderInput();
	}

	renderMessages(items)
	{
		this.feed.scrollToBottomOnMutation = true;

		for (let item of items)
		{
			UX.fadein(
				item = new UIContactMessage(item)
			);

			this.feed.addSubview(item);
		}
	}

	async renderInput(animate)
	{
		this.input = new UITextArea({
			placeholder:'Enter to send',
			superview:[this.footer],
		});

		if (animate) {
			await UX.fromBottom(this.input);
		}

		setTimeout(_ =>
			this.input.focus()
		);
	}

	async renderScrollFeed()
	{
		const intro = this.intro;

		if (intro) {
			await UX.fadeout(intro).then(_ =>
				intro.destruct()
			);
		}

		this.feed = this.content.addSubview(
			new UIScrollView
		);
	}

	async didSubmit()
	{
		const text = this.input.flush;

		if (!this.feed) {
			await this.renderScrollFeed();
		}

		this.renderMessages([{
			text,
			time:time.now(),
			isUser:true
		}]);

		this.delegate.postMessage(text);
	}

	beginTransition(sender)
	{
		UX.toBottom(sender).then(_ =>
			sender.destruct() & this.renderInput(true)
		);
	}

	onInputEnter(e)
	{
		e.preventDefault();

		if (this.input.value) {
			this.didSubmit();
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
		this.doc = document.documentElement;

		if (location.pathname.startsWith('/embed/')) {
			this.setAttribute('dark', true);
		}

		this.setAttribute('cs-app-context', true);

		new MutationObserver(
			this.onMutation.bind(this)
		)
		.observe(
			this.doc, {attributes:true}
		);

		notifications.addListener(this, 'fullscreenChange');
	}

	insertAppView(view)
	{
		this.doc.appendChild(view.element);
	}

	handleMoveEvent(pointerMoveFn)
	{
		return new Promise(resolve =>
		{
			window.onpointermove = pointerMoveFn;

			window.onpointerup = _ =>
			{
				this.doc.classList.remove('CSOnMove');

				resolve(
					window.onpointermove = onpointerup = null
				);
			};

			this.doc.classList.add('CSOnMove');
		});
	}

	onFullscreenChange()
	{
		this.setAttribute('fullscreen', this.isFullscreen);
	}

	get isFullscreen()
	{
		return !!document.fullscreenElement;
	}

	setAttribute(k, v)
	{
		if (v) {
			this.doc.setAttribute(k, v === true ? '' : v);
		}
		else {
			this.doc.removeAttribute(k);
		}
	}

	onMutation(_, observer)
	{
		if (app.contextInvalidated) {
			notifications.contextInvalidated() & observer.disconnect();
		}
	}
}

class Shortcuts
{
	constructor(commands)
	{
		this.interpret(commands);

		notifications.addListener(this,
			'windowKeydown commandsDataChange'
		);
	}

	onWindowKeydown(e)
	{
		const command = this.map[this.generateId(e)];

		if (command) {
			notifications.send({command}) &&
				e.preventDefault() & e.stopPropagation();
		}
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
}

class YT
{
	static get videoId()
	{
		return string.grep(/\b(?:live|shorts|embed|v)[\/=]([\w-]{11})\b/, location.href);
	}

	static playerSetCurrentTime(n, player = this.player)
	{
		player.currentTime = n;

		player.paused &&
			player.play();
	}

	static get player()
	{
		return document.querySelector('video[src]')
			|| document.createElement('video');
	}
}

class AppEvents
{
	constructor()
	{
		this.signal = [];

		const events = [{
			name:'windowResize',
			type:'resize',
			scope:window,
		},{
			name:'windowKeydown',
			type:'keydown',
			scope:window,
		},{
			name:'urlChange',
			type:'currententrychange',
			scope:navigation,
		},{
			name:'fullscreenChange',
			type:'fullscreenchange',
			scope:document,
		}];

		for (const {name, type, scope} of events)
		{
			const abort = new AbortController;

			scope.addEventListener(
				type,
				this.onEvent.bind(this, name), {
					capture:true,
					signal:abort.signal
				}
			);

			this.signal.push(abort);
		}

		notifications.addListener(this,
			'commandEdit contextInvalidated'
		);
	}

	onCommandEdit(bool)
	{
		this.ignore = bool && 'windowKeydown';
	}

	onContextInvalidated()
	{
		for (const signal of this.signal) {
			signal.abort();
		}
	}

	onEvent(name, e)
	{
		if (this.ignore == name) {
			return;
		}

		notifications.send({[name]:e});
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
		this.preload = {};

		string.split('error unhandledrejection').forEach(
			event => addEventListener(event, this.onUncaughtError.bind(this))
		);
	}

	onReady()
	{
		new AppEvents;

		this.sendMessage({clientLoad:null}).then(html =>
		{
			UI.construct(html);

			self.dom = new UIDocument;

			new AppController;
		});

		new Shortcuts(mem.commands);
	}

	preempt(id, realize)
	{
		this.preload[id] ??= this[id]();

		if (realize) {
			return pop({[id]:this.preload});
		}
	}

	authUser(apiKey)
	{
		return this.sendMessage({userAuth:apiKey});
	}

	getUserMessages()
	{
		return this.sendMessage({getUserMessages:null});
	}

	postUserMessage(text)
	{
		return this.sendMessage({postUserMessage:text});
	}

	onActivate()
	{
		notifications.send({command:'start'});
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