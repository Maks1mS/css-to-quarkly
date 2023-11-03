import React from "react";
import { useOverrides } from "@quarkly/components";
import { Box } from "@quarkly/widgets";
import isValidIdentifier from 'is-valid-identifier';
import { create } from 'zustand';
import { parse, walk } from 'css-tree';
import shrthnd from 'shrthnd';
const defaultProps = {
	"min-width": "100px",
	"min-height": "100px"
};
const overrides = {};

const toCamel = string => string.replace(/([-_][a-z])/gi, $1 => $1.toUpperCase().replace('-', ''));

class PrepareForAtomize {
	constructor() {
		this.short = {
			padding: {
				'padding-top': '0px',
				'padding-bottom': '0px',
				'padding-left': '0px',
				'padding-right': '0px'
			},
			margin: {
				'margin-top': '0px',
				'margin-bottom': '0px',
				'margin-left': '0px',
				'margin-right': '0px'
			}
		};
		this.out = [];
		this.toShorthand = new Set();
	}

	iterate({
		property,
		value
	}) {
		let short = undefined;

		if (property.startsWith('padding-')) {
			short = 'padding';
		}

		if (property.startsWith('margin-')) {
			short = 'margin';
		}

		if (property === 'font') {
			value = value.replaceAll('"', "'");
		}

		if (property === 'display') {
			if (value.startsWith('-ms-') || value.startsWith('-webkit-')) {
				return;
			}
		}

		if (short) {
			this.toShorthand.add(short);
			this.short.padding[property] = value;
		} else {
			this.out.push({
				property,
				value
			});
		}
	}

	after() {
		[...this.toShorthand].forEach(property => {
			const el = document.createElement("div");
			el.style.cssText = Object.entries(this.short[property]).map(x => x.join(':')).join(';');
			console.log(el.style.padding);
			this.out.push({
				property,
				value: el.style[property]
			});
		});
	}

} // OUTPUT STRATEGY


class OutputStrategy {
	constructor(result = '') {
		this.result = result;

		if (this.iterate === undefined) {
			throw new TypeError("Must override iterate");
		}
	}

	beforeParse(src) {
		return src;
	}

}

class PropsStrategy extends OutputStrategy {
	beforeParse(str) {
		// return shrthnd(str)?.string ?? str;
		return str;
	} // before() {}


	iterate(dec) {
		if (dec.property.startsWith("--")) {
			return;
		}

		const prefixes = ['-webkit-', '-o-', '-ms-', '-moz-'];

		if (prefixes.some(x => dec.property.startsWith(x))) {
			return;
		}

		this.result += dec.property;
		this.result += '="' + dec.value + '"';
		this.result += "\n";
	} // after() {}


}

class OverridesStrategy extends OutputStrategy {
	before() {
		this.result += '{\n';
	}

	iterate(dec) {
		if (dec.property.startsWith("--")) {
			return;
		}

		const prefixes = ['-webkit-', '-o-', '-ms-', '-moz-'];

		if (prefixes.some(x => dec.property.startsWith(x))) {
			return;
		}

		if (!isValidIdentifier(dec.property)) {
			this.result += '\'' + dec.property + '\'';
		} else {
			this.result += dec.property;
		}

		this.result += ':\'' + dec.value + '\'';
		this.result += ',\n';
	}

	after() {
		this.result = this.result.slice(0, -2);
		this.result += "\n}";
	}

}

class ReactStylesStrategy extends OutputStrategy {
	before() {
		this.result += '{\n';
	}

	iterate(dec) {
		if (dec.property.startsWith("--")) {
			return;
		}

		this.result += toCamel(dec.property);
		this.result += ':\'' + dec.value + '\'';
		this.result += ',\n';
	}

	after() {
		this.result = this.result.slice(0, -2);
		this.result += "\n}";
	}

}

const convertCSSToAtomize = (text, outputType = 'props') => {
	text = shrthnd(text).string;
	let ast = parse(text, {
		parseValue: false
	});
	const p = new PrepareForAtomize();
	text = '';
	walk(ast, function (node) {
		if (node.type === 'Declaration') {
			p.iterate({
				property: node.property,
				value: node.value.value
			});
		}
	});
	p.after();
	const OutputStrategyClass = {
		'props': PropsStrategy,
		'overrides': OverridesStrategy,
		'react-styles': ReactStylesStrategy
	}[outputType];
	const strategy = new OutputStrategyClass();
	text = strategy.beforeParse(text);
	strategy.before?.();
	p.out.forEach(x => strategy.iterate(x));
	strategy.after?.();
	return strategy.result;
};

const useAppStore = create((set, get) => ({
	atomizeCode: '',
	cssCode: '',
	outputType: 'props',
	updateOutputType: newOutputType => {
		set({
			outputType: newOutputType
		});
		get().refreshOutputCode();
	},
	updateCssCode: text => {
		set({
			cssCode: text
		});
		get().refreshOutputCode();
	},
	refreshOutputCode: () => {
		set({
			atomizeCode: convertCSSToAtomize(get().cssCode, get().outputType)
		});
	}
}));
export { useAppStore };

const App = props => {
	const {
		children,
		rest
	} = useOverrides(props, overrides, defaultProps);
	return <Box {...rest}>
		{children}
	</Box>;
};

Object.assign(App, { ...Box,
	defaultProps,
	overrides
});
export default App;