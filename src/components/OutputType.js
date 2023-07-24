import React from "react";
import { useOverrides, Override } from "@quarkly/components";
import QuarklycommunityKitRadio from "./QuarklycommunityKitRadio";
import QuarklycommunityKitRadioGroup from "./QuarklycommunityKitRadioGroup";
import { useAppStore } from './App';
const defaultProps = {
	"display": "flex",
	"flex-direction": "column",
	"width": "fit-content",
	"required": false
};
const overrides = {
	"quarklycommunityKitRadio": {
		"kind": "QuarklycommunityKitRadio",
		"props": {
			"value": "props"
		}
	},
	"quarklycommunityKitRadioOverride": {
		"kind": "Override",
		"props": {
			"slot": "Text",
			"children": "Atomize Props"
		}
	},
	"quarklycommunityKitRadio1": {
		"kind": "QuarklycommunityKitRadio",
		"props": {
			"value": "overrides"
		}
	},
	"quarklycommunityKitRadioOverride1": {
		"kind": "Override",
		"props": {
			"slot": "Text",
			"children": "Overrides"
		}
	},
	"quarklycommunityKitRadio2": {
		"kind": "QuarklycommunityKitRadio",
		"props": {
			"value": "react-styles"
		}
	},
	"quarklycommunityKitRadioOverride2": {
		"kind": "Override",
		"props": {
			"slot": "Text",
			"children": "React Styles"
		}
	}
};

const OutputType = props => {
	const {
		override,
		children,
		rest
	} = useOverrides(props, overrides, defaultProps);
	const {
		outputType,
		updateOutputType
	} = useAppStore();

	const onChange = e => {
		updateOutputType(e.target.value);
	};

	return <QuarklycommunityKitRadioGroup value={outputType} onChange={onChange} {...rest}>
		<QuarklycommunityKitRadio {...override("quarklycommunityKitRadio")}>
			<Override {...override("quarklycommunityKitRadioOverride")} />
		</QuarklycommunityKitRadio>
		<QuarklycommunityKitRadio {...override("quarklycommunityKitRadio1")}>
			<Override {...override("quarklycommunityKitRadioOverride1")} />
		</QuarklycommunityKitRadio>
		<QuarklycommunityKitRadio {...override("quarklycommunityKitRadio2")}>
			<Override {...override("quarklycommunityKitRadioOverride2")} />
		</QuarklycommunityKitRadio>
		{children}
	</QuarklycommunityKitRadioGroup>;
};

Object.assign(OutputType, { ...QuarklycommunityKitRadioGroup,
	defaultProps,
	overrides
});
export default OutputType;