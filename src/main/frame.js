
if(typeof JVM === 'undefined' ){
    JVM = {};
}

(function () {

    // 2.6 Frames
    JVM.Frame = function () {
        // 2.6.1 Local Variables
        this.localVariable = [];
        // 2.6.2 Operand Stacks
        this.operandStack = [];
        // 2.5.5 Runtime Constant Pool
        this.runtimeConstantPoolRef;
    }

})();