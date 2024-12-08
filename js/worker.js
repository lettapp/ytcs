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

class Cloneable
{
	static clone(x)
	{
		const proto = Object.getPrototypeOf(x);
		const props = Object.getOwnPropertyDescriptors(x);
		const clone = Object.create(proto, props);

		for (const i in clone) {
			clone[i] = this.probe(clone[i]);
		}

		return clone;
	}

	static probe(x)
	{
		if (x instanceof Cloneable) {
			return this.clone(x);
		}

		if ([Array, Object].includes(x?.constructor)) {
			return this.clone(x);
		}

		return x;
	}
}

class LazyMap extends Map
{
	constructor(defaultValue)
	{
		super();

		this.defaultValue = defaultValue;
	}

	get(k)
	{
		const isNull = !this.has(k);

		if (isNull) {
			this.set(k, this.default);
		}

		return super.get(k);
	}

	push(v)
	{
		this.set(this.size, v);
	}

	get keys()
	{
		return [...super.keys()];
	}

	get values()
	{
		return [...super.values()];
	}

	get default()
	{
		return structuredClone(this.defaultValue);
	}
}

class StructuredItem
{
	constructor()
	{
		this.id = math.randint(6, true);

		this.text = '';
		this.type = this.constructor.name;
	}
}

class EmbedLink extends StructuredItem
{
	constructor(videoId, startAt, asHms)
	{
		super();

		this.videoId = videoId;
		this.startAt = startAt;

		if (asHms) {
			this.text = time.int2hms(startAt);
		}
		else {
			this.text = 'youtube.com';
		}
	}
}

class TimeTag extends EmbedLink
{
	constructor(videoId, startAt)
	{
		super(videoId, startAt, true);
	}
}

class Hashtag extends StructuredItem
{
	constructor(text)
	{
		super();

		this.text = text;
		this.href = 'https://www.youtube.com/hashtag/' + text.replace('#', '');
	}
}

class ChannelLink extends StructuredItem
{
	constructor(channelName, channelId)
	{
		super();

		this.text = channelName;
		this.href = 'https://www.youtube.com/channel/' + channelId;
	}
}

class WebLink extends StructuredItem
{
	constructor(URL)
	{
		super();

		this.text = URL.host.replace('www.', '');
		this.href = URL.href;
	}
}

class ParsedString
{
	constructor(str)
	{
		this.string			= '';
		this.sample			= '';
		this.nonAlphanum	= [];
		this.hasUnicode		= false;

		this.normalize(str);
		this.parse();
		this.parseUnicode();
	}

	get output()
	{
		return this.string;
	}

	get isUpperCase()
	{
		return string.isUpperCase(this.sample);
	}

	hasChars(abc)
	{
		return [...abc].some(
			c => this.nonAlphanum.includes(c)
		);
	}

	replace(find, callback)
	{
		this.string = this.string.replace(find, callback);
	}

	toLowerCase()
	{
		this.string = this.string.toLowerCase();
	}

	normalize(str)
	{
		this.string = string.removeWS(str, string.PRE_NEWLINE);

		this.replaceMulti([
			['`´‘’׳', '\''],
			['״“”„', '"'],
			['…', '...'],
		]);

		this.replace(/(.)\1+/gu, s =>
		{
			const [c] = [...s];

			if (c == '.') {
				return '..';
			}

			if (string.isAlphanum(c)) {
				return string.isLetter(c) && (s.length > c.length * 3) ? c.repeat(3) : s;
			}

			return c;
		});
	}

	parse()
	{
		const chars = array.unique([...this.string]).join('');

		this.sample = chars.slice(0, 16);

		this.nonAlphanum = string.match(/[^\p{L}\p{N}]/gu, chars);

		this.hasUnicode = this.nonAlphanum.some(string.isUnicode);
	}

	parseUnicode()
	{
		if (!this.hasUnicode) {
			return;
		}

		this.nonAlphanum.sort((b, a) =>
		{
			const s = a + b;

			this.replace(
				regex.create('/(%s)+/g', s), s
			);
		});
	}

	replaceMulti(set)
	{
		const o = {};

		set.forEach(
			([k, v]) => [...k].forEach(k => o[k] = v)
		);

		this.replace(
			regex.create('/[%s]/g', keys(o).join('')), k => o[k]
		);
	}

	toString()
	{
		return this.string;
	}
}

class nlp
{
	static normalize(s)
	{
		const locale = this.locale(
			s = s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ' ').replace(/\s+/g, ' ').trim()
		);

		const tokens = string.split(
			s = this.standardize(s, locale.lang)
		);

		return {
			string:s, locale, tokens, empty:!s
		};
	}

	static locale(s)
	{
		const min = .49 * string.tokenCount(s);

		switch (true)
		{
			case min < string.count(/[a-z]+/g, s):
				return {lang:'en', dir:'ltr'};

			case min < string.count(/[ء-ي]+/g, s):
				return {lang:'ar', dir:'rtl'};

			case min < string.count(/[א-ת]+/g, s):
				return {lang:'he', dir:'rtl'};

			default:
				return {lang:'na', dir:'ltr'};
		}
	}

	static standardize(s, lang)
	{
		if (lang == 'en') {
			return s.replace(/([a-z]{3,})(ing|ed|e?s)\b/g, '$1');
		}

		return s;
	}
}

