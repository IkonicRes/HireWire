const chalk = require('chalk');
const tinygradient = require('tinygradient');

const forbiddenChars = /\s/g;

function InitGradient(...args) {
	const grad = tinygradient.apply(this, args);
	const ret = (str, opts) => applyGradient(str ? str.toString() : '', grad, opts);
	ret.multiline = (str, opts) => multilineGradient(str ? str.toString() : '', grad, opts);
	return ret;
}

const getColors = (gradient, options, count) => options.interpolation.toLowerCase() === 'hsv' ?
	gradient.hsv(count, options.hsvSpin.toLowerCase()) : gradient.rgb(count);

function applyGradient(str, gradient, opts) {
	const options = validateOptions(opts);
	const colorsCount = Math.max(str.replace(forbiddenChars, '').length, gradient.stops.length);
	const colors = getColors(gradient, options, colorsCount);
	let result = '';
	for (const s of str) {
		result += s.match(forbiddenChars) ? s : chalk.hex(colors.shift().toHex())(s);
	}
	return result;
}

function multilineGradient(str, gradient, opts) {
	const options = validateOptions(opts);
	const lines = str.split('\n');
	const maxLength = Math.max.apply(null, lines.map(l => l.length).concat([gradient.stops.length]));
	const colors = getColors(gradient, options, maxLength);
	const results = [];
	for (const line of lines) {
		const lineColors = colors.slice(0);
		let lineResult = '';
		for (const l of line) {
			lineResult += chalk.hex(lineColors.shift().toHex())(l);
		}
		results.push(lineResult);
	}
	return results.join('\n');
}

function validateOptions(opts) {
	const options = {interpolation: 'rgb', hsvSpin: 'short', ...opts};
	if (opts !== undefined && typeof opts !== 'object') {
		throw new TypeError(`Expected \`options\` to be an \`object\`, got \`${typeof opts}\``);
	}

	if (typeof options.interpolation !== 'string') {
		throw new TypeError(`Expected \`options.interpolation\` to be a \`string\`, got \`${typeof options.interpolation}\``);
	}

	if (options.interpolation.toLowerCase() === 'hsv' && typeof options.hsvSpin !== 'string') {
		throw new TypeError(`Expected \`options.hsvSpin\` to be a \`string\`, got \`${typeof options.hsvSpin}\``);
	}
	return options;
}

function chalkRainbow (str) {
    if (typeof str !== 'string') {
      throw new TypeError('chalk-rainbow expected a string')
    }
  
    const letters = str.split('')
    const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta']
    const colorsCount = colors.length
  
    return letters.map((l, i) => {
      const color = colors[i%colorsCount]
      return chalk[color](l)
    }).join('')
  }

const aliases = {
	atlas: {colors: ['#feac5e', '#c779d0', '#4bc0c8'], options: {}},
	cristal: {colors: ['#bdfff3', '#4ac29a'], options: {}},
	teen: {colors: ['#77a1d3', '#79cbca', '#e684ae'], options: {}},
	mind: {colors: ['#473b7b', '#3584a7', '#30d2be'], options: {}},
	morning: {colors: ['#ff5f6d', '#ffc371'], options: {interpolation: 'hsv'}},
	vice: {colors: ['#5ee7df', '#b490ca'], options: {interpolation: 'hsv'}},
	passion: {colors: ['#f43b47', '#453a94'], options: {}},
	fruit: {colors: ['#ff4e50', '#f9d423'], options: {}},
	instagram: {colors: ['#833ab4', '#fd1d1d', '#fcb045'], options: {}},
	retro: {colors: ['#3f51b1', '#5a55ae', '#7b5fac', '#8f6aae', '#a86aa4', '#cc6b8e', '#f18271', '#f3a469', '#f7c978'], options: {}},
	summer: {colors: ['#fdbb2d', '#22c1c3'], options: {}},
	rainbow: {colors: ['#ff0000', '#ff0100'], options: {interpolation: 'hsv', hsvSpin: 'long'}},
	pastel: {colors: ['#74ebd5', '#74ecd5'], options: {interpolation: 'hsv', hsvSpin: 'long'}}
};

const log = console.log;
let currentAnimation = null;

const consoleFunctions = {
	log: log.bind(console),
	info: console.info.bind(console),
	warn: console.warn.bind(console),
	error: console.error.bind(console)
};

// eslint-disable-next-line guard-for-in
for (const k in consoleFunctions) {
	console[k] = function () {
		stopLastAnimation();
		consoleFunctions[k].apply(console, arguments);
	};
}

const glitchChars = 'x*0987654321[]0-~@#(____!!!!\\|?????....0000\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t';
const longHsv = {interpolation: 'hsv', hsvSpin: 'long'};

