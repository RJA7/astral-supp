/** @noSelf */
interface LuaIo {
	popen(command: string): LuaIoFile | undefined;
}

interface LuaIoFile {
	read(format: string): string | undefined;
	close(): void;
}

declare const io: LuaIo;

export function readClipboard(): string | undefined {
	const platform = sys.get_sys_info().system_name;
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
