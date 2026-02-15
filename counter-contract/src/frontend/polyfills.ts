import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
    if (!window.process) {
        // @ts-ignore
        window.process = { env: {} };
    }
}
