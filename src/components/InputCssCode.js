import React from "react";
import { useOverrides } from "@quarkly/components";
import { Text, Box } from "@quarkly/widgets";
import QuarklycommunityKitTextarea from "./QuarklycommunityKitTextarea";
import { useAppStore } from './App';
const defaultProps = {
	"min-width": "100px",
	"min-height": "100px",
	"display": "flex",
	"align-items": "center",
	"flex-direction": "column",
	"margin": "0px 50px 0px 50px"
};
const overrides = {
	"text": {
		"kind": "Text",
		"props": {
			"margin": "0px 0px 0px 0px",
			"children": "Input CSS Code"
		}
	},
	"quarklycommunityKitTextarea": {
		"kind": "QuarklycommunityKitTextarea",
		"props": {
			"min-width": "200px",
			"min-height": "200px",
			"max-width": "30vw"
		}
	}
};

const InputCssCode = props => {
	const {
		override,
		children,
		rest
	} = useOverrides(props, overrides, defaultProps);
	const {
		cssCode,
		updateCssCode
	} = useAppStore();

	const onChange = e => {
		updateCssCode(e.target.value);
	};

	return <Box {...rest}>
		<Text {...override("text")} />
		<QuarklycommunityKitTextarea value={cssCode} onChange={onChange} {...override("quarklycommunityKitTextarea")} />
		{children}
	</Box>;
};

Object.assign(InputCssCode, { ...Box,
	defaultProps,
	overrides
});
export default InputCssCode;