class formatter
{
	static formatText(str)
	{
		str = new ParsedString(str);

		str.isUpperCase && str.toLowerCase();

		if (str.hasChars('.'))
		{
			str.replace(/([a-z]\.){2,}/gi, m => m.replace(/\./g, ''));

			str.replace(/([^.])\.$/, '$1');
		}

		str.replace(/\n/g,
			(_, i, s) => string.isLetter(s[--i]) ? '. ' : ' '
		);

		if (str.hasChars('(,!?.)'))
		{
			str.replace(/[?!]{2,}/, '?!');

			str.replace(/ ([!?),.])/g, '$1');

			str.replace(/([)!?,.])(\p{L})/gu, '$1 $2');

			str.replace(/([?!])[,.]+/g, '$1');
		}

		str.hasChars('*_') && str.replace(/[*_]+(.+?)[_*]+/g, '$1');

		str.hasChars(':') && str.replace(/ : /g, ': ');

		str.hasChars('&') && str.replace(/ & /g, ' and ');

		return str.output;
	}
}

class helper
{
	static getWatchDetails(url)
	{
		const videoId = string.grep(/youtu[be.com]{3,6}.*?[\/=]([\w-]{11})\b/, url);

		const startAt = time.hms2int(
			string.grep(/[?&](?:time_continue|t|start)=([\dms]+)/, url)
		);

		return {videoId, startAt};
	}
}

class tabs
{
	static execContentScript()
	{
		const files = chrome.runtime.getManifest().content_scripts[0];

		this.getAccessible().then(tabs =>
		{
			for (const tab of tabs)
			{
				chrome.scripting.executeScript({
					target: {
						tabId: tab.id
					},
					files: files.js
				});
			}
		});
	}

	static getAccessible()
	{
		return chrome.tabs.query({}).then(
			tabs => tabs.filter(tab => tab.url)
		);
	}
}

class http
{
	static get(url, params, opts = {})
	{
		if (params) {
			url = this.addUrlParams(url, params);
		}

		return this.withCacheControl(url, opts);
	}

	static post(url, params)
	{
		const body = new FormData;

		entries(params).forEach(
			([k, v]) => body.append(k, v)
		);

		return this.send(url, {method:'POST', body});
	}

	static async send(url, opts)
	{
		const r = await fetch(url, opts).catch(none);

		if (r)
		{
			r.data = await r.text();

			try {
				r.data = JSON.parse(r.data);
			}
			catch {
			}

			return r;
		}

		return {error:'errNetwork'};
	}

	static withCacheControl(url, opts)
	{
		const cache = this.cacheControl(url, opts);

		if (cache.force) {
			opts.cache = 'force-cache';
		}

		return this.send(url, opts).then(r =>
		{
			if (r.ok && cache.refresh) {
				this.cacheRefresh(cache);
			}

			return r;
		});
	}

	static cacheControl(url, opts)
	{
		const ttl = pop({doCache:opts});

		if (!ttl) {
			return {};
		}

		const id = math.hashCode(url);
		const refresh = time.expired(mem.cache[id]);

		return {
			id, refresh, force:!refresh, ttl
		};
	}

	static cacheRefresh({id, ttl})
	{
		mem.cache[id] = time.now() + ttl;
	}

	static addUrlParams(url, params)
	{
		return url + '?' + new URLSearchParams(params);
	}
}

class BasicVideo
{
	constructor(APIResource)
	{
		const r = APIResource.items[0];

		this.channelId		= r.snippet.channelId;
		this.publishedAt	= r.snippet.publishedAt;
		this.duration		= r.contentDetails.duration;
		this.commentCount	= r.statistics.commentCount;
	}
}

class BasicComment
{
	constructor(APIResource)
	{
		const r = APIResource.snippet;

		this.id				= APIResource.id;
		this.authorId		= r.authorChannelId.value;
		this.authorImgUrl	= r.authorProfileImageUrl;
		this.sourceName		= r.authorDisplayName;
		this.sourceText		= r.textOriginal;
		this.publishedAt	= r.publishedAt;
		this.isOwner		= null;
	}
}

class Thread extends Cloneable
{
	constructor(topComment, videoId, replyCount)
	{
		super();

		this.id			= topComment.id;
		this.authorId	= topComment.authorId;
		this.videoId	= videoId;
		this.replyCount	= replyCount;
		this.members	= new Set;
		this.comments	= [];

		this.addComment(topComment);
	}

	addComment(comment)
	{
		this.comments.push(
			new ThreadComment(comment, this)
		);

		this.members.add(comment.authorId);
	}

	hasMember(id)
	{
		return this.members.has(id);
	}

	defineChildToParent(parent, child)
	{
		array.moveAfter(
			parent.lastChild, child, this.comments
		);

		parent.addChild(child);
	}

	hide(cond)
	{
		this.topComment.hide(cond);
	}

	get length()
	{
		return this.comments.length;
	}

	get memberCount()
	{
		return this.members.size;
	}

