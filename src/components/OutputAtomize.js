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
			"children": "Output Atomize props"
		}
	},
	"quarklycommunityKitTextarea": {
		"kind": "QuarklycommunityKitTextarea",
		"props": {
			"min-height": "200px",
			"min-width": "200px",
			"max-width": "30vw"
		}
	}
};

const OutputAtomize = props => {
	const {
		override,
		children,
		rest
	} = useOverrides(props, overrides, defaultProps);
	const {
		atomizeCode
	} = useAppStore();
	return <Box {...rest}>
		<Text {...override("text")} />
		<QuarklycommunityKitTextarea {...override("quarklycommunityKitTextarea")} value={atomizeCode} />
		{children}
	</Box>;
};

Object.assign(OutputAtomize, { ...Box,
	defaultProps,
	overrides
});
export default OutputAtomize;