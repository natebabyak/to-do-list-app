export function match(param: string) {
	return /^[a-f0-9]{24}$/.test(param);
}
