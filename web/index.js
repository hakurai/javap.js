var index = {};

(function ($) {
    $('#drop').on('drop', function (e) {
        e.preventDefault();
        var file = e.originalEvent.dataTransfer.files[0];
        readFile(file);
    });

    $('#file').change(function (e) {
        e.preventDefault();
        var file = e.target.files[0];
        readFile(file);
    });

    function escape(text) {
        return $('<div>').text(text).html();
    }

    ko.bindingHandlers.constantPool = {
        update:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor();
            if (value && value !== '') {
                $(element).html('<a href="#constant' + value + '">' + '#' + value + '</a>');
            } else {
                $(element).html('');
            }
        }
    };

    ko.bindingHandlers.method = {
        update:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor();
            if (value && value !== '') {
                $(element).text(
                    bindingContext.$root.getConstantUTF8Value(value.nameIndex) +
                        bindingContext.$root.getConstantUTF8Value(value.descriptorIndex)
                );
            } else {
                $(element).text('');
            }
        }
    };

    ko.bindingHandlers.bytecode = {
        update:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor(),
                name,
                operand;

            if (value && value !== '') {
                name = JVM.ByteCodeParser.BYTECODE_DETAIL[value.opecode].name;
                operand = printOperand(value, bindingContext.$root.klass.constantPool);

                $(element).html(name + '<span class="operand">' + operand + '</span>');
            } else {
                $(element).text('');
            }
        }
    };

    function printOperand(bytecode, constantPool) {
        var op0, op1, op2, op3, index;


        if (bytecode.operand.length === 0) {
            return ''
        } else if (bytecode.operand.length === 1) {

            switch (bytecode.opecode) {
                case 16: //bipush
                    return signExtensionByte(bytecode.operand[0]);

                case 18: //ldc
                    op0 = bytecode.operand[0];
                    return printConstantPoolValue(constantPool, op0);

                default:
                    return bytecode.operand[0];
            }

        } else if (bytecode.operand.length === 2) {
            op0 = bytecode.operand[0];
            op1 = bytecode.operand[1];

            switch (bytecode.opecode) {
                case 17: //sipush
                case 198: //ifnull
                case 199: //ifnonnull
                    return signExtensionShort(bytecode);

                case 19: //ldc_w
                case 178: //getstatic
                case 179: //putstatic
                case 180: //getfield
                case 181: //putfield
                case 182: //invokevirtual
                case 183: //invokespecial
                case 184: //invokestatic
                case 187: //new
                case 189: //anewarray
                case 192: //checkcast
                case 193: //instanceof
                    index = op0 << 8 | op1;
                    return printConstantPoolValue(constantPool, index);

                case 132: //iinc
                    return op0 + '  ' + signExtensionByte(op1);

                case 153: //if<cond>
                case 154:
                case 155:
                case 156:
                case 157:
                case 158:
                case 159: //if_icmp<cond>
                case 160:
                case 161:
                case 162:
                case 163:
                case 164:
                case 167: //goto
                case 168: //jsr
                    return bytecode.pc + (op0 << 8 | op1);

                default:
                    return op0 + ', ' + op1;
            }

        } else if (bytecode.operand.length === 3) {
            op0 = bytecode.operand[0];
            op1 = bytecode.operand[1];
            op2 = bytecode.operand[2];
            //multianewarray
            index = op0 << 8 | op1;
            return printConstantPoolValue(constantPool, index) + ', ' + op2;

        } else if (bytecode.operand.length === 4) {
            op0 = bytecode.operand[0];
            op1 = bytecode.operand[1];
            op2 = bytecode.operand[2];
            op3 = bytecode.operand[3];

            switch (bytecode.opecode) {

                case 185: //invokeinterface
                    index = op0 << 8 | op1;
                    return printConstantPoolValue(constantPool, index) + ', ' + op2;

                case 200: //goto_w
                case 201: //jsr_w
                    return bytecode.pc + (op0 << 24 | op1 << 16 | op2 << 18 | op3); //2バイト分しか使わないので一応大丈夫？
            }

        }

        return '';

    }

    function signExtensionByte(op0) {
        return op0 > 127 ? op0 | 0xFFFFFF00 : op0; //符号拡張
    }

    function signExtensionShort(bytecode) {
        var short = bytecode.operand[0] << 8 | bytecode.operand[1];

        return op0 > 32768 ? short | 0xFFFF0000 : short; //符号拡張
    }

    function printConstantPoolValue(constantPool, index) {
        var value = constantPool[index],
            desc = '';
        if (value.tag === 7) { //Class
            desc = ' <span class="comment">// Class ' + escape(printClass(constantPool, value)) + '</span>';

        } else if (value.tag === 8) { //String
            desc = ' <span class="comment">// String ' + escape(printString(constantPool, value)) + '</span>';

        } else if (value.tag === 9) { //Field
            desc = ' <span class="comment">// Field ' + escape(printField(constantPool, value)) + '</span>';

        } else if (value.tag === 10) { //Method
            desc = ' <span class="comment">// Method ' + escape(printMethodref(constantPool, value)) + '</span>';

        } else if (value.tag === 11) { //InterfaceMethod
            desc = ' <span class="comment">// InterfaceMethod ' + escape(printMethodref(constantPool, value)) + '</span>';

        }

        return '#' + index + desc;
    }

    function printField(constantPool, value) {
        return printClass(constantPool, constantPool[value.classIndex]) + '.' + printNameAndType(constantPool, constantPool[value.nameTypeIndex]);
    }

    function printMethodref(constantPool, value) {
        return printClass(constantPool, constantPool[value.classIndex]) + '.' + printNameAndType(constantPool, constantPool[value.nameTypeIndex]);
    }

    function printNameAndType(constantPool, value) {
        return constantPool[value.nameIndex].bytes + ':' + constantPool[value.descriptorIndex].bytes;
    }


    function printClass(constantPool, value) {
        return constantPool[value.nameIndex].bytes;
    }

    function printString(constantPool, value) {
        return constantPool[value.stringIndex].bytes;
    }


    function ViewModel() {

        var klass;
        var minorVersion = ko.observable();
        var majorVersion = ko.observable();
        var constantPoolCount = ko.observable();
        var accessFlags = ko.observable();
        var thisClass = ko.observable();
        var superClass = ko.observable();
        var interfacesCount = ko.observable();
        var fieldsCount = ko.observable();
        var methodsCount = ko.observable();
        var constantPool = ko.observableArray();
        var interfaces = ko.observableArray();
        var fields = ko.observableArray();
        var methods = ko.observableArray();

        function elementValueTemplate(tag) {
            switch (tag) {
                case 0x42: // B byte
                case 0x43: // C char
                case 0x44: // D double
                case 0x46: // F float
                case 0x49: // I int
                case 0x4a: // J long
                case 0x53: // S short
                case 0x5a: // Z boolean
                case 0x73: // s String
                    return 'elementValue-other';

                case 0x65: // e enum
                    return 'elementValue-enum';

                case 0x63: // c class
                    return 'elementValue-class';

                case 0x40: // @ annotation
                    return 'elementValue-annotation';

                case 0x5b: // [ array
                    return 'elementValue-array';

                default:
                    throw new Error('LinkageError');


            }
        }

        function getConstantUTF8Value(index) {
            if (typeof constantPool()[index] !== 'undefined') {
                return constantPool()[index].bytes;
            }
            return '';
        }

        function getConstantType(tag) {
            switch (tag) {
                case 1:
                    return 'CONSTANT_Utf8'
                case 3:
                    return 'CONSTANT_Integer';
                case 4:
                    return 'CONSTANT_Float';
                case 5:
                    return 'CONSTANT_Long';
                case 6:
                    return 'CONSTANT_Double';
                case 7:
                    return 'CONSTANT_Class';
                case 8:
                    return 'CONSTANT_String'
                case 9:
                    return 'CONSTANT_Fieldref';
                case 10:
                    return 'CONSTANT_Methodref';
                case 11:
                    return 'CONSTANT_InterfaceMethodref';
                case 12:
                    return 'CONSTANT_NameAndType';
                case 15:
                    return 'CONSTANT_MethodHandle';
                case 16:
                    return 'CONSTANT_MethodType';
                case 18:
                    return 'CONSTANT_InvokeDynamic';
                default :
                    return '';

            }

        }

        function getConstantHref(index) {
            return '#constant' + index;
        }

        return {
            klass:klass,
            minorVersion:minorVersion,
            majorVersion:majorVersion,
            constantPoolCount:constantPoolCount,
            accessFlags:accessFlags,
            thisClass:thisClass,
            superClass:superClass,
            interfacesCount:interfacesCount,
            fieldsCount:fieldsCount,
            methodsCount:methodsCount,
            constantPool:constantPool,
            interfaces:interfaces,
            fields:fields,
            methods:methods,
            elementValueTemplate:elementValueTemplate,
            getConstantUTF8Value:getConstantUTF8Value,
            getConstantType:getConstantType,
            getConstantHref:getConstantHref

        };
    }

    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);

    function readFile(file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            // 読み込んだファイルの中身をテキストエリアにセット
            var data = e.target.result;

            var classLoader = new JVM.ClassLoader();
            var klass = classLoader.loadClass(data);

            viewModel.klass = klass;
            viewModel.minorVersion(klass.minorVersion);
            viewModel.majorVersion(klass.majorVersion);
            viewModel.constantPoolCount(klass.constantPoolCount);
            viewModel.accessFlags(klass.accessFlags);
            viewModel.thisClass(klass.thisClass);
            viewModel.superClass(klass.superClass);
            viewModel.interfacesCount(klass.interfacesCount);
            viewModel.fieldsCount(klass.fieldsCount);
            viewModel.methodsCount(klass.methodsCount);

            ko.utils.arrayPushAll(viewModel.constantPool, klass.constantPool);
            ko.utils.arrayPushAll(viewModel.interfaces, klass.interfaces);
            ko.utils.arrayPushAll(viewModel.fields, klass.fields);
            ko.utils.arrayPushAll(viewModel.methods, klass.methods);
        };

        reader.readAsArrayBuffer(file);
    }
})(jQuery);



