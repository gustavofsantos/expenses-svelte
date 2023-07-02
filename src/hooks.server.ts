import { ENTRIES_FILE_PATH } from '$env/static/private';
import * as fs from 'node:fs';

function verifyFileOrPathIsWriteable(path: string) {
	try {
		fs.accessSync(path, fs.constants.W_OK);
		return true;
	} catch (e) {
		return false;
	}
}

function startApp() {
	if (!ENTRIES_FILE_PATH) {
		throw new Error('Entries file path is not defined');
	}

	if (!verifyFileOrPathIsWriteable(ENTRIES_FILE_PATH)) {
		throw new Error('Entries file is not writeable');
	}
}

startApp();
