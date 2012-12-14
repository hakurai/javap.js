if (typeof JVM === 'undefined') {
    JVM = {};
}

(function () {

    JVM.ClassLoader = function () {

    };


    JVM.ClassLoader.prototype = {
        loadClass:function (binary) {
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
            parse:function () {
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


                return klass;
            }
        };

        function getU1() {
            var byte = binary.getInt8(offset);
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
                {} // 0 は JVM によって予約されている
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
                } else if (b <= 0xe0) {
                    i++;
                    c = ((getU1() & 0x1f) << 6) | 0x0800;
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

        function getFieldInfo() {
            var info = {};
            info.accessFlags = getU2();
            info.nameTypeIndex = getU2();
            info.descTypeIndex = getU2();
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

                case 'Synthetic':
                    fn = getSynthetic;
                    break;

                case 'Signature':
                    fn = getSignature;
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

        function getSynthetic(attr) {
            attr.attributeLength = getU4();

        }

        function getSignature(attr) {
            attr.attributeLength = getU4();
            attr.signatureIndex = getU2();

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

        function getAnnotations(attr) {
            var annotations = [];

            var i = 0, len = attr.numAnnotations;

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

    }

})();