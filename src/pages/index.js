import React from "react";
import theme from "theme";
import { Theme, Text, Box } from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { RawHtml, Override } from "@quarkly/components";
import * as Components from "components";
export default (() => {
	return <Theme theme={theme}>
		<GlobalQuarklyPageStyles pageUrl={"index"} />
		<Helmet>
			<title>
				Quarkly export
			</title>
			<meta name={"description"} content={"Web site created using quarkly.io"} />
			<link rel={"shortcut icon"} href={"https://uploads.quarkly.io/readme/cra/favicon-32x32.ico"} type={"image/x-icon"} />
		</Helmet>
		<Text font="--headline1" display="block" text-align="center">
			CSS To Quarkly
		</Text>
		<Box
			min-width="100px"
			min-height="100px"
			display="flex"
			align-items="flex-start"
			justify-items="center"
			justify-content="center"
			flex-wrap="wrap"
			padding="50px 0px 50px 0px"
		>
			<Components.InputCssCode>
				<Override slot="text" font="--headline2" />
			</Components.InputCssCode>
			<Box
				min-width="100px"
				min-height="100px"
				display="flex"
				align-items="center"
				flex-direction="column"
			>
				<Components.OutputAtomize>
					<Override slot="text" font="--headline2">
						Output
					</Override>
				</Components.OutputAtomize>
				<Box min-width="100px" min-height="100px">
					<Text margin="0px 0px 0px 0px" font="--headline3">
						Output options
					</Text>
					<Components.OutputType />
				</Box>
			</Box>
		</Box>
		<RawHtml>
			<style place={"endOfHead"} rawKey={"648bfdd491dc650018408385"}>
				{":root {\n  box-sizing: border-box;\n}\n\n* {\n  box-sizing: inherit;\n}"}
			</style>
		</RawHtml>
	</Theme>;
});