	get topComment()
	{
		return this.comments[0];
	}

	get replies()
	{
		return this.comments.slice(1);
	}

	get hasReplies()
	{
		return this.length > 1;
	}

	get firstReply()
	{
		return this.comments[1];
	}

	get hidden()
	{
		return this.topComment.hidden;
	}
}

class ThreadComment extends Cloneable
{
	constructor(BasicComment, thread)
	{
		super();

		assign(this, BasicComment);

		this.videoId	= thread.videoId;
		this.isReply	= thread.length > 0;
		this.isOwner	= thread.authorId == this.authorId;
		this.replyCount = this.isReply ? 0 : thread.replyCount;
	}
}

class ApiManager
{
	constructor(key)
	{
		this.ytd = new YoutubeDataApi;

		this.lett = {
			app: new AppLettApi,
			ytd: new YoutubeLettApi,
		};

		this.ytd.setKey(key);
	}

	get v3()
	{
		if (this.ytd.key) {
			return this.ytd;
		}

		return this.lett.ytd;
	}
}

class AppLettApi
{
	constructor()
	{
		this.baseUrl = 'https://api.lett.app/ytcs';
	}

	auth(key)
	{
		return this.get('/auth', {key});
	}

	updates(key)
	{
		return this.get('/updates', {key});
	}

	async get(endpoint, params, opts)
	{
		const fetch = await http.get(this.baseUrl + endpoint, params, opts);

		if (!fetch.ok) {
			fetch.error ||= fetch.data.error || 'errServer';
		}

		return fetch;
	}

	async post(endpoint, params)
	{
		const fetch = await http.post(this.baseUrl + endpoint, params);

		if (!fetch.ok) {
			fetch.error ||= fetch.data.error || 'errServer';
		}

		return fetch;
	}
}

class YoutubeCommonApi
{
	constructor(baseUrl)
	{
		this.baseUrl = baseUrl;
	}

	getComments(videoId)
	{
		return this.getAllComments({videoId});
	}

	getReplies(parentId)
	{
		return this.comments({parentId});
	}

	searchVideoComments(videoId, searchTerms)
	{
		return this.commentThreads({videoId, searchTerms});
	}

	searchChannelComments(allThreadsRelatedToChannelId, searchTerms)
	{
		return this.commentThreads({allThreadsRelatedToChannelId, searchTerms});
	}

	async getVideoDetails(videoId)
	{
		const fetch = await this.videos({
			id:videoId,
			part:'snippet,statistics,contentDetails',
			fields:'items/statistics,items/snippet/channelId,items/snippet/publishedAt,items/contentDetails/duration'
		});

		if (fetch.ok)
		{
			try {
				fetch.data = new BasicVideo(fetch.data);
			}
			catch {
				fetch.error = 'errParsing';
			}
		}

		return fetch;
	}

	preconnect() {
	}

	async get(endpoint, params, opts)
	{
		const fetch = await http.get(this.baseUrl + endpoint, params, opts);

		if (!fetch.ok) {
			fetch.error ||= this.getErrorReason(fetch.data);
		}

		return fetch;
	}

	async commentThreads(params)
	{
		const fetch = await this.get('/commentThreads', params);

		if (fetch.ok) {
			fetch.data = this.parseThreads(fetch.data);
		}

		return fetch;
	}

	async comments(params)
	{
		const fetch = await this.get('/comments', params);

		if (fetch.ok) {
		}

		return fetch;
	}

	async getAllComments(params)
	{
		let fetch, items = [], i = 10;

		while (i--)
		{
			fetch = await this.get('/commentThreads', params, {doCache:3600});

			if (fetch.ok)
			{
				items.push(
					...this.parseThreads(fetch.data)
				);

				params.pageToken = fetch.data.nextPageToken;
			}

			if (!fetch.ok || !params.pageToken) {
				break;
			}
		}

		return assign(fetch, {data:items});
	}

	videos(params)
	{
		return this.get('/videos', params, {doCache:3600});
	}

	getErrorReason(response)
	{
		try {
			return response.error.errors[0].reason;
		}
		catch {
			return response.error || 'errUnknown';
		}
	}

	parseThreads(resource)
	{
		try {
			return array.mapskip(resource.items,
				item => this.parseThread(item)
			);
		}
		catch {
			return [];
		}
	}

	parseThread(resource)
	{
		try {
			let {videoId, topLevelComment, totalReplyCount} = resource.snippet;

			if (!videoId) {
				return;
			}

			let thread = new Thread(
				this.parseComment(topLevelComment), videoId, totalReplyCount
			);

			if (totalReplyCount) {
				this.parseReplies(resource).forEach(
					reply => thread.addComment(reply)
				);
			}

			return thread;
		}
		catch {
		}
	}

	parseReplies(resource)
	{
		try {
			const replies = array.mapskip(resource.replies.comments,
				reply => this.parseComment(reply)
			);

			return replies.sort(
				(a, b) => a.publishedAt - b.publishedAt
			);
		}
		catch {
			return [];
		}
	}

	parseComment(resource)
	{
		try {
			return new BasicComment(resource);
		}
		catch {
		}
	}
}

