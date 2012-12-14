if (typeof JVM === 'undefined') {
    JVM = {};
}

(function () {
    JVM.Thread = function () {
        // 3.5.1 PCレジスタ
        this.passedCount;

        // 3.5.2 Java仮想マシンスタック
        this.javaVirtualMachineStack = [];
    };

    JVM.Thread.prototype = {
        pushFrame:function () {

        },
        dispatch:function(){

        }
    };

})();