
if(typeof JVM === 'undefined' ){
    JVM = {};
}

(function () {

    // 3.6 フレーム
    JVM.Frame = function () {
        // 3.6.1 ローカル変数
        this.localVariable = [];
        // 3.6.2 オペランドスタック
        this.operandStack = [];
        // 3.5.5 実行時コンスタントプールへの参照
        this.runtimeConstantPoolRef;
    }

})();