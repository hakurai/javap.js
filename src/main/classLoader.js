if (typeof JVM === 'undefined') {
    JVM = {};
}

(function () {

    JVM.ClassLoader = function () {

    };


    JVM.ClassLoader.prototype = {
        loadClass: function (binary) {
            var classFileParser = new ClassFileParser(binary),
                klass = classFileParser.parse();

            return klass;
        }
    };


    function ClassFileParser(binary) {
        var binary = new DataView(binary),
            offset = 0,
            klass = {};

        return {
            parse: function () {
                if (!isClassFile()) {
                    throw new Error('LinkageError');
                }

                readMinorVersion();
                readMajorVersion();
                readConstantPoolCount();
                readConstantPool();
                readAccessFlags();
                readThisClass();
                readSuperClass();
                readInterfacesCount();
                readInterfaces();
                readFieldsCount();
                readFields();
                readMethodsCount();
                readMethods();
                readAttributesCount();
                readAttributes();

                return klass;
            }
        };

        function getU1() {
            var byte = binary.getUint8(offset);
            offset += 1;
            return byte;
        }

        function getU2() {
            var bytes = binary.getUint16(offset, false);
            offset += 2;
            return bytes;
        }

        function getU4() {
            var bytes = binary.getUint32(offset, false);
            offset += 4;
            return bytes;
        }

        function getShort() {
            offset += 2;
            return binary.getInt16(offset, false);
        }

        function getInt() {
            offset += 4;
            return binary.getInt32(offset, false);
        }

        function getLong() {
            offset += 8;
            return binary.getFloat64(offset, false);
        }

        function getFloat() {
            offset += 4;
            return binary.getFloat32(offset, false);
        }

        function getDouble() {
            offset += 8;
            return binary.getFloat64(offset, false);
        }

        function isClassFile() {
            klass.magic = getU4();
            return klass.magic === 0xCAFEBABE;
        }

        function readMinorVersion() {
            klass.minorVersion = getU2();
        }

        function readMajorVersion() {
            klass.majorVersion = getU2();
        }

        function readConstantPoolCount() {
            klass.constantPoolCount = getU2();
        }

        function readConstantPool() {
            var count = klass.constantPoolCount - 1;
            klass.constantPool = [
                {} // 0th constantPool is reserved by JVM
            ];
            var info;
            for (var i = 0; i < count; i++) {
                info = {};
                getCPInfo(info);
                klass.constantPool.push(info);
                if (info.tag === 5 || info.tag === 6) {
                    klass.constantPool.push({});
                    i++;
                }
            }

        }

        function readAccessFlags() {
            klass.accessFlags = getU2();
        }

        function readThisClass() {
            klass.thisClass = getU2();
        }

        function readSuperClass() {
            klass.superClass = getU2();
        }

        function readInterfacesCount() {
            klass.interfacesCount = getU2();
        }

        function readInterfaces() {
            var count = klass.interfacesCount;
            var interfaces = [];
            for (var i = 0; i < count; i++) {
                interfaces.push(getU2());
            }
            klass.interfaces = interfaces;
        }

        function readFieldsCount() {
            klass.fieldsCount = getU2();
        }

        function readFields() {
            var count = klass.fieldsCount;
            var fields = [];
            for (var i = 0; i < count; i++) {
                fields.push(getFieldInfo());
            }
            klass.fields = fields;
        }

        function readMethodsCount() {
            klass.methodsCount = getU2();
        }

        function readMethods() {
            var count = klass.methodsCount;
            var methods = [];
            for (var i = 0; i < count; i++) {
                methods.push(getMethodInfo());
            }
            klass.methods = methods;
        }

        function readAttributesCount() {
            klass.attributesCount = getU2();
        }

        function readAttributes() {
            var count = klass.attributesCount;
            var attributes = [];
            for (var i = 0; i < count; i++) {
                attributes.push(getAttribute());
            }
            klass.attributes = attributes;
        }

        function getCPInfo(info) {
            info.tag = getU1();
            var fn;

            switch (info.tag) {
                case 1:
                    fn = getConstantUTF8;
                    break;
                case 3:
                    fn = getConstantInteger;
                    break;
                case 4:
                    fn = getConstantFloat;
                    break;
                case 5:
                    fn = getConstantLong;
                    break;
                case 6:
                    fn = getConstantDouble;
                    break;
                case 7:
                    fn = getConstantClass;
                    break;
                case 8:
                    fn = getConstantString;
                    break;
                case 9:
                    fn = getConstantFieldref;
                    break;
                case 10:
                    fn = getConstantMethodref;
                    break;
                case 11:
                    fn = getConstantInterfaceMethodref;
                    break;
                case 12:
                    fn = getConstantNameAndType;
                    break;
                case 15:
                    fn = getConstantMethodHandle;
                    break;
                case 16:
                    fn = getConstantMethodType;
                    break;
                case 18:
                    fn = getConstantInvokeDynamic;
                    break;
                default:
                    throw new Error('LinkageError');

            }

            fn(info);

        }

        function getConstantUTF8(info) {
            var length = getU2();
            var value = '';

            var i = 0;
            var c;
            for (; i < length; i++) {
                var b = getU1();

                if (b <= 0x7f) {
                    value += String.fromCharCode(b);
                } else if (b <= 0xdf) {
                    c = ((b & 0x1f) << 6);
                    i++;
                    c += getU1() & 0x3f;
                    value += String.fromCharCode(c);
                } else if (b <= 0xef) {
                    c = ((b & 0x0f) << 12);
                    i++;
                    c += ((getU1() & 0x3f) << 6);
                    i++;
                    c += getU1() & 0x3f;
                    value += String.fromCharCode(c);
                } else {
                    c = ((b & 0x0f) << 12);
                    i++;
                    c += (getU1() & 0x3f) << 6;
                    i++;
                    c += getU1() & 0x3f;
                    value += String.fromCharCode(c);
                }
            }
            info.length = length;
            info.bytes = value;

        }

        function getConstantInteger(info) {
            info.bytes = getU4();

        }

        function getConstantFloat(info) {
            info.bytes = getU4();

        }

        function getConstantLong(info) {
            info.highBytes = getU4();
            info.lowBytes = getU4();

        }

        function getConstantDouble(info) {
            info.highBytes = getU4();
            info.lowBytes = getU4();

        }

        function getConstantClass(info) {
            info.nameIndex = getU2();

        }

        function getConstantString(info) {
            info.stringIndex = getU2();

        }

        function getConstantFieldref(info) {
            info.classIndex = getU2();
            info.nameTypeIndex = getU2();

        }

        function getConstantMethodref(info) {
            info.classIndex = getU2();
            info.nameTypeIndex = getU2();

        }

        function getConstantInterfaceMethodref(info) {
            info.classIndex = getU2();
            info.nameTypeIndex = getU2();

        }

        function getConstantNameAndType(info) {
            info.nameIndex = getU2();
            info.descriptorIndex = getU2();

        }

        function getConstantMethodHandle(info) {
            info.referenceKind = getU1();
            info.referenceIndex = getU2();
        }

        function getConstantMethodType(info) {
            info.descriptorIndex = getU2();
        }

        function getConstantInvokeDynamic(info) {
            info.bootstrapMethodAttrIndex = getU2();
            info.nameAndTypeIndex = getU2();
        }

        function getFieldInfo() {
            var info = {};
            info.accessFlags = getU2();
            info.nameIndex = getU2();
            info.descriptorIndex = getU2();
            info.attributeCount = getU2();

            var count = info.attributeCount;
            var attributes = [];

            for (var i = 0; i < count; i++) {
                attributes.push(getAttribute());
            }

            info.attributes = attributes;

            return info;
        }

        function getAttribute() {
            var attr = {};
            attr.attributeNameIndex = getU2();
            var attributeName = klass.constantPool[attr.attributeNameIndex];

            var fn;
            switch (attributeName.bytes) {
                case 'ConstantValue':
                    fn = getConstantValue;
                    break;

                case 'Code':
                    fn = getCode;
                    break;

                case 'StackMapTable':
                    fn = getStackMapTable;
                    break;

                case 'Exceptions':
                    fn = getExceptions;
                    break;

                case 'InnerClasses':
                    fn = getInnerClasses;
                    break;

                case 'EnclosingMethod':
                    fn = getEnclosingMethod;
                    break;

                case 'Synthetic':
                    fn = getSynthetic;
                    break;

                case 'Signature':
                    fn = getSignature;
                    break;

                case 'SourceFile':
                    fn = getSourceFile;
                    break;

                case 'SourceDebugExtension':
                    fn = getSourceDebugExtension;
                    break;

                case 'LineNumberTable':
                    fn = getLineNumberTable;
                    break;

                case 'LocalVariableTable':
                    fn = getLocalVariableTable;
                    break;

                case 'LocalVariableTypeTable':
                    fn = getLocalVariableTypeTable;
                    break;

                case 'Deprecated':
                    fn = getDeprecated;
                    break;

                case 'RuntimeVisibleAnnotations':
                    fn = getRuntimeVisibleAnnotations;
                    break;

                case 'RuntimeInvisibleAnnotations':
                    fn = getRuntimeInvisibleAnnotations;
                    break;

                case 'RuntimeVisibleParameterAnnotations':
                    fn = getRuntimeVisibleParameterAnnotations;
                    break;

                case 'RuntimeInvisibleParameterAnnotations':
                    fn = getRuntimeInvisibleParameterAnnotations;
                    break;

                case 'AnnotationDefault':
                    fn = getAnnotationDefault;
                    break;

                case 'BootstrapMethods':
                    fn = getBootstrapMethods;
                    break;

                case 'MethodParameters':
                    fn = getMethodParameters;
                    break

                default :
                    throw new Error('LinkageError');
            }

            fn(attr);
            return attr;

        }

        function getConstantValue(attr) {
            attr.attributeLength = getU4();
            attr.constantValueIndex = getU2();

        }

        function getCode(attr) {
            var code = [],
                exceptionTable = [],
                attributes = [];


            attr.attributeLength = getU4();
            attr.maxStack = getU2();
            attr.maxLocals = getU2();
            attr.codeLength = getU4();


            var i, len = attr.codeLength;
            for (i = 0; i < len; i++) {
                var b = getU1();
                code.push(b);
            }
            attr.code = JVM.ByteCodeParser.parse(code);

            attr.exceptionTableLength = getU2();

            len = attr.exceptionTableLength;
            for (i = 0; i < len; i++) {
                exceptionTable.push(getExceptionTable());
            }

            attr.exceptionTable = exceptionTable;
            attr.attributesCount = getU2();


            len = attr.attributesCount;
            for (i = 0; i < len; i++) {
                attributes.push(getAttribute());
            }

            attr.attributes = attributes;

        }

        function getExceptionTable() {
            var exceptionTable = {};
            exceptionTable.startPC = getU2();
            exceptionTable.endPC = getU2();
            exceptionTable.handlerPC = getU2();
            exceptionTable.catchType = getU2();

            return exceptionTable;
        }

        function getStackMapTable(attr) {
            var i,
                len,
                entries = [];

            attr.attributeLength = getU4();
            attr.numberOfEntries = getU2();

            len = attr.numberOfEntries;
            for (i = 0; i < len; i++) {
                entries.push(getStackMapFrame());
            }

            attr.entries = entries;

        }

        function getStackMapFrame() {
            var frame = {};

            frame.frameType = getU1();

            if (frame.frameType < 64) {
                //same_frame
            } else if (frame.frameType < 128) {
                //same_locals_1_stack_item_frame
                frame.stack = getVerificationTypeInfo();
            } else if (frame.frameType === 247) {
                //same_locals_1_stack_item_frame_extended
                frame.offsetDelta = getU2();
                frame.stack = getVerificationTypeInfo();
            } else if (248 <= frame.frameType && frame.frameType <= 250) {
                //chop_frame
                frame.offsetDelta = getU2();
            } else if (frame.frameType === 251) {
                //same_frame_extended
                frame.offsetDelta = getU2();
            } else if (252 <= frame.frameType && frame.frameType <= 254) {
                //append_frame
                getAppendFrame(frame);
            } else if (frame.frameType === 255) {
                //full_frame
                getFullFrame(frame);
            } else {
                throw new Error('LinkageError');
            }

            return frame;

        }


        function getAppendFrame(frame) {
            var i, len = frame.frameType - 251;
            frame.offsetDelta = getU2();
            frame.locals = [];

            for (i = 0; i < len; i++) {
                frame.locals.push(getVerificationTypeInfo());
            }

        }

        function getFullFrame(frame) {
            var i, len;
            frame.offsetDelta = getU2();
            frame.numberOfLocals = getU2();
            frame.locals = [];

            len = frame.numberOfLocals;
            for (i = 0; i < len; i++) {
                frame.locals.push(getVerificationTypeInfo());
            }

            len = frame.numberOfStackItems = getU2();
            frame.stack = [];
            for (i = 0; i < len; i++) {
                frame.stack.push(getVerificationTypeInfo());
            }
        }

//      verification_type_info

        function getVerificationTypeInfo() {
            var verificationTypeInfo = {};
            verificationTypeInfo.tag = getU1();

            if (verificationTypeInfo.tag === 0) {
                //Top_variable_info
            } else if (verificationTypeInfo.tag === 1) {
                //Integer_variable_info
            } else if (verificationTypeInfo.tag === 2) {
                //Float_variable_info
            } else if (verificationTypeInfo.tag === 3) {
                //Double_variable_info
            } else if (verificationTypeInfo.tag === 4) {
                //Long_variable_info
            } else if (verificationTypeInfo.tag === 5) {
                //Null_variable_info
            } else if (verificationTypeInfo.tag === 6) {
                //UninitializedThis_variable_info
            } else if (verificationTypeInfo.tag === 7) {
                //Object_variable_info
                verificationTypeInfo.cpoolIndex = getU2();
            } else if (verificationTypeInfo.tag === 8) {
                //Uninitialized_variable_info
                verificationTypeInfo.offset = getU2();
            } else {
                throw new Error('LinkageError');
            }
        }


        function getExceptions(attr) {
            var i,
                len,
                exceptionIndexTable = [];

            attr.attributeLength = getU4();
            attr.numberOfExceptions = getU2();

            len = attr.numberOfExceptions;
            for (i = 0; i < len; i++) {
                exceptionIndexTable.push(getU2());
            }

            attr.exceptionIndexTable = exceptionIndexTable;
        }

        function getInnerClasses(attr) {
            var i,
                len,
                classes = [];

            attr.attributeLength = getU4();
            attr.numberOfClasses = getU2();

            len = attr.numberOfClasses;
            for (i = 0; i < len; i++) {
                classes.push(getClasses());
            }
            attr.classes = classes;
        }

        function getClasses() {
            var classes = {};

            classes.innerClassInfoIndex = getU2();
            classes.outerClassInfoIndex = getU2();
            classes.innerNameIndex = getU2();
            classes.innerClassAccessFlags = getU2();

            return classes;
        }

        function getEnclosingMethod(attr) {
            attr.attributeLength = getU4();
            attr.classIndex = getU2();
            attr.methodIndex = getU2();
        }

        function getSynthetic(attr) {
            attr.attributeLength = getU4();

        }

        function getSignature(attr) {
            attr.attributeLength = getU4();
            attr.signatureIndex = getU2();

        }

        function getSourceFile(attr) {
            attr.attributeLength = getU4();
            attr.sourcefileIndex = getU2();
        }

        function getSourceDebugExtension(attr) {
            var i,
                len,
                debugExtension = [];

            len = attr.attributeLength = getU4();
            for (i = 0; i < len; i++) {
                debugExtension.push(getU1());
            }

        }


        function getLineNumberTable(attr) {
            var i,
                len,
                lineNumberTable = [],
                table;

            attr.attributeLength = getU4();
            attr.lineNumberTableLength = getU2();

            len = attr.lineNumberTableLength;
            for (i = 0; i < len; i++) {
                table = {};
                table.startPC = getU2();
                table.lineNumber = getU2();
                lineNumberTable.push(table);
            }

            attr.lineNumberTable = lineNumberTable;
        }

        function getLocalVariableTable(attr) {
            var i,
                len,
                localVariableTable = [],
                table;

            attr.attributeLength = getU4();
            attr.localVariableTableLength = getU2();

            len = attr.localVariableTableLength;
            for (i = 0; i < len; i++) {
                table = {};
                table.startPC = getU2();
                table.length = getU2();
                table.nameIndex = getU2();
                table.descriptorIndex = getU2();
                table.index = getU2();
                localVariableTable.push(table);
            }

            attr.localVariableTable = localVariableTable;
        }

        function getLocalVariableTypeTable(attr) {
            var i,
                len,
                localVariableTypeTable = [],
                table;

            attr.attributeLength = getU4();
            attr.localVariableTypeTableLength = getU2();
            len = attr.localVariableTypeTableLength;
            for (i = 0; i < len; i++) {
                table = {};
                table.startPC = getU2();
                table.length = getU2();
                table.nameIndex = getU2();
                table.signatureIndex = getU2();
                table.index = getU2();
                localVariableTypeTable.push(table);
            }

            attr.localVariableTypeTable = localVariableTypeTable;
        }

        function getDeprecated(attr) {
            attr.attributeLength = getU4();

        }

        function getRuntimeVisibleAnnotations(attr) {
            attr.attributeLength = getU4();
            attr.numAnnotations = getU2();
            attr.annotations = getAnnotations(attr);

        }

        function getRuntimeInvisibleAnnotations(attr) {
            attr.attributeLength = getU4();
            attr.numAnnotations = getU2();
            attr.annotations = getAnnotations(attr);

        }

        function getRuntimeVisibleParameterAnnotations(attr) {
            var i,
                j,
                len,
                jLen,
                parameterAnnotations = [],
                annotation;

            attr.attributeLength = getU4();
            len = attr.numParameters = getU1();
            for (i = 0; i < len; i++) {
                annotation = {};
                annotation.numAnnotations = getU2();
                jLen = annotation.numAnnotations;
                annotation.annotations = [];
                for (j = 0; j < jLen; j++) {
                    annotation.annotations.push(getAnnotation());
                }
                parameterAnnotations.push(annotation);
            }

            attr.parameterAnnotations = parameterAnnotations;

        }

        function getRuntimeInvisibleParameterAnnotations(attr) {
            var i,
                j,
                len,
                jLen,
                parameterAnnotations = [],
                annotation;

            attr.attributeLength = getU4();
            len = attr.numParameters = getU1();
            for (i = 0; i < len; i++) {
                annotation = {};
                annotation.numAnnotations = getU2();
                jLen = annotation.numAnnotations;
                annotation.annotations = [];
                for (j = 0; j < jLen; j++) {
                    annotation.annotations.push(getAnnotation());
                }
                parameterAnnotations.push(annotation);
            }

            attr.parameterAnnotations = parameterAnnotations;

        }

        function getAnnotationDefault(attr) {
            attr.attributeLength = getU4();
            attr.defaultValue = getElementValue();
        }

        function getAnnotations(attr) {
            var annotations = [],
                i = 0,
                len = attr.numAnnotations;

            for (; i < len; i++) {

                annotations.push(getAnnotation());
            }

            return annotations;

        }

        function getAnnotation() {
            var annotation = {};
            annotation.typeIndex = getU2();
            annotation.numElementValuePairs = getU2();
            annotation.elementValuePairs = [];

            var i = 0, len = annotation.numElementValuePairs;
            for (; i < len; i++) {
                annotation.elementValuePairs.push(getElementValuePair());
            }
            return annotation;
        }

        function getElementValuePair() {
            var elementValuePair = {};
            elementValuePair.elementNameIndex = getU2();
            elementValuePair.value = getElementValue();
            return elementValuePair;
        }


        function getElementValue() {
            var elementValue = {};
            elementValue.tag = getU1();

            switch (elementValue.tag) {
                case 0x42: // B byte
                case 0x43: // C char
                case 0x44: // D double
                case 0x46: // F float
                case 0x49: // I int
                case 0x4a: // J long
                case 0x53: // S short
                case 0x5a: // Z boolean
                case 0x73: // s String
                    elementValue.constValueIndex = getU2();
                    break;

                case 0x65: // e enum
                    elementValue.enumConstValue = {};
                    elementValue.enumConstValue.typeNameIndex = getU2();
                    elementValue.enumConstValue.constNameIndex = getU2();
                    break;

                case 0x63: // c class
                    elementValue.classInfoIndex = getU2();
                    break;

                case 0x40: // @ annotation
                    elementValue.annotationValue = getAnnotation();
                    break;

                case 0x5b: // [ array
                    elementValue.arrayValue = {};
                    elementValue.arrayValue.numValues = getU2();
                    elementValue.arrayValue.values = [];

                    var i = 0, len = elementValue.arrayValue.numValues;
                    for (; i < len; i++) {
                        elementValue.arrayValue.values.push(getElementValue());
                    }
                    break;

                default:
                    throw new Error('LinkageError');


            }
        }

        function getBootstrapMethods(attr) {
            var i,
                len,
                bootstrapMethods = [];

            attr.attributeLength = getU4();
            len = attr.numBootstrapMethods = getU2();
            for (i = 0; i < len; i++) {
                bootstrapMethods.push(getBootstrapMethod());
            }

            attr.bootstrapMethods = bootstrapMethods;
        }

        function getBootstrapMethod() {
            var i,
                len,
                bootstrapArguments = [],
                method = {};

            method.bootstrapMethodRef = getU2();
            len = method.numBootstrapArguments = getU2();

            for (i = 0; i < len; i++) {
                bootstrapArguments.push(getU2());
            }
            method.bootstrapArguments = bootstrapArguments;
            return method;
        }

        function getMethodParameters(attr){
            var i,
                len,
                methodParameters = [],
                parameter;

            attr.attributeLength = getU4();
            len = attr.numMethodParameters = getU1();
            for (i = 0; i < len; i++) {
                parameter = {};
                parameter.nameIndex = getU2();
                parameter.flag = getU4();
                methodParameters.push(parameter)
            }

            attr.methodParameters = methodParameters;
        }

        function getMethodInfo() {
            var methodInfo = {};

            methodInfo.accessFlags = getU2();
            methodInfo.nameIndex = getU2();
            methodInfo.descriptorIndex = getU2();
            methodInfo.attributesCount = getU2();

            var count = methodInfo.attributesCount;
            var attributes = [];

            for (var i = 0; i < count; i++) {
                attributes.push(getAttribute());
            }

            methodInfo.attributes = attributes;

            return methodInfo;

        }

    }

})();