class YoutubeDataApi extends YoutubeCommonApi
{
	constructor()
	{
		super('https://www.googleapis.com/youtube/v3');
	}

	setKey(apiKey, validate = false)
	{
		this.key = apiKey;

		if (validate)
		{
			return this.getVideoDetails('jNQXAC9IVRw').then(r =>
			{
				if (!r.ok) {
					delete this.key;
				}

				return r;
			});
		}
	}

	getAllComments(params)
	{
		return super.getAllComments(
			this.addCommonParams(params)
		);
	}

	commentThreads(params)
	{
		return super.commentThreads(
			this.addCommonParams(params)
		);
	}

	comments(params)
	{
		params.part = 'replies';

		return super.comments(
			this.addCommonParams(params)
		);
	}

	addCommonParams(params)
	{
		return assign({
			maxResults:100,
			textFormat:'plainText',
			part:'snippet,replies',
			order:'time',
		}, params);
	}

	async get(endpoint, params, opts)
	{
		params.key = this.key;

		let fetch, i = 3;

		while (i--)
		{
			fetch = await super.get(endpoint, params, opts);

			if (fetch.error != 'processingFailure') {
				break;
			}
		}

		return fetch;
	}
}

class YoutubeLettApi extends YoutubeCommonApi
{
	constructor()
	{
		super('https://api.lett.app/yt');
	}

	preconnect()
	{
		http.get(this.baseUrl, null, {cache:'no-store'});
	}
}

class Outlier
{
	constructor(dataset)
	{
		this.dataset = dataset.sort(sort.asc);

		let mp = dataset.length / 2,
			h1 = dataset.slice(0, Math.floor(mp)),
			h2 = dataset.slice(Math.round(mp));

		this.q1 = math.median(h1);
		this.q3 = math.median(h2);
		this.iq = this.q3 - this.q1;
	}

	get filtered()
	{
		return this.dataset.filter(
			n => !this.isOutlier(n)
		);
	}

	get outliers()
	{
		return this.dataset.filter(
			n => this.isOutlier(n)
		);
	}

	isOutlier(n)
	{
		const min = this.q1 - 1.5 * this.iq;
		const max = this.q3 + 1.5 * this.iq;

		return n < min || max < n;
	}
}

class Users
{
	constructor(threads)
	{
		this.index;
		this.users = {};
		this.posts = {};

		this.parse(threads);
	}

	get(id)
	{
		return this.users[id];
	}

	getByName(name)
	{
		return this.index.get(name);
	}

	parse(threads)
	{
		for (const thread of threads)
		{
			for (const comment of thread.comments)
			{
				this.addUser(comment.authorId, comment.sourceName);
				this.addPost(comment.authorId, comment.sourceText);
			}
		}

		this.index = this.remap(this.users, 'name');
	}

	addUser(id, name)
	{
		this.users[id] = new Author(id, name);
	}

	addPost(id, text)
	{
		(this.posts[id] ||= []).push(text);
	}

	remap(object, k)
	{
		const m = new Map;

		values(object).forEach(
			v => m.set(v[k], v)
		);

		return m;
	}
}

class Author
{
	constructor(id, name)
	{
		this.id = id;
		this.name = name.replace('@', '');
		this.displayName = this.name;
	}

	get mentionRegex()
	{
		return this.regexMention ||= regex.create('/@*%s/', this.name);
	}

	get replaceRegex()
	{
		return this.regexReplace ||= regex.create('/@*%s[-,.:;?! ]*/', this.name);
	}
}

class Comment
{
	constructor(x)
	{
		this.id				= x.id;
		this.videoId		= x.videoId;
		this.parentId		= x.parent?.id;
		this.replyCount		= x.replyCount;
		this.isReply		= x.isReply;
		this.isUploader		= x.isUploader;
		this.authorImgUrl	= x.authorImgUrl;
		this.displayName	= x.displayName;
		this.displayText	= x.displayText;
		this.locale			= x.normalized.locale;
		this.publishedAt	= time.ago(x.publishedAt);
		this.channelUrl		= string.replace('https://www.youtube.com/channel/{authorId}', x);
		this.permalink		= string.replace('https://www.youtube.com/watch?v={videoId}&lc={id}', x);
		this.structured		= x.structured;
		this.hidden			= x.hidden;
	}
}

class ParsedComment
{
	constructor(ThreadComment, ctx)
	{
		assign(this, ThreadComment);

		this.author			= ctx.users.get(this.authorId);
		this.isUploader		= ctx.uploaderId == this.authorId;
		this.parsedText		= '';
		this.normalized		= {};
		this.structured		= [];
		this.children		= [];
		this.parent			= null;
		this.toAuthor		= null;
		this.hidden			= false;

		this.prepareText();
		this.parseLinks();
		this.parseHashtags();
		this.parseTimetags(ctx.videoId, ctx.videoTime);
		this.parseText();
	}

	prepareText()
	{
		this.parsedText = this.sourceText.replace(/^\u200b/, '');
	}

	parseText()
	{
		this.normalized = nlp.normalize(this.parsedText);
	}

