/** @noSelf */
interface LuaIo {
	popen(command: string): LuaIoFile | undefined;
}

interface LuaIoFile {
	read(format: string): string | undefined;
	close(): void;
}

declare const io: LuaIo;

export function isClipboardAsync(): boolean {
	return sys.get_sys_info().system_name === 'HTML5';
}

export function readClipboard(): string | undefined {
	const platform = sys.get_sys_info().system_name;

	if (platform === 'HTML5') {
		// navigator.clipboard.readText() is async; result is polled via pollClipboard()
		html5.run(
			'window.__clipboardReady=false;window.__clipboardText="";navigator.clipboard.readText().then(function(t){window.__clipboardText=t;window.__clipboardReady=true;}).catch(function(){window.__clipboardReady=true;});',
		);
		return undefined;
	}

	let command: string;
	if (platform === 'Windows') {
		command = 'powershell.exe -command "Get-Clipboard"';
	} else if (platform === 'Darwin') {
		command = 'pbpaste';
	} else {
		command = 'xclip -selection clipboard -o';
	}

	const file = io.popen(command);
	if (file === undefined) return undefined;

	const text = file.read('*a');
	file.close();
	return text;
}

/** Poll for the async clipboard result started by readClipboard() on HTML5.
 *  Returns the clipboard text when ready, or undefined while still pending. */
export function pollClipboard(): string | undefined {
	const result = html5.run(
		'(function(){if(!window.__clipboardReady){return"__pending__";}window.__clipboardReady=false;return window.__clipboardText||"";})();',
	);
	return result !== '__pending__' ? result : undefined;
}
