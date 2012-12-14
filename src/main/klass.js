if (typeof JVM === 'undefined') {
    JVM = {};
}

(function () {

    JVM.Klass = function () {

        // 3.5.5 実行時コンスタントプール
        this.runtimeConstantPool = [];
    };

})();