	parseLinks()
	{
		this.parsedText = this.parsedText.replace(/http[^\s]+/g, url =>
		{
			try {
				url = new URL(url);
			}
			catch {
				return url;
			}

			let x, {videoId, startAt} = helper.getWatchDetails(url.href);

			if (videoId)
			{
				if (videoId == this.videoId) {
					x = new TimeTag(videoId, startAt);
				}
				else {
					x = new EmbedLink(videoId, startAt);
				}
			}
			else {
				x = new WebLink(url);
			}

			return this.addStructuredItem(x);
		});
	}

	parseHashtags()
	{
		this.parsedText = this.parsedText.replace(/#[\p{L}\p{N}_]{2,}/gu, tag =>
		{
			return this.addStructuredItem(
				new Hashtag(tag)
			);
		});
	}

	parseTimetags(ctxVideoId, ctxVideoTime)
	{
		this.parsedText = this.parsedText.replace(/\b\d\d?(:\d\d)+/g, hms =>
		{
			let x, [videoId, startAt] = [this.videoId, time.hms2int(hms)];

			if (videoId == ctxVideoId)
			{
				if (startAt >= ctxVideoTime) {
					return hms;
				}

				x = new TimeTag(videoId, startAt);
			}
			else {
				x = new EmbedLink(videoId, startAt, true);
			}

			return this.addStructuredItem(x);
		});
	}

	addStructuredItem(item)
	{
		return this.structured.push(item) && item.id;
	}

	addChild(child)
	{
		child.parent = this;

		this.children.push(child);
	}

	hide(cond)
	{
		if (!cond) {
			return;
		}

		for (const child of this.children) {
			child.hide(true);
		}

		this.hidden = true;
	}

	get lastChild()
	{
		return this.children.at(-1)?.lastChild || this;
	}

	get reactedTo()
	{
		return this.children.some(child => !child.hidden);
	}
}

class Dictionary
{
	constructor()
	{
		this.map = {};
	}

	get(k)
	{
		return this.map[k] || 0;
	}

	add(k)
	{
		this.map[k] = ++this.map[k] || 0;
	}
}

class Frames
{
	constructor()
	{
		this.map = {};
	}

	getId(n)
	{
		for (const t in this.map)
		{
			if (Math.abs(t - n) < 5) {
				return this.map[t];
			}
		}

		return this.setId(n);
	}

	setId(n)
	{
		return this.map[n] = math.randint(5, true);
	}
}

class Parser
{
	constructor(threads, ctx)
	{
		this.frames = new Frames;
		this.dictionary = new Dictionary;

		return this.parse(threads, ctx);
	}