const effects = {
	rainbow(str, frame) {
		const hue = 5 * frame;
		const leftColor = {h: hue % 360, s: 1, v: 1};
		const rightColor = {h: (hue + 1) % 360, s: 1, v: 1};
		return InitGradient(leftColor, rightColor)(str, longHsv);
	},
	pulse(str, frame) {
		frame = (frame % 120) + 1;
		const transition = 6;
		const duration = 10;
		const on = '#ff1010';
		const off = '#e6e6e6';

		if (frame >= (2 * transition) + duration) {
			return chalk.hex(off)(str); // All white
		}
		if (frame >= transition && frame <= transition + duration) {
			return chalk.hex(on)(str); // All red
		}

		frame = frame >= transition + duration ? (2 * transition) + duration - frame : frame; // Revert animation

		const g = frame <= transition / 2 ?
			InitGradient([
				{color: off, pos: 0.5 - (frame / transition)},
				{color: on, pos: 0.5},
				{color: off, pos: 0.5 + (frame / transition)}
			]) :
			InitGradient([
				{color: off, pos: 0},
				{color: on, pos: 1 - (frame / transition)},
				{color: on, pos: frame / transition},
				{color: off, pos: 1}
			]);

		return g(str);
	},
	glitch(str, frame) {
		if ((frame % 2) + (frame % 3) + (frame % 11) + (frame % 29) + (frame % 37) > 52) {
			return str.replace(/[^\r\n]/g, ' ');
		}

		const chunkSize = Math.max(3, Math.round(str.length * 0.02));
		const chunks = [];

		for (let i = 0, length = str.length; i < length; i++) {
			const skip = Math.round(Math.max(0, (Math.random() - 0.8) * chunkSize));
			chunks.push(str.substring(i, i + skip).replace(/[^\r\n]/g, ' '));
			i += skip;
			if (str[i]) {
				if (str[i] !== '\n' && str[i] !== '\r' && Math.random() > 0.995) {
					chunks.push(glitchChars[Math.floor(Math.random() * glitchChars.length)]);
				} else if (Math.random() > 0.005) {
					chunks.push(str[i]);
				}
			}
		}

		let result = chunks.join('');
		if (Math.random() > 0.99) {
			result = result.toUpperCase();
		} else if (Math.random() < 0.01) {
			result = result.toLowerCase();
		}

		return result;
	},
	radar(str, frame) {
		const depth = Math.floor(Math.min(str.length, str.length * .77));
		const step = Math.floor(255 / depth);

		const globalPos = frame % (str.length + depth);

		const chars = [];
		for (let i = 0, length = str.length; i < length; i++) {
			const pos = -(i - globalPos);
			if (pos > 0 && pos <= depth - 1) {
				const shade = (depth - pos) * step;
				chars.push(chalk.rgb(shade, shade, shade)(str[i]));
			} else {
				chars.push(' ');
			}
		}
		return chars.join('');
	},
	neon(str, frame) {
		const color = (frame % 2 === 0) ? chalk.dim.rgb(88, 80, 85) : chalk.bold.rgb(213, 70, 242);
		return color(str);
	},
	karaoke(str, frame) {
		const chars = (frame % (str.length + 20)) - 10;
		if (chars < 0) {
			return chalk.white(str);
		}
		return chalk.rgb(255, 187, 0).bold(str.substr(0, chars)) + chalk.white(str.substr(chars));
	}
};

function animateString(str, effect, delay, speed) {
	stopLastAnimation();

	speed = speed === undefined ? 1 : parseFloat(speed);
	if (!speed || speed <= 0) {
		throw new Error('Expected `speed` to be an number greater than 0');
	}

	currentAnimation = {
		text: str.split(/\r\n|\r|\n/),
		lines: str.split(/\r\n|\r|\n/).length,
		stopped: false,
		init: false,
		f: 0,
		render() {
			const self = this;
			if (!this.init) {
				log('\n'.repeat(this.lines - 1));
				this.init = true;
			}
			log(this.frame());
			setTimeout(() => {
				if (!self.stopped) {
					self.render();
				}
			}, delay / speed);
		},
		frame() {
			this.f++;
			return '\u001B[' + this.lines + 'F\u001B[G\u001B[2K' + this.text.map(str => effect(str, this.f)).join('\n');
		},
		replace(str) {
			this.text = str.split(/\r\n|\r|\n/);
			this.lines = str.split(/\r\n|\r|\n/).length;
			return this;
		},
		stop() {
			this.stopped = true;
			return this;
		},
		start() {
			this.stopped = false;
			this.render();
			return this;
		}
	};
	setTimeout(() => {
		if (!currentAnimation.stopped) {
			currentAnimation.start();
		}
	}, delay / speed);
	return currentAnimation;
}

function stopLastAnimation() {
	if (currentAnimation) {
		currentAnimation.stop();
	}
}

const chalkAnimation = {
    animateString: (str, delay, speed) => animateString(str, effects.radar, delay, speed),
	rainbow: (str, speed) => animateString(str, effects.rainbow, 15, speed),
	pulse: (str, speed) => animateString(str, effects.pulse, 16, speed),
	glitch: (str, speed) => animateString(str, effects.glitch, 55, speed),
	radar: (str, speed) => animateString(str, effects.radar, 50, speed),
	neon: (str, speed) => animateString(str, effects.neon, 500, speed),
	karaoke: (str, speed) => animateString(str, effects.karaoke, 50, speed)
};

function chalkRainbow (str) {
  if (typeof str !== 'string') {
    throw new TypeError('chalk-rainbow expected a string')
  }

  const letters = str.split('')
  const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta']
  const colorsCount = colors.length

  return letters.map((l, i) => {
    const color = colors[i%colorsCount]
    return chalk[color](l)
  }).join('')
}

module.exports = chalkAnimation