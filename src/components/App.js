import React from "react";
import { useOverrides } from "@quarkly/components";
import { Box } from "@quarkly/widgets";
import isValidIdentifier from 'is-valid-identifier';
import shrthnd from 'shrthnd';
import { create } from 'zustand';
import { parse, walk } from 'css-tree';
const defaultProps = {
	"min-width": "100px",
	"min-height": "100px"
};
const overrides = {};

const toCamel = string => string.replace(/([-_][a-z])/gi, $1 => $1.toUpperCase().replace('-', ''));

class Strategy {
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

class PropsStrategy extends Strategy {
	beforeParse(str) {
		return shrthnd(str)?.string ?? str;
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

class OverridesStrategy extends Strategy {
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

class ReactStylesStrategy extends Strategy {
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
	const strategyClass = {
		'props': PropsStrategy,
		'overrides': OverridesStrategy,
		'react-styles': ReactStylesStrategy
	}[outputType];
	const strategy = new strategyClass();
	text = strategy.beforeParse(text);
	const ast = parse(text, {
		parseValue: false
	});
	strategy.before?.();
	walk(ast, function (node) {
		if (node.type === 'Declaration') {
			console.log(node);
			strategy.iterate({
				property: node.property,
				value: node.value.value
			});
		}
	});
	strategy.after?.(); // const obj = css.parse(text);
	// const stylesheet = obj.stylesheet;
	// const decs = stylesheet.rules[0].declarations;
	// strategy.before?.()
	// decs.forEach((dec) => strategy.iterate(dec))
	// strategy.after?.()

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