	parse(threads, ctx)
	{
		const query = {
			normalized:nlp.normalize(ctx.query.string)
		};

		const globals = {
			maxKeywordRank:0,
			avgTokenCount:1,
			tokenCountList:[],
		};

		const scores = {
			proximity:.9,
			keywords:.5,
			interactivity:.2,
			discussion:.1,
			uploaderReplied:.2,
		};

		if (ctx.query.isQuestion)
		{
			assign(scores, {
				discussion:.3,
				uploaderReplied:.3,
			});
		}

		if (ctx.query.isReserved)
		{
			assign(scores, {
				proximity:0,
			});
		}

		const idList = [];

		threads = threads.filter(
			({authorId}) => !idList.includes(authorId) && idList.push(authorId)
		);

		threads = threads.filter(thread =>
		{
			assign(thread,
			{
				meta: {
					frames:				[],
					tokens:				[],
					tokenCount:			0,
					tokenCountUnique:	0,
					ownerReplied:		false,
					uploaderReplied:	false,
				},
				rank: {
					proximity:			0,
					keywords:			0,
					interactivity:		0,
					discussion:			0,
					uploaderReplied:	0,
					final:				0,
				}
			});

			const meta = thread.meta;

			thread.comments = thread.comments.map(comment =>
			{
				comment = new ParsedComment(comment, ctx);

				if (comment.isReply)
				{
					if (comment.isOwner && thread.memberCount > 1) {
						meta.ownerReplied = true;
					}

					if (comment.isUploader) {
						meta.uploaderReplied = true;
					}
				}

				return comment;
			});

			const topComment = thread.topComment;

			meta.tokens = array.unique(topComment.normalized.tokens);
			meta.tokenCount = topComment.normalized.tokens.length;
			meta.tokenCountUnique = meta.tokens.length;

			for (const x of topComment.structured)
			{
				if (x instanceof TimeTag)
				{
					const frameId = this.frames.getId(x.startAt);

					meta.frames.push(frameId);

					array.replace(x.id, frameId, meta.tokens);
				}
			}

			if (meta.tokenCountUnique > 1 && !this.textTooLong(thread, ctx.uploaderId))
			{
				return globals.tokenCountList.push(meta.tokenCount);
			}
		});

		globals.avgTokenCount = math.avg(
			new Outlier(globals.tokenCountList).filtered
		);

		const novalWords = string.split('you are not but for the thi and that was');

		for (const thread of threads)
		{
			thread.meta.tokens.splice(
				Math.round(globals.avgTokenCount)
			);

			thread.meta.tokens.forEach(
				k => k.length > 2 && !novalWords.includes(k) && this.dictionary.add(k)
			);
		}

		for (const thread of threads)
		{
			const {meta, rank} = thread;

			meta.tokens.forEach(
				k => rank.keywords += this.dictionary.get(k)
			);

			rank.keywords /= meta.tokenCount;

			globals.maxKeywordRank = Math.max(globals.maxKeywordRank, rank.keywords);
		}

		for (const thread of threads)
		{
			const {meta, rank} = thread;

			assign(rank, {
				proximity:scores.proximity * this.fxProximity(query.normalized.tokens, thread.topComment.normalized.tokens),
				keywords:scores.keywords * math.div(rank.keywords, globals.maxKeywordRank),
				interactivity:scores.interactivity * math.inverse(meta.frames.length),
				uploaderReplied:scores.uploaderReplied * meta.uploaderReplied,
				discussion:scores.discussion * Math.max(meta.ownerReplied, .5),
			});

			rank.final = math.sum(rank);
		}

		threads.sort(
			(a, b) => (b.rank.final - a.rank.final)
		);

		threads.forEach((a, i, b) =>
		{
			while (b = threads[++i])
			{
				let x, intersect = array.intersect(a.meta.tokens, b.meta.tokens);

				if (intersect.length == b.meta.tokenCount) {
					x = true;
				}

				if (intersect.length > .49 * Math.max(a.meta.tokenCount, b.meta.tokenCount))
				{
					if (a.meta.frames[0] == b.meta.frames[0]) {
						x = true;
					}
				}

				if (x && !b.hasReplies) {
					array.removeAt(threads, i--);
				}
			}
		});

		clone(threads).forEach(thread =>
		{
			if (thread.hasReplies && thread.memberCount == 1)
			{
				const t1 = new Date(thread.topComment.publishedAt);
				const t2 = new Date(thread.firstReply.publishedAt);

				if (t2 - t1 < 300e3) {
					return array.move(threads, thread);
				}
			}
		});

		for (const thread of threads)
		{
			if (!thread.hasReplies) {
				continue;
			}

			const members = [...thread.members].map(
				id => ctx.users.get(id)
			);

			for (const reply of thread.replies)
			{
				reply.toAuthor = members.find(
					author => author.mentionRegex.test(reply.parsedText)
				);
			}

			let i = 0, n = thread.length;

			while (i + 2 < n)
			{
				const users = [], items = [];

				while (i < n)
				{
					const item = thread.comments[i];
					const user = item.author;

					if (users.at(-1) == user) {
						break;
					}

					if (!users.includes(user) && array.unique(users).length == 2) {
						break;
					}

					users.push(user);
					items.push(item);

					i++;
				}

				if (items.length == 2) {
					i--;
				}

				if (items.length > 2)
				{
					const broken = items.some(item => item.toAuthor && !users.includes(item.toAuthor));

					if (broken) {
						i--;
					}
					else {
						items.forEach(
							item => item.toAuthor = users.find(user => user != item.author)
						);
					}
				}
			}

			thread.replies.forEach((reply, i) =>
			{
				if (reply.toAuthor)
				{
					let prev, toAuthor = reply.toAuthor, mentionText = '';

					while (prev = thread.replies[--i])
					{
						if (prev.author == toAuthor)
						{
							thread.defineChildToParent(prev, reply);

							if (prev.children.some(r => r.author != reply.author))
							{
								mentionText = reply.addStructuredItem(
									new ChannelLink(toAuthor.displayName, toAuthor.id)
								);
							}

							break;
						}
					}

					reply.parsedText = reply.parsedText.replace(toAuthor.replaceRegex, mentionText + ' ');
				}
				else {
					let prev = thread.replies[--i];

					if (reply.author == prev?.toAuthor)
					{
						thread.defineChildToParent(prev, reply);

						reply.toAuthor = prev.author;
					}
				}
			});
		}

		return array.mapskip(threads, thread =>
		{
			return array.mapfail(thread.comments, comment =>
			{
				comment.displayName = comment.author.displayName;
				comment.displayText = formatter.formatText(comment.parsedText);

				if (comment.displayText.length < 2)
				{
					if (comment == thread.topComment) {
						return;
					}

					comment.hide(true);
				}

				return new Comment(comment);
			});
		});
	}

	textTooLong(thread, uploaderId)
	{
		const str = thread.topComment.parsedText;

		return !thread.hasMember(uploaderId) &&
			(str.length > 500 || string.count(/^.{0,3}\n/gm, str) > 3);
	}

	fxProximity(subset, superset)
	{
		const indexes = subset.map(
			k => superset.indexOf(k)
		);

		indexes.sort(sort.asc);

		if (indexes.length == 0 || indexes.includes(-1)) {
			return 0;
		}

		if (indexes.length == 1) {
			return 1;
		}

		return math.inverse(
			(indexes.at(-1) - indexes.at(0)) / (indexes.length - 1)
		);
	}

	fxReplyCount(x)
	{
		return (0.834 * x) - (0.167 * x ** 2);
	}
}

