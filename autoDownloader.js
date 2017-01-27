/*jshint esversion: 6 */

/**
 * 스크립트, 어플, 파일 자동 다운로드 스크립트
 * @author Scripter36(1350adwx)
 */


/**
 * 파일 다운로더
 * @param {String} _url     다운로드 받을 Url
 * @param {File} _path    다운로드 받아질 경로
 * @param {Boolean} _install 설치 여부
 * @param {Boolean} _force   강제 설치 여부
 */
function AutoDownloader(_url, _path, _install, _force) {
    /** @type {Context} 마크 context */
    let ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
    /** @type {String} 다운로드 받을 Url */
    let url = _url,
        /** @type {File} 다운로드 받아질 경로 */
        path = _path,
        /** @type {Boolean} 설치 여부 */
        install = _install,
        /** @type {Boolean} 강제 설치 여부 */
        force = _force,
        /** @type {Number} 진행 Byte */
        progress = 0,
        /** @type {Number} 다운받는 파일 크기(Byte) */
        max = 0,
        /** @type {Boolean} 다운로드 시작 여부 */
        started = false;

    /**
     * 다운로드 받을 Url 변경
     * @param {String} _url 다운로드 받을 Url
     */
    this.setUrl = function(_url) {
        url = _url;
        return this;
    };

    /**
     * 다운로드 받을 Url 가져오기
     * @return {String} 다운로드 받을 Url
     */
    this.getUrl = function() {
        return url;
    };

    /**
     * 다운로드 받아질 경로 변경
     * @param {File} _path 다운로드 받아질 경로
     */
    this.setPath = function(_path) {
        if (_path instanceof java.io.File) path = _path;
        else path = new java.io.File(_path);
        return this;
    };

    /**
     * 다운로드 받아질 경로 가져오기
     * @return {File} 다운로드 받아질 경로
     */
    this.getPath = function() {
        return path;
    };

    /**
     * 다운로드 후 설치 여부 변경
     * @param {Boolean} _install 설치 여부
     */
    this.setInstall = function(_install) {
        install = _install == true;
        return this;
    };

    /**
     * 다운로드 후 설치 여부 가져오기
     * @return {Boolean} 설치 여부
     */
    this.isInstall = function() {
        return install;
    };

    /**
     * 다운로드 후 강제 설치 여부 변경
     * @param {Boolean} _force 강제 설치 여부
     */
    this.setForceInstall = function(_force) {
        force = _force == true;
        return this;
    };

    /**
     * 다운로드 후 강제 설치 여부
     * @return {Boolean} 강제 설치 여부
     */
    this.isForceInstall = function() {
        return force;
    };

    /**
     * 다운로드 시작 여부 가져오기
     * @return {Boolean} 다운로드 시작 여부
     */
    this.isStarted = function() {
        return started;
    };

    /**
     * 다운로드해야 할 Byte 가져오기
     * @return {Number} 다운로드 해야 할 Byte
     */
    this.getMax = function() {
        return max;
    };

    /**
     * 다운로드 한 Byte 가져오기
     * @return {Number} 다운로드 한 Byte
     */
    this.getProgress = function() {
        if (path === undefined) return 0;
        if (!started) return 0;
        return path.length();
    };

    /**
     * 다운로드
     * @param  {Function} callback 다운로드 완료 후 실행될
     */
    this.download = function(callback) {
        if (path.exists()) path.delete();
        started = true;
        let thread = new java.lang.Thread(new java.lang.Runnable({
            run: function() {
                try {
                    let _url = new java.net.URL(url);
                    let urlConn = _url.openConnection();
                    max = urlConn.getContentLength();
                    var bis = new java.io.BufferedInputStream(_url.openStream());
                    var bos = new java.io.BufferedOutputStream(new java.io.FileOutputStream(path));
                    var len;
                    while ((len = bis.read()) !== -1) {
                        bos.write(len);
                    }
                    bos.flush();
                    bis.close();
                    bos.close();
                    if (install) {
                        let name = path.getName() + "";
                        let lastname = name.split('.')[name.split('.').length - 1].toLowerCase();
                        if (lastname === "apk") {
                            try {
                                let intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
                                intent.setDataAndType(android.net.Uri.fromFile(path), "application/vnd.android.package-archive");
                                ctx.startActivity(intent);
                                if (force) {
                                    let packageName = ctx.getPackageManager().getPackageArchiveInfo(path.getAbsolutePath(), 0).packageName;
                                    try {
                                        ctx.getPackageManager().getPackageInfo(packageName, android.content.pm.PackageManager.GET_ACTIVITIES);
                                        let uninstallIntent = new android.content.Intent(android.content.Intent.ACTION_DELETE, android.net.Uri.fromParts("package", packageName, null));
                                        ctx.startActivity(uninstallIntent);
                                    } catch (e) {

                                    }
                                }
                            } catch (e) {
                                print(e.lineNumber + "\n" + e);
                            }
                        } else if (lastname === "js") {
                            let file;
                            if (net.zhuoweizhang.mcpelauncher.Utils.isPro()) file = new java.io.File(android.os.Environment.getDataDirectory().getAbsolutePath() + "/data/net.zhuoweizhang.mcpelauncher.pro/app_modscripts/" + path.getName());
                            else file = new java.io.File(android.os.Environment.getDataDirectory().getAbsolutePath() + "/data/net.zhuoweizhang.mcpelauncher/app_modscripts/" + path.getName());
                            if (!file.exists() || force) {
                                try {
                                    let bis = new java.io.BufferedInputStream(new java.io.FileInputStream(path));
                                    let bos = new java.io.BufferedOutputStream(new java.io.FileOutputStream(file));
                                    let len;
                                    while ((len = bis.read()) !== -1) {
                                        bos.write(len);
                                    }
                                    bos.flush();
                                    bis.close();
                                    bos.close();
                                } catch (e) {
                                    print(e.lineNumber + "\n" + e);
                                }
                            }
                            net.zhuoweizhang.mcpelauncher.ScriptManager.setEnabled(file, true);
                        }
                    }
                    callback();
                    started = false;
                } catch (e) {
                    print(e.lineNumber + "\n" + e);
                }
            }
        }));
        thread.start();
        return this;
    };
}
