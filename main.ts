import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { getYoutubeInfo } from "src/parser";


export default class YoutubeVideoInfo extends Plugin {
	async onload() {
		// This creates an icon in the left ribbon.
		this.addRibbonIcon(
			"youtube",
			"Add Youtube Info",
			async (evt: MouseEvent) => {
				// check current active file
				const file = this.app.workspace.getActiveFile();

				if (file.extension !== "md") {
					new Notice("This file is not md file, Please open md file");
					return;
				}

				if (!file) {
					new Notice("There's no active file, Please open new file");
					return;
				}

				// Called when the user clicks the icon.
				new Notice("Loading...");

				// Get first line
				const content = await this.app.vault.read(file);
				const lines = content.split(/\r?\n/);
				const youtubeUrl = lines[0];

				new Notice(youtubeUrl);
				const result = await getYoutubeInfo(youtubeUrl);

				// Join Frontmatter And text
				this.app.vault.modify(file, result + "\n\n" + content);

				return
			}
		);


	}

	onunload() {

	}
}
