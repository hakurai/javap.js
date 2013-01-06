if (typeof JVM === 'undefined') {
    JVM = {};
}

(function () {
    JVM.Thread = function () {
        // 2.5.1 The pc Register
        this.passedCount;

        // 2.5.2 Java Virtual Machine Stacks
        this.javaVirtualMachineStack = [];
    };

    JVM.Thread.prototype = {
        pushFrame:function () {

        },
        dispatch:function(){

        }
    };

})();