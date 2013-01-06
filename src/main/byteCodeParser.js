if (typeof JVM === 'undefined') {
    JVM = {};
}

(function () {

    JVM.ByteCodeParser = {};


    var BYTECODE_DETAIL = [];
    BYTECODE_DETAIL[0] = bytecode('nop', 0);
    BYTECODE_DETAIL[1] = bytecode('aconst_null', 0);
    BYTECODE_DETAIL[2] = bytecode('iconst_m1', 0);
    BYTECODE_DETAIL[3] = bytecode('iconst_0', 0);
    BYTECODE_DETAIL[4] = bytecode('iconst_1', 0);
    BYTECODE_DETAIL[5] = bytecode('iconst_2', 0);
    BYTECODE_DETAIL[6] = bytecode('iconst_3', 0);
    BYTECODE_DETAIL[7] = bytecode('iconst_4', 0);
    BYTECODE_DETAIL[8] = bytecode('iconst_5', 0);
    BYTECODE_DETAIL[9] = bytecode('lconst_0', 0);
    BYTECODE_DETAIL[10] = bytecode('lconst_1', 0);
    BYTECODE_DETAIL[11] = bytecode('fconst_0', 0);
    BYTECODE_DETAIL[12] = bytecode('fconst_1', 0);
    BYTECODE_DETAIL[13] = bytecode('fconst_2', 0);
    BYTECODE_DETAIL[14] = bytecode('dconst_0', 0);
    BYTECODE_DETAIL[15] = bytecode('dconst_1', 0);
    BYTECODE_DETAIL[16] = bytecode('bipush', 1);
    BYTECODE_DETAIL[17] = bytecode('sipush', 2);
    BYTECODE_DETAIL[18] = bytecode('ldc', 1);
    BYTECODE_DETAIL[19] = bytecode('ldc_w', 2);
    BYTECODE_DETAIL[20] = bytecode('ldc2_w', 2);
    BYTECODE_DETAIL[21] = bytecode('iload', 1);
    BYTECODE_DETAIL[22] = bytecode('lload', 1);
    BYTECODE_DETAIL[23] = bytecode('fload', 1);
    BYTECODE_DETAIL[24] = bytecode('dload', 1);
    BYTECODE_DETAIL[25] = bytecode('aload', 1);
    BYTECODE_DETAIL[26] = bytecode('iload_0', 0);
    BYTECODE_DETAIL[27] = bytecode('iload_1', 0);
    BYTECODE_DETAIL[28] = bytecode('iload_2', 0);
    BYTECODE_DETAIL[29] = bytecode('iload_3', 0);
    BYTECODE_DETAIL[30] = bytecode('lload_0', 0);
    BYTECODE_DETAIL[31] = bytecode('lload_1', 0);
    BYTECODE_DETAIL[32] = bytecode('lload_2', 0);
    BYTECODE_DETAIL[33] = bytecode('lload_3', 0);
    BYTECODE_DETAIL[34] = bytecode('fload_0', 0);
    BYTECODE_DETAIL[35] = bytecode('fload_1', 0);
    BYTECODE_DETAIL[36] = bytecode('fload_2', 0);
    BYTECODE_DETAIL[37] = bytecode('fload_3', 0);
    BYTECODE_DETAIL[38] = bytecode('dload_0', 0);
    BYTECODE_DETAIL[39] = bytecode('dload_1', 0);
    BYTECODE_DETAIL[40] = bytecode('dload_2', 0);
    BYTECODE_DETAIL[41] = bytecode('dload_3', 0);
    BYTECODE_DETAIL[42] = bytecode('aload_0', 0);
    BYTECODE_DETAIL[43] = bytecode('aload_1', 0);
    BYTECODE_DETAIL[44] = bytecode('aload_2', 0);
    BYTECODE_DETAIL[45] = bytecode('aload_3', 0);
    BYTECODE_DETAIL[46] = bytecode('iaload', 0);
    BYTECODE_DETAIL[47] = bytecode('laload', 0);
    BYTECODE_DETAIL[48] = bytecode('faload', 0);
    BYTECODE_DETAIL[49] = bytecode('daload', 0);
    BYTECODE_DETAIL[50] = bytecode('aaload', 0);
    BYTECODE_DETAIL[51] = bytecode('baload', 0);
    BYTECODE_DETAIL[52] = bytecode('caload', 0);
    BYTECODE_DETAIL[53] = bytecode('saload', 0);
    BYTECODE_DETAIL[54] = bytecode('istore', 1);
    BYTECODE_DETAIL[55] = bytecode('lstore', 1);
    BYTECODE_DETAIL[56] = bytecode('fstore', 1);
    BYTECODE_DETAIL[57] = bytecode('dstore', 1);
    BYTECODE_DETAIL[58] = bytecode('astore', 1);
    BYTECODE_DETAIL[59] = bytecode('istore_0', 0);
    BYTECODE_DETAIL[60] = bytecode('istore_1', 0);
    BYTECODE_DETAIL[61] = bytecode('istore_2', 0);
    BYTECODE_DETAIL[62] = bytecode('istore_3', 0);
    BYTECODE_DETAIL[63] = bytecode('lstore_0', 0);
    BYTECODE_DETAIL[64] = bytecode('lstore_1', 0);
    BYTECODE_DETAIL[65] = bytecode('lstore_2', 0);
    BYTECODE_DETAIL[66] = bytecode('lstore_3', 0);
    BYTECODE_DETAIL[67] = bytecode('fstore_0', 0);
    BYTECODE_DETAIL[68] = bytecode('fstore_1', 0);
    BYTECODE_DETAIL[69] = bytecode('fstore_2', 0);
    BYTECODE_DETAIL[70] = bytecode('fstore_3', 0);
    BYTECODE_DETAIL[71] = bytecode('dstore_0', 0);
    BYTECODE_DETAIL[72] = bytecode('dstore_1', 0);
    BYTECODE_DETAIL[73] = bytecode('dstore_2', 0);
    BYTECODE_DETAIL[74] = bytecode('dstore_3', 0);
    BYTECODE_DETAIL[75] = bytecode('astore_0', 0);
    BYTECODE_DETAIL[76] = bytecode('astore_1', 0);
    BYTECODE_DETAIL[77] = bytecode('astore_2', 0);
    BYTECODE_DETAIL[78] = bytecode('astore_3', 0);
    BYTECODE_DETAIL[79] = bytecode('iastore', 0);
    BYTECODE_DETAIL[80] = bytecode('lastore', 0);
    BYTECODE_DETAIL[81] = bytecode('fastore', 0);
    BYTECODE_DETAIL[82] = bytecode('dastore', 0);
    BYTECODE_DETAIL[83] = bytecode('aastore', 0);
    BYTECODE_DETAIL[84] = bytecode('bastore', 0);
    BYTECODE_DETAIL[85] = bytecode('castore', 0);
    BYTECODE_DETAIL[86] = bytecode('sastore', 0);
    BYTECODE_DETAIL[87] = bytecode('pop', 0);
    BYTECODE_DETAIL[88] = bytecode('pop2', 0);
    BYTECODE_DETAIL[89] = bytecode('dup', 0);
    BYTECODE_DETAIL[90] = bytecode('dup_x1', 0);
    BYTECODE_DETAIL[91] = bytecode('dup_x2', 0);
    BYTECODE_DETAIL[92] = bytecode('dup2', 0);
    BYTECODE_DETAIL[93] = bytecode('dup2_x1', 0);
    BYTECODE_DETAIL[94] = bytecode('dup2_x2', 0);
    BYTECODE_DETAIL[95] = bytecode('swap', 0);
    BYTECODE_DETAIL[96] = bytecode('iadd', 0);
    BYTECODE_DETAIL[97] = bytecode('ladd', 0);
    BYTECODE_DETAIL[98] = bytecode('fadd', 0);
    BYTECODE_DETAIL[99] = bytecode('dadd', 0);
    BYTECODE_DETAIL[100] = bytecode('isub', 0);
    BYTECODE_DETAIL[101] = bytecode('lsub', 0);
    BYTECODE_DETAIL[102] = bytecode('fsub', 0);
    BYTECODE_DETAIL[103] = bytecode('dsub', 0);
    BYTECODE_DETAIL[104] = bytecode('imul', 0);
    BYTECODE_DETAIL[105] = bytecode('lmul', 0);
    BYTECODE_DETAIL[106] = bytecode('fmul', 0);
    BYTECODE_DETAIL[107] = bytecode('dmul', 0);
    BYTECODE_DETAIL[108] = bytecode('idiv', 0);
    BYTECODE_DETAIL[109] = bytecode('ldiv', 0);
    BYTECODE_DETAIL[110] = bytecode('fdiv', 0);
    BYTECODE_DETAIL[111] = bytecode('ddiv', 0);
    BYTECODE_DETAIL[112] = bytecode('irem', 0);
    BYTECODE_DETAIL[113] = bytecode('lrem', 0);
    BYTECODE_DETAIL[114] = bytecode('frem', 0);
    BYTECODE_DETAIL[115] = bytecode('drem', 0);
    BYTECODE_DETAIL[116] = bytecode('ineg', 0);
    BYTECODE_DETAIL[117] = bytecode('lneg', 0);
    BYTECODE_DETAIL[118] = bytecode('fneg', 0);
    BYTECODE_DETAIL[119] = bytecode('dneg', 0);
    BYTECODE_DETAIL[120] = bytecode('ishl', 0);
    BYTECODE_DETAIL[121] = bytecode('lshl', 0);
    BYTECODE_DETAIL[122] = bytecode('ishr', 0);
    BYTECODE_DETAIL[123] = bytecode('lshr', 0);
    BYTECODE_DETAIL[124] = bytecode('iushr', 0);
    BYTECODE_DETAIL[125] = bytecode('lushr', 0);
    BYTECODE_DETAIL[126] = bytecode('iadn', 0);
    BYTECODE_DETAIL[127] = bytecode('land', 0);
    BYTECODE_DETAIL[128] = bytecode('ior', 0);
    BYTECODE_DETAIL[129] = bytecode('lor', 0);
    BYTECODE_DETAIL[130] = bytecode('ixor', 0);
    BYTECODE_DETAIL[131] = bytecode('lxor', 0);
    BYTECODE_DETAIL[132] = bytecode('iinc', 2);
    BYTECODE_DETAIL[133] = bytecode('i2l', 0);
    BYTECODE_DETAIL[134] = bytecode('i2f', 0);
    BYTECODE_DETAIL[135] = bytecode('i2d', 0);
    BYTECODE_DETAIL[136] = bytecode('l2i', 0);
    BYTECODE_DETAIL[137] = bytecode('l2f', 0);
    BYTECODE_DETAIL[138] = bytecode('l2d', 0);
    BYTECODE_DETAIL[139] = bytecode('f2i', 0);
    BYTECODE_DETAIL[140] = bytecode('f2l', 0);
    BYTECODE_DETAIL[141] = bytecode('f2d', 0);
    BYTECODE_DETAIL[142] = bytecode('d2i', 0);
    BYTECODE_DETAIL[143] = bytecode('d2l', 0);
    BYTECODE_DETAIL[144] = bytecode('d2f', 0);
    BYTECODE_DETAIL[145] = bytecode('i2b', 0);
    BYTECODE_DETAIL[146] = bytecode('i2c', 0);
    BYTECODE_DETAIL[147] = bytecode('i2s', 0);
    BYTECODE_DETAIL[148] = bytecode('lcmp', 0);
    BYTECODE_DETAIL[149] = bytecode('fcmpl', 0);
    BYTECODE_DETAIL[150] = bytecode('fcmpg', 0);
    BYTECODE_DETAIL[151] = bytecode('dcmpl', 0);
    BYTECODE_DETAIL[152] = bytecode('dcmpg', 0);
    BYTECODE_DETAIL[153] = bytecode('ifeq', 2);
    BYTECODE_DETAIL[154] = bytecode('ifne', 2);
    BYTECODE_DETAIL[155] = bytecode('iflt', 2);
    BYTECODE_DETAIL[156] = bytecode('ifge', 2);
    BYTECODE_DETAIL[157] = bytecode('ifgt', 2);
    BYTECODE_DETAIL[158] = bytecode('ifle', 2);
    BYTECODE_DETAIL[159] = bytecode('if_icmpeq', 2);
    BYTECODE_DETAIL[160] = bytecode('if_icmpne', 2);
    BYTECODE_DETAIL[161] = bytecode('if_icmplt', 2);
    BYTECODE_DETAIL[162] = bytecode('if_icmpge', 2);
    BYTECODE_DETAIL[163] = bytecode('if_icmpgt', 2);
    BYTECODE_DETAIL[164] = bytecode('if_icmple', 2);
    BYTECODE_DETAIL[165] = bytecode('if_acmpeq', 2);
    BYTECODE_DETAIL[166] = bytecode('if_acmpne', 2);
    BYTECODE_DETAIL[167] = bytecode('goto', 2);
    BYTECODE_DETAIL[168] = bytecode('jsr', 2);
    BYTECODE_DETAIL[169] = bytecode('ret', 1);
    BYTECODE_DETAIL[170] = bytecode('tableswitch'); //variable length instruction
    BYTECODE_DETAIL[171] = bytecode('lookupswitch'); // variable length instruction
    BYTECODE_DETAIL[172] = bytecode('ireturn', 0);
    BYTECODE_DETAIL[173] = bytecode('lreturn', 0);
    BYTECODE_DETAIL[174] = bytecode('freturn', 0);
    BYTECODE_DETAIL[175] = bytecode('dreturn', 0);
    BYTECODE_DETAIL[176] = bytecode('areturn', 0);
    BYTECODE_DETAIL[177] = bytecode('return', 0);
    BYTECODE_DETAIL[178] = bytecode('getstatic', 2);
    BYTECODE_DETAIL[179] = bytecode('putstatic', 2);
    BYTECODE_DETAIL[180] = bytecode('getfield', 2);
    BYTECODE_DETAIL[181] = bytecode('putfield', 2);
    BYTECODE_DETAIL[182] = bytecode('invokevirtual', 2);
    BYTECODE_DETAIL[183] = bytecode('involespecial', 2);
    BYTECODE_DETAIL[184] = bytecode('invokestatic', 2);
    BYTECODE_DETAIL[185] = bytecode('invokeinterface', 4);// 4th byte must be zero
    BYTECODE_DETAIL[186] = bytecode('invokedynamic', 4);
    BYTECODE_DETAIL[187] = bytecode('new', 2);
    BYTECODE_DETAIL[188] = bytecode('newarray', 1);
    BYTECODE_DETAIL[189] = bytecode('anewarray', 2);
    BYTECODE_DETAIL[190] = bytecode('arraylength', 0);
    BYTECODE_DETAIL[191] = bytecode('athrow', 0);
    BYTECODE_DETAIL[192] = bytecode('checkcast', 2);
    BYTECODE_DETAIL[193] = bytecode('instanceof', 2);
    BYTECODE_DETAIL[194] = bytecode('monitorenter', 0);
    BYTECODE_DETAIL[195] = bytecode('monitorexit', 0);
    BYTECODE_DETAIL[196] = bytecode('wide'); // variable length instruction
    BYTECODE_DETAIL[197] = bytecode('multianewarray', 3);
    BYTECODE_DETAIL[198] = bytecode('ifnull', 2);
    BYTECODE_DETAIL[199] = bytecode('ifnonnull', 2);
    BYTECODE_DETAIL[200] = bytecode('goto_w', 4);
    BYTECODE_DETAIL[201] = bytecode('jsr_w', 4);

    // reserved opcode
    BYTECODE_DETAIL[202] = bytecode('breakpoint');
    BYTECODE_DETAIL[254] = bytecode('impdep1');
    BYTECODE_DETAIL[255] = bytecode('impdep2');

    function bytecode(name, num) {
        var fn;

        if (name === 'tableswitch') {
            fn = parseTableswitch;
        } else if (name === 'lookupswitch') {
            fn = parseLookupswitch;
        } else if (name === 'wide') {
            fn = parseWide;
        } else if (num === 0) {
            fn = parse0;
        } else if (num === 1) {
            fn = parse1;
        } else if (num === 2) {
            fn = parse2;
        } else if (num === 3) {
            fn = parse3;
        } else if (num === 4) {
            fn = parse4;
        }
        return {
            name:name,
            parse:fn
        }
    }


    function parse0(code, index) {
        return {
            pc:index,
            opecode:code[index],
            operand:[]
        };
    }

    function parse1(code, index) {
        return {
            pc:index,
            opecode:code[index],
            operand:[code[index + 1]]
        };
    }

    function parse2(code, index) {
        return {
            pc:index,
            opecode:code[index],
            operand:[code[index + 1], code[index + 2]]
        };
    }

    function parse3(code, index) {
        return {
            pc:index,
            opecode:code[index],
            operand:[code[index + 1], code[index + 2], code[index + 3]]
        };
    }

    function parse4(code, index) {
        return {
            pc:index,
            opecode:code[index],
            operand:[code[index + 1], code[index + 2], code[index + 3], code[index + 4]]
        };
    }

    function parseTableswitch(code, index) {
        var defaultByteIndex = index + 1,
            i = index + 1,
            len,
            low,
            high,
            numJumpOffset,
            operand = [];

        while (defaultByteIndex % 4 !== 0) {
            defaultByteIndex++;
        }

        low = code[defaultByteIndex + 4] << 24 | code[defaultByteIndex + 5] << 16 | code[defaultByteIndex + 6] << 8 | code[defaultByteIndex + 7];
        high = code[defaultByteIndex + 8] << 24 | code[defaultByteIndex + 9] << 16 | code[defaultByteIndex + 10] << 8 | code[defaultByteIndex + 11];

        numJumpOffset = (high - low + 1);

        len = defaultByteIndex + (3 + numJumpOffset) * 4 - index + 1;
        while (i < len) {
            operand.push(code[i]);
            i++;
        }
        return {
            pc:index,
            opecode:code[index],
            operand:operand
        };
    }

    function parseLookupswitch(code, index) {
        var defaultByteIndex = index + 1,
            i = index + 1,
            len,
            npairs,
            operand = [];

        while (defaultByteIndex % 4 !== 0) {
            defaultByteIndex++;
        }

        npairs = code[defaultByteIndex + 4] << 24 | code[defaultByteIndex + 5] << 16 | code[defaultByteIndex + 6] << 8 | code[defaultByteIndex + 7];

        len = defaultByteIndex + (2 + npairs * 2) * 4 - index + 1;
        while (i < len) {
            operand.push(code[i]);
            i++;
        }
        return {
            pc:index,
            opecode:code[index],
            operand:operand
        };
    }

    function parseWide(code, index) {
        var operand;

        if (code[index + 1] === 132) {
            operand = [code[index + 1], code[index + 2], code[index + 3]];
        } else {
            operand = [code[index + 1], code[index + 2], code[index + 3], code[index + 4], code[index + 5]];
        }

        return {
            pc:index,
            opecode:code[index],
            operand:operand
        };
    }

    JVM.ByteCodeParser.BYTECODE_DETAIL = BYTECODE_DETAIL;

    JVM.ByteCodeParser.parse = function (code) {
        var i,
            len = code.length,
            byteCode,
            byteCodeArray = [];

        for (i = 0; i < len; i++) {
            try {
                byteCode = BYTECODE_DETAIL[code[i]].parse(code, i);
            } catch (e) {
                throw e;
            }
            byteCodeArray.push(byteCode)

            i += byteCode.operand.length
        }

        return byteCodeArray;

    };


})();