var index = {};

(function ($) {
    $('#drop').on('drop', function (e) {
        e.preventDefault();
        var file = e.originalEvent.dataTransfer.files[0];
        readFile(file);
    });

    function ViewModel() {

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

        return {
            elementValueTemplate:elementValueTemplate,
            getConstantType:getConstantType,
            minorVersion:ko.observable(),
            majorVersion:ko.observable(),
            constantPoolCount:ko.observable(),
            accessFlags:ko.observable(),
            thisClass:ko.observable(),
            superClass:ko.observable(),
            interfacesCount:ko.observable(),
            fieldsCount:ko.observable(),
            methodsCount:ko.observable(),
            constantPool:ko.observableArray(),
            interfaces:ko.observableArray(),
            fields:ko.observableArray()

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
        };

        reader.readAsArrayBuffer(file);
    }
})(jQuery);