class Index
{
	constructor(threads, context)
	{
		this.users = new Users(threads);
		this.count = threads.length;

		for (const k of string.split('keywords frames hasLinks hasReplies hasUploader'))
		{
			this[k] = new LazyMap([]);
		}

		for (const thread of threads)
		{
			this.process(thread, context);
		}

		this.items = object.from(threads, 'id');
	}

	query(q)
	{
		const s = q.string;

		switch (s)
		{
			case ':':
				return this.getAllFrames();

			case ':all':
				return this.getAllItems();

			case ':creator':
				return this.getItemsByUploader();

			case ':link':
				return this.getItemsWithLinks();

			case ':reply':
				return this.getItemsWithReplies();
		}

		if (q.regexp) {
			return this.getItemsByRegExp(q.regexp);
		}

		if (/^\d\d?:.*\d\d$/.test(s))
		{
			const t = this.parseTimetags(s);

			switch (t.length)
			{
				case 1:
					return this.getItemsByFrame(t[0]);

				case 2:
					return this.getItemsByFrameRange(t[0], t[1]);
			}
		}

		return this.getItemsByKeywords(s);
	}

	getAllItems()
	{
		return this.exportItems(
			keys(this.items)
		);
	}

	getAllFrames()
	{
		return this.exportItems(this.frames.values);
	}

	getItemsByUploader()
	{
		return this.exportItems(this.hasUploader.values);
	}

	getItemsWithLinks()
	{
		return this.exportItems(this.hasLinks.values);
	}

	getItemsWithReplies()
	{
		return this.exportItems(this.hasReplies.values);
	}

	getItemsByFrame(t)
	{
		let x = t, y = t;

		let ids = [
			this.frames.get(t)
		];

		while (true)
		{
			let items = this.frames.get(--x);

			if (!items.length && ![1,6].includes(x % 10)) {
				break;
			}

			ids.push(items);
		}

		while (true)
		{
			let items = this.frames.get(++y);

			if (!items.length && ![4,9].includes(y % 10)) {
				break;
			}

			ids.push(items);
		}

		return this.exportItems(ids);
	}

	getItemsByFrameRange(t0, t1)
	{
		const ids = [];

		for (const t of this.frames.keys)
		{
			if (t0 <= t && t <= t1)
			{
				ids.push(
					this.frames.get(t)
				);
			}
		}

		return this.exportItems(ids);
	}

	getItemsByRegExp(re)
	{
		return this.getAllItems().filter(
			thread => thread.comments.some(
				comment => re.test(comment.sourceText)
			)
		);
	}

	getItemsByKeywords(str)
	{
		let finals = [];

		let ids = this.tokenize(str).map(
			k => this.keywords.get(k)
		);

		ids = ids.filter(x => x.length);

		if (ids.length)
		{
			finals = array.intersect(...ids);

			if (!finals.length) {
				finals = ids.sort(sort.length).shift();
			}
		}

		return this.exportItems(finals);
	}

	parseReplies(thread, uploaderId)
	{
		if (thread.hasReplies) {
			this.hasReplies.push(thread.id);
		}

		if (thread.hasMember(uploaderId)) {
			this.hasUploader.push(thread.id);
		}
	}

	parseLinks(text, id)
	{
		text.includes('http') && this.hasLinks.push(id);
	}

	parseFrames(text, id, videoTime)
	{
		this.parseTimetags(text).forEach(
			t => (0 <= t && t < videoTime) && this.frames.get(t).push(id)
		);
	}

	parseKeywords(text, id)
	{
		this.tokenize(text).forEach(
			token => this.keywords.get(token).push(id)
		);
	}

	parseTimetags(str)
	{
		return string.match(/\b\d\d?(:\d\d)+/g, str).map(time.hms2int);
	}

	process(thread, context)
	{
		const text = thread.comments.map(comment => comment.sourceText).join(' ');

		this.parseLinks(text, thread.id);
		this.parseFrames(text, thread.id, context.videoTime);
		this.parseKeywords(text, thread.id);
		this.parseReplies(thread, context.uploaderId);
	}

	tokenize(s)
	{
		return array.unique(
			nlp.normalize(s).tokens
		);
	}

	exportItems(ids)
	{
		ids = array.unique(
			ids.flat()
		);

		return ids.map(
			id => Cloneable.clone(this.items[id])
		);
	}
}

class SearchQuery
{
	constructor(s)
	{
		let x = s.toLowerCase().trim(),
			y = x.replace(/^global:\s*/, ''),
			z = string.grep('^/(.+)/([a-z]*)$', s);

		if (z) {
			try {
				this.regexp = new RegExp(z[0], z[1]);
				this.string = '';
			}
			catch (e) {
				throw 'errInvalidRegex';
			}
		}
		else {
			this.string = y;
			this.global = y != x;

			if (!y) {
				throw 'errEmptyQuery';
			}
		}
	}

	get isReserved()
	{
		return this.regexp || /^:(all|link|reply|creator)?$/.test(this);
	}

	get isQuestion()
	{
		return (/^(wh(o|y|at|en|ere)|how)|\?$/).test(this);
	}

	toString()
	{
		return this.string;
	}
}

class SearchResponse
{
	constructor(requestId)
	{
		this.id = requestId;
		this.threads = [];
	}

