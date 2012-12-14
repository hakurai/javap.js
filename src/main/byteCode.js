
if(typeof JVM === 'undefined' ){
    JVM = {};
}

(function () {

    JVM.byteCode = {

        // 0x02
        iconst_m1:function () {
            this.operandStack.push(-1);
        },

        // 0x03
        iconst_0:function () {
            this.operandStack.push(0);
        },

        // 0x04
        iconst_1:function () {
            this.operandStack.push(1);
        },

        // 0x05
        iconst_2:function () {
            this.operandStack.push(2);
        },

        // 0x06
        iconst_3:function () {
            this.operandStack.push(3);
        },

        // 0x07
        iconst_4:function () {
            this.operandStack.push(4);
        },

        // 0x08
        iconst_5:function () {
            this.operandStack.push(5);
        },

        // 0x10
        bipush:function (byte) {
            this.operandStack.push(byte);
        },

        // 0x15
        iload:function (index) {
            var value = this.localVariable[index];
            this.operandStack.push(value);
        },

        // 0x1a
        iload_0:function (index) {
            this.iload(0);
        },

        // 0x1b
        iload_1:function (index) {
            this.iload(1);
        },

        // 0x1c
        iload_2:function (index) {
            this.iload(2);
        },

        // 0x1d
        iload_3:function (index) {
            this.iload(3);
        },

        // 0x36
        istore:function (index) {
            var value = this.operandStack.pop();
            this.localVariable[index] = value;
        },

        // 0x3b
        istore_0:function () {
            this.istore(0);
        },

        // 0x3c
        istore_1:function () {
            this.istore(1);
        },

        // 0x3d
        istore_2:function () {
            this.istore(2);
        },

        // 0x3e
        istore_3:function () {
            this.istore(3);
        },

        // 0x60
        iadd:function () {
            var value2 = this.operandStack.pop();
            var value1 = this.operandStack.pop();
            var result = value1 + value2;
            this.operandStack.push(result);
        },

        // 0x64
        isub:function () {
            var value2 = this.operandStack.pop();
            var value1 = this.operandStack.pop();
            var result = value1 - value2;
            this.operandStack.push(result);
        },

        // 0x68
        imul:function () {
            var value2 = this.operandStack.pop();
            var value1 = this.operandStack.pop();
            var result = value1 * value2;
            this.operandStack.push(result);
        },

        // 0x6c
        idiv:function () {
            // TODO ゼロ除算は ArithmeticException
            var value2 = this.operandStack.pop();
            var value1 = this.operandStack.pop();
            var result = ~~(value1 / value2);
            this.operandStack.push(result);
        }
    }
})();