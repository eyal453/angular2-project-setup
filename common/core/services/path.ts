var _path: string = '';
export var PathService = {
    getRelativePath(filePath) {
        if (!_path) {
            this.setPath();
        }
        return _path + filePath;
    },
    setPath() {
        var seps = window.location.pathname
            .split("/")
            .filter(x => !!x)
            .length;
        for (var x = 0; x < seps; x++) {
            _path += "../";
        }
    }
}