	setResults(threads)
	{
		this.threads = threads;
	}
}

class SearchModel extends WorkerPort
{
	constructor(port)
	{
		super(port);

		this.commentCount = 0;
		this.lastRequestId = 0;
	}

	onConnect(port)
	{
		super.onConnect(port);

		this.loadContext().catch(none);
		api.v3.preconnect();
	}

	onMessage(method, data)
	{
		this.loadContext().then(
			_ => super.onMessage(method, data)
		)
		.catch(
			id => this.sendError(id)
		);
	}

	async searchRequest(q)
	{
		const id = this.requestId, r = new SearchResponse(id);

		try {
			this.context.query = new SearchQuery(q);

			if (this.context.query.global) {
				await this.globalSearch(r);
			}
			else {
				await this.scopedSearch(r);
			}

			if (!this.requestAborted(id)) {
				this.postMessage({searchRequest:r});
			}
		}
		catch (errorId) {
			if (!this.requestAborted(id)) {
				throw errorId;
			}
		}
	}

	globalSearch(response)
	{
		return api.v3.searchChannelComments(this.context.uploaderId, this.context.query.string).then(
			fetch => this.handleApiResponse(fetch, response)
		);
	}

	scopedSearch(response)
	{
		if (this.commentCount < 1) {
			return;
		}

		if (!this.isCachable)
		{
			const videoId = this.id;
			const searchq = this.context.query.string;

			if (this.context.query.isReserved) {
				throw 'errLimitedFeature';
			}

			return api.v3.searchVideoComments(videoId, searchq).then(
				fetch => this.handleApiResponse(fetch, response)
			);
		}

		return this.loadComments().then(
			index => this.resolveRequest(
				index.query(this.context.query), response, true
			)
		);
	}

	handleApiResponse(fetch, response)
	{
		if (fetch.error) {
			throw fetch.error;
		}

		this.resolveRequest(fetch.data, response);
	}

	resolveRequest(threads, response, fromIdx)
	{
		const users = fromIdx ? this.index.users : new Users(threads);

		response.setResults(
			new Parser(threads, {...this.context, users})
		);
	}

	loadContext()
	{
		return this.contextLoad ||= api.v3.getVideoDetails(this.id).then(({data, error}) =>
		{
			if (error) {
				delete this.contextLoad; throw error;
			}

			const {commentCount, channelId, duration} = data;

			is.null(commentCount) ?
				this.commentCount = CC_DIS :
				this.commentCount = +commentCount;

			this.context = {
				videoId:this.id,
				uploaderId:channelId,
				videoTime:time.pt2int(duration),
			};

			if (this.isCachable) {
				this.loadComments();
			}

			this.postMessage({onContextLoad:{
				maxCount:this.commentCount,
				cachable:this.isCachable,
			}});
		});
	}

	loadComments()
	{
		return this.commentsLoad ||= api.v3.getComments(this.id).then(({data, error}) =>
		{
			if (error) {
				delete this.commentsLoad; throw error;
			}

			return this.index = new Index(data, this.context);
		});
	}

	get isCachable()
	{
		return math.inRange(this.commentCount, [1, 1e3]);
	}

	get requestId()
	{
		return ++this.lastRequestId;
	}

	requestAborted(requestId)
	{
		return requestId != this.lastRequestId;
	}

	sendError(id)
	{
		this.postMessage({error:id});
	}
}

class App extends Main
{
	constructor()
	{
		self.mem = new AppStorage;

		super(mem.load);
	}

	onReady()
	{
		self.api = new ApiManager(mem.user.key);
	}

	onClicked(tab)
	{
		this.sendMessage({activate:true}, tab.id);
	}

	onConnect(port)
	{
		new SearchModel(port);
	}

	onInstall()
	{
		tabs.execContentScript();
		this.setAlarms();
	}

	onStartup()
	{
		this.setAlarms();
	}

	onAlarmed({name})
	{
		switch (name) {
			case 'updatesCheck':
				return this.onUpdatesCheck();

			case 'refreshCache':
				return this.onCacheRefresh();
		}
	}

	onClientLoad(data, tab, callback)
	{
		http.get(ext.file.view).then(
			r => callback(r.data)
		);
	}

	async onUserAuth(apiKey, tab, callback)
	{
		let r = await api.ytd.setKey(apiKey, true);

		if (r.ok)
		{
			r = await api.lett.app.auth(apiKey);

			if (r.ok) {
				mem.user.id = r.data.id;
				mem.user.key = apiKey;
			}
		}

		callback(r.error);
	}

	setAlarms()
	{
		chrome.alarms.create('refreshCache', {periodInMinutes:120});
		chrome.alarms.create('updatesCheck', {periodInMinutes:360});
	}

	onCacheRefresh()
	{
		mem.cache = {};
	}

	onUpdatesCheck()
	{
		if (!mem.user.key) {
			return;
		}

		api.lett.app.updates(mem.user.key).then(
			r => this.addUpdates(r.data?.items ?? [])
		);
	}

	addUpdates(items)
	{
		items.forEach(
			item => assign(item, {id:math.randint(5), new:true})
		);

		mem.updates.unshift(...items);
	}
}

let app = new App;