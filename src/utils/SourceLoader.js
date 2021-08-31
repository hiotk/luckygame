export default class SourceLoader {
    constructor(source) {
        this.source = source;
        this.loadedSize = 0;
        this.totalSize = 0;
        this.loaded = false;
    }

    download(callback = () => {}) {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            this.loadedSize = this.totalSize;
            this.loaded = true;
        };
        xhr.onprogress = (ev) => {
            this.totalSize = ev.total;
            this.loadedSize = ev.loaded;
            callback();
        };
        xhr.open('get', this.source, true);
        xhr.send();